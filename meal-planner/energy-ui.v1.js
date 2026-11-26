/* Energy balance UI, stored locally per browser. Does not transmit measurements. */
(function(root){
'use strict';
const M=root.EnergyMath,E=root.MealEngine;
const KEY='mealplanner:v2:energyProfile',LOG='mealplanner:v2:energyLog:';
const $=id=>document.getElementById(id);
const getLang=()=>root.MealPlannerBridge?.getLanguage?.()||'tr';
const en=()=>getLang()==='en';
const T=(tr,eng)=>en()?eng:tr;
const fmt=n=>new Intl.NumberFormat(en()?'en-US':'tr-TR',{maximumFractionDigits:0}).format(n);
const read=(key,fallback)=>{try{const value=localStorage.getItem(key);return value===null?fallback:JSON.parse(value)}catch{return fallback}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
const defaults={age:'',height:'',weight:'',coefficient:'',activity:'sedentary',deficit:300,sessions:[]};
let state=read(KEY,defaults);
if(!state||typeof state!=='object'||Array.isArray(state))state={...defaults};
if(!Array.isArray(state.sessions))state.sessions=[];
if(!M.BASE.some(x=>x.id===state.activity))state.activity='sedentary';
const weekdays={tr:['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'],en:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']};
const numberInput=(id,prop)=>{const el=$(id);if(!el)return;el.value=state[prop]??'';el.addEventListener('change',()=>{
 state[prop]=el.value;
 save(KEY,state);refresh();
});};
function translateStatic(){
 for(const el of document.querySelectorAll('#energyPane [data-energy-en]')){
  // Avoid overwriting form elements. Only labels, span, headings, and options are translated.
  if(el.tagName==='INPUT')continue;
  const original=el.dataset.energyTr;
  if(original===undefined){el.dataset.energyTr=el.textContent;}
  el.textContent=en()?el.dataset.energyEn:el.dataset.energyTr;
 }
 $('energyAddSession').textContent=T('+ Antrenman ekle','+ Add workout');
}
function renderSessions(){
 const host=$('energySessions');if(!host)return;
 host.replaceChildren();
 state.sessions.forEach((s,i)=>{
  const card=document.createElement('div');card.className='energy-session';
  const header=document.createElement('div');header.className='panelheader';
  const heading=document.createElement('strong');heading.textContent=T('Antrenman ','Workout ')+(i+1);
  const del=document.createElement('button');del.type='button';del.className='btn';del.textContent=T('Sil','Remove');
  del.onclick=()=>{state.sessions.splice(i,1);save(KEY,state);renderSessions();refresh()};
  header.append(heading,del);
  const fields=document.createElement('div');fields.className='energy-session-fields';
  const typeLabel=document.createElement('label');typeLabel.textContent=T('Egzersiz türü','Activity');
  const type=document.createElement('select');
  for(const [id,def] of Object.entries(M.ACTIVITY)) {
   if(id==='rest')continue;
   const option=document.createElement('option');option.value=id;option.textContent=en()?def.labelEN:def.labelTR;
   option.selected=s.type===id;type.append(option);
  }
  type.onchange=()=>{s.type=type.value;save(KEY,state);refresh()};
  typeLabel.append(type);
  const durationLabel=document.createElement('label');durationLabel.textContent=T('Dakika / seans','Minutes per session');
  const duration=document.createElement('input');duration.type='number';duration.min='1';duration.max='300';duration.step='5';duration.inputMode='numeric';duration.value=s.minutes;
  duration.onchange=()=>{
    const v=Number(duration.value);
    if(!Number.isFinite(v)||v<1||v>300){duration.value=s.minutes;return}
    s.minutes=v;save(KEY,state);refresh();
  };
  durationLabel.append(duration);
  fields.append(typeLabel,durationLabel);
  const dayLabel=document.createElement('p');dayLabel.className='small muted';dayLabel.textContent=T('Antrenman günleri','Workout days');
  const days=document.createElement('div');days.className='energy-day-checks';
  for(let d=0;d<7;d++){
   const label=document.createElement('label');label.className='energy-day-check';
   const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=Array.isArray(s.days)&&s.days.includes(d);
   const text=document.createElement('span');text.textContent=weekdays[en()?'en':'tr'][d];
   checkbox.onchange=()=>{
    const selected=new Set(Array.isArray(s.days)?s.days:[]);
    if(checkbox.checked)selected.add(d);else selected.delete(d);
    s.days=[...selected].sort((a,b)=>a-b);save(KEY,state);refresh();
   };
   label.append(checkbox,text);days.append(label);
  }
  card.append(header,fields,dayLabel,days);host.append(card);
 });
 $('energySessionHint').textContent=state.sessions.length?
  T('Aynı gün birden fazla antrenman seçersen süreleri toplanır.','If you select multiple workouts on the same day, their energy estimates are added.'):
  T('Henüz egzersiz eklenmedi. Antrenman yapmıyorsan bu alanı boş bırakabilirsin.','No workouts entered. Leave this blank if you do not exercise.');
}
function getLog(date){
 const value=read(LOG+date,null);
 return value===null||value===''||!Number.isFinite(Number(value))||Number(value)<0?null:Number(value);
}
function dateOfWeek(monday,index){return E.addDays(monday,index)}
function deficitText(v){
 if(v===null||!Number.isFinite(v))return '—';
 const value=Math.round(Math.abs(v));
 return (v>=0?'+':'−')+fmt(value);
}
function refresh(){
 if(!$('energyPane'))return;
 translateStatic();
 const locale=en()?'en':'tr';
 // Repaint sessions only when language changed. Avoid losing focused inputs.
 if(root.EnergyBalance._shownLanguage!==locale){root.EnergyBalance._shownLanguage=locale;renderSessions();}
 const p={...state,age:Number(state.age),height:Number(state.height),weight:Number(state.weight)};
 // Empty strings are invalid, even though Number('') evaluates to zero.
 const valid=state.age!==''&&state.height!==''&&state.weight!==''&&M.profileValid(p);
 $('energyIncomplete').classList.toggle('hidden',valid);
 $('energyResults').classList.toggle('hidden',!valid);
 if(!valid)return;
 const daily=M.dailyEnergy(p,state.sessions),bridge=root.MealPlannerBridge;
 const week=bridge?.getWeek?.(),cat=bridge?.getCatalog?.(),monday=bridge?.getMonday?.();
 const plan=(week&&cat)?E.weekNutrition(week.days,E.indexCatalog(cat)).map(x=>x.kcal):null;
 const maintenanceAvg=M.average(daily.map(x=>x.maintenance));
 const exerciseAvg=M.average(daily.map(x=>x.exercise));
 $('energyRest').textContent=fmt(Math.round(daily[0].rest));
 $('energyMaintenance').textContent=fmt(Math.round(maintenanceAvg));
 $('energyWorkout').textContent=fmt(Math.round(exerciseAvg));
 const plannedGap=plan?M.average(daily.map((x,i)=>x.maintenance-plan[i])):null;
 $('energyPlanGap').textContent=plannedGap===null?'—':deficitText(plannedGap);
 const chosenDeficit=Math.max(0,Math.min(1000,Number(state.deficit)||0));
 const proposed=maintenanceAvg-chosenDeficit;
 $('energyTargetCalories').textContent=proposed<1200?T('Çok düşük hedef, uzmanla değerlendir','Very low target, seek professional guidance'):fmt(Math.round(proposed))+' '+T('kcal/gün','kcal/day');
 const rows=$('energyDayRows');rows.replaceChildren();
 let loggedDays=0,loggedTotal=0;
 for(let i=0;i<7;i++){
  const tr=document.createElement('tr');
  const day=document.createElement('td');day.textContent=weekdays[locale][i];
  const need=document.createElement('td');need.textContent=fmt(Math.round(daily[i].maintenance));
  const food=document.createElement('td');food.textContent=plan?fmt(Math.round(plan[i])):'—';
  const actual=document.createElement('td');
  const input=document.createElement('input');input.className='energy-log-input';input.type='number';input.min='0';input.max='15000';input.step='1';input.inputMode='numeric';input.placeholder='—';
  input.setAttribute('aria-label',weekdays[locale][i]+' '+T('gerçekte tüketilen kcal','actual calories eaten'));
  const date=monday?dateOfWeek(monday,i):null;
  const logged=date?getLog(date):null;
  input.value=logged===null?'':logged;
  input.onchange=()=>{
   if(!date)return;
   if(input.value.trim()===''){
    try{localStorage.removeItem(LOG+date)}catch{}
   }else{
    const value=Number(input.value);
    if(!Number.isFinite(value)||value<0||value>15000){input.value=logged===null?'':logged;return}
    save(LOG+date,value);
   }
   refresh();
  };
  if(!date)input.disabled=true;
  actual.append(input);
  const diff=document.createElement('td');
  const balance=M.dayBalance(daily[i].maintenance,plan?plan[i]:null,logged);
  const value=logged===null?balance.plannedBalance:balance.loggedBalance;
  diff.className='energy-difference'+(value>=0?' energy-deficit':' energy-surplus');
  diff.textContent=value===null?'—':deficitText(value);
  const type=document.createElement('small');type.textContent=logged===null?T('plan','plan'):T('kayıt','logged');
  diff.append(type);
  if(logged!==null){loggedDays++;loggedTotal+=balance.loggedBalance;}
  tr.append(day,need,food,actual,diff);rows.append(tr);
 }
 $('energyLoggedSummary').textContent=loggedDays?T('Kayıt girilen ','Logged ')+loggedDays+T(' gün için ortalama tahmini fark: ',' days, average estimated balance: ')+deficitText(loggedTotal/loggedDays)+' kcal.':T('Henüz gerçek tüketim girilmedi. Tablodaki farklar öğün planına göre tahmindir.','No actual intake logged. The balances shown are based on your meal plan.');
}
function init(){
 if(!$('energyPane'))return;
 for(const [id,key] of [['energyAge','age'],['energyHeight','height'],['energyWeight','weight'],['energyCoefficient','coefficient'],['energyActivity','activity'],['energyDeficit','deficit']])numberInput(id,key);
 $('energyAddSession').onclick=()=>{
  if(state.sessions.length>=8)return;
  state.sessions.push({type:'weights',minutes:60,days:[]});
  save(KEY,state);renderSessions();refresh();
 };
 root.EnergyBalance.refresh=refresh;
 root.EnergyBalance._shownLanguage='';
 renderSessions();refresh();
}
root.EnergyBalance={refresh:()=>{},_shownLanguage:''};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})(globalThis);
