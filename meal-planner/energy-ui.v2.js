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
const templates=[{"id":"a","tr":"A · Sırt ve omuz","en":"A · Back and shoulders","day":0,"type":"supersets","minutes":"","moves":["Dumbbell row","Dumbbell lateral raise","Close grip front lat pulldown","Rear pec deck","Seated row (rowing machine)","Shoulder press / front raise","Face pull","Back extension"],"trNote":"Shoulder press ile front raise arasında ok var. Set ve tekrarlar belirtilmemiş.","enNote":"Shoulder press and front raise are linked by an arrow. Sets and reps unspecified."},{"id":"legs","tr":"B · Bacak","en":"B · Legs","day":2,"type":"supersets","minutes":"","moves":[],"trNote":"Hareket listesi henüz girilmedi.","enNote":"Exercise list not yet entered."},{"id":"arms","tr":"C · Göğüs ve kollar","en":"C · Chest and arms","day":4,"type":"supersets","minutes":"","moves":[],"trNote":"Hareket listesi henüz girilmedi.","enNote":"Exercise list not yet entered."},{"id":"treadmill","tr":"Kardiyo · Koşu bandı","en":"Cardio · Treadmill","type":"treadmill","minutes":20,"speed":7.75,"grade":12,"gait":"","moves":[],"trNote":"20 dk; hız 7,5 ile 8,0; incline 12. Hesap km/sa ve yüzde varsayar. Başlangıç hızı aralığın ortasıdır. Gerçek hız ve hareket biçimini seç.","enNote":"20 min; speed 7.5 to 8.0; incline 12. Calculator assumes km/h and percent grade. Initial speed is the midpoint. Confirm actual speed and gait."},{"id":"elliptical","tr":"Kardiyo · Eliptik","en":"Cardio · Elliptical","type":"ellipticalUnknown","minutes":15,"moves":[],"trNote":"15 dk; zorluk 2 veya 3; RPM 50 ve üzeri. Bu cihaz değerleri tek başına MET belirlemez; yoğunluğu seç.","enNote":"15 min; level 2 or 3; RPM 50 or above. Machine settings do not determine MET; select effort."},{"id":"core","tr":"Karın","en":"Core","type":"coreUnknown","minutes":"","moves":["Machine crunches","Criss-cross","Leg raise","Plank · 4 sets"],"trNote":"Machine crunches yanında 80 yazıyor; tekrar mı ağırlık mı belli değil. Plank 4 set. Diğer set, tekrar ve süreler belirtilmemiş.","enNote":"Machine crunches is marked 80; reps versus load unclear. Plank: 4 sets. Other sets, reps and durations unspecified."}];
const TRAIN_KEY='mealplanner:v2:trainingNotes';
let notes=read(TRAIN_KEY,{})||{};
function renderTraining(){
 const host=$('trainingCards');if(!host)return;
 $('trainingTitle').textContent=T('Antrenman programı','Training plan');
 $('trainingIntro').textContent=T('Örnek süperset planı: Pazartesi sırt ve omuz, Çarşamba bacak, Cuma göğüs ve kollar. Kardiyo ve karın günlerini sen seç. Hesaplayıcıya eklerken aynı egzersizi iki kez kaydetme.','Example superset split: Monday back and shoulders, Wednesday legs, Friday chest and arms. Choose cardio and core days. Avoid counting the same exercise twice.');
 host.replaceChildren();
 for(const t of templates){
  const card=document.createElement('article');card.className='energy-session';
  const h=document.createElement('h3');h.textContent=en()?t.en:t.tr;card.append(h);
  if(t.day!==undefined){const day=document.createElement('p');day.className='small muted';day.textContent=T('Gün: ','Day: ')+weekdays[en()?'en':'tr'][t.day];card.append(day)}
  if(t.moves.length){const ul=document.createElement('ul');for(const move of t.moves){const li=document.createElement('li');li.textContent=move;ul.append(li)}card.append(ul)}
  const hint=document.createElement('p');hint.className='small muted';hint.textContent=en()?t.enNote:t.trNote;card.append(hint);
  const label=document.createElement('label');label.className='training-note-label';label.textContent=T('Kendi hareket, set, tekrar ve ağırlık notların','Your exercises, sets, reps and weight notes');
  const ta=document.createElement('textarea');ta.rows=2;ta.value=notes[t.id]||'';ta.onchange=()=>{notes[t.id]=ta.value;save(TRAIN_KEY,notes)};label.append(ta);card.append(label);
  const btn=document.createElement('button');btn.type='button';btn.className='btn main';const added=state.sessions.some(s=>s.templateId===t.id);
  btn.textContent=added?T('Hesaplayıcıya eklendi','Added to calculator'):T('Kalori hesabına ekle','Add to calorie calculator');btn.disabled=added;
  btn.onclick=()=>{if(state.sessions.some(s=>s.templateId===t.id))return;
   state.sessions.push({templateId:t.id,type:t.type,minutes:t.minutes,days:t.day===undefined?[]:[t.day],speed:t.speed??'',grade:t.grade??'',gait:t.gait??''});
   save(KEY,state);renderSessions();renderTraining();refresh();
  };card.append(btn);host.append(card);
 }
}
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
  const heading=document.createElement('strong');const template=templates.find(t=>t.id===s.templateId);heading.textContent=template?(en()?template.en:template.tr):T('Antrenman ','Workout ')+(i+1);
  const del=document.createElement('button');del.type='button';del.className='btn';del.textContent=T('Sil','Remove');
  del.onclick=()=>{state.sessions.splice(i,1);save(KEY,state);renderSessions();renderTraining();refresh()};
  header.append(heading,del);
  const fields=document.createElement('div');fields.className='energy-session-fields';
  const typeLabel=document.createElement('label');typeLabel.textContent=T('Egzersiz türü','Activity');
  const type=document.createElement('select');
  for(const [id,def] of Object.entries(M.ACTIVITY)) {
   if(id==='rest')continue;
   const option=document.createElement('option');option.value=id;option.textContent=en()?def.labelEN:def.labelTR;
   option.selected=s.type===id;type.append(option);
  }
  type.onchange=()=>{s.type=type.value;save(KEY,state);renderSessions();refresh()};
  typeLabel.append(type);
  const durationLabel=document.createElement('label');durationLabel.textContent=T('Dakika / seans','Minutes per session');
  const duration=document.createElement('input');duration.type='number';duration.min='1';duration.max='300';duration.step='5';duration.inputMode='numeric';duration.value=s.minutes;
  duration.onchange=()=>{
    const v=Number(duration.value);
    if(duration.value.trim()===''){s.minutes='';save(KEY,state);refresh();return}
    if(!Number.isFinite(v)||v<1||v>300){duration.value=s.minutes;return}
    s.minutes=v;save(KEY,state);refresh();
  };
  durationLabel.append(duration);
  fields.append(typeLabel,durationLabel);
  if(s.type==='treadmill'){
   for(const [key,tr,eng,min,max,step] of [['speed','Hız (km/sa)','Speed (km/h)',0.1,24,0.05],['grade','Eğim (%)','Grade (%)',0,30,0.1]]){
    const label=document.createElement('label');label.textContent=T(tr,eng);const input=document.createElement('input');input.type='number';input.min=min;input.max=max;input.step=step;input.value=s[key]??'';input.onchange=()=>{s[key]=input.value;save(KEY,state);refresh()};label.append(input);fields.append(label);
   }
   const label=document.createElement('label');label.textContent=T('Hareket biçimi','Gait');const gait=document.createElement('select');
   for(const [v,tr,eng] of [['','Seç','Select'],['walk','Yürüyüş','Walking'],['run','Koşu / jogging','Running / jogging']]){const opt=document.createElement('option');opt.value=v;opt.textContent=T(tr,eng);opt.selected=(s.gait||'')===v;gait.append(opt)}
   gait.onchange=()=>{s.gait=gait.value;save(KEY,state);refresh()};label.append(gait);fields.append(label);
  }
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
  const estimate=document.createElement('p');estimate.className='small muted';estimate.dataset.sessionIndex=i;
  card.append(header,fields,dayLabel,days,estimate);host.append(card);
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
 if(root.EnergyBalance._shownLanguage!==locale){root.EnergyBalance._shownLanguage=locale;renderSessions();renderTraining();}
 const p={...state,age:Number(state.age),height:Number(state.height),weight:Number(state.weight)};
 // Empty strings are invalid, even though Number('') evaluates to zero.
 const valid=state.age!==''&&state.height!==''&&state.weight!==''&&M.profileValid(p);
 $('energyIncomplete').classList.toggle('hidden',valid);
 $('energyResults').classList.toggle('hidden',!valid);
 if(!valid)return;
 const daily=M.dailyEnergy(p,state.sessions),bridge=root.MealPlannerBridge;
 const week=bridge?.getWeek?.(),cat=bridge?.getCatalog?.(),monday=bridge?.getMonday?.();
 const plan=(week&&cat)?E.weekNutrition(week.days,E.indexCatalog(cat)).map((x,i)=>week.days[i]?.length?x.kcal:null):null;
 const complete=daily.every(x=>!x.incomplete),maintenanceAvg=complete?M.average(daily.map(x=>x.maintenance)):null,exerciseAvg=complete?M.average(daily.map(x=>x.exercise)):null;
 const missingDays=state.sessions.some(s=>!Array.isArray(s.days)||!s.days.length),uncertain=$('energyUncertain');
 const warning=!complete||missingDays||daily.some(x=>x.outOfRange);uncertain.classList.toggle('hidden',!warning);
 uncertain.textContent=[!complete?T('Bazı antrenmanların süresi, hareket biçimi veya yoğunluğu eksik. İlgili günlerin hesabı gösterilmiyor.','Some workouts have missing duration, gait or effort. Affected daily totals are unavailable.'):null,missingDays?T('Gün seçilmemiş antrenmanlar haftalık toplama dahil değildir.','Workouts without assigned days are excluded.'):null,daily.some(x=>x.outOfRange)?T('Koşu bandı hızı ACSM denkleminin en uygun aralığı dışında. Tahmin daha belirsiz.','Treadmill speed is outside the preferred ACSM range. The estimate is more uncertain.'):null].filter(Boolean).join(' ');
 document.querySelectorAll('[data-session-index]').forEach(el=>{const s=state.sessions[Number(el.dataset.sessionIndex)],est=M.sessionEstimate(s,p.weight,daily[0].base/1440);el.textContent=est?T('Seans başına tahmini net ek harcama: ','Estimated net additional expenditure per session: ')+fmt(Math.round(est.net))+' kcal'+(est.outOfRange?T(' (aralık dışı)',' (outside preferred speed range)'):''):T('Hesaplamak için süre, tür ve gerekirse hız/eğim/hareket biçimini tamamla.','Complete duration, activity and any treadmill parameters to estimate expenditure.');});
 $('energyRest').textContent=fmt(Math.round(daily[0].rest));
 $('energyMaintenance').textContent=maintenanceAvg===null?'—':fmt(Math.round(maintenanceAvg));
 $('energyWorkout').textContent=exerciseAvg===null?'—':fmt(Math.round(exerciseAvg));
 const plannedGap=complete&&plan&&plan.every(x=>x!==null)?M.average(daily.map((x,i)=>x.maintenance-plan[i])):null;
 $('energyPlanGap').textContent=plannedGap===null?'—':deficitText(plannedGap);
 const chosenDeficit=Math.max(0,Math.min(1000,Number(state.deficit)||0));
 const proposed=maintenanceAvg===null?null:maintenanceAvg-chosenDeficit;
 $('energyTargetCalories').textContent=proposed===null?'—':proposed<1200?T('Çok düşük hedef, uzmanla değerlendir','Very low target, seek professional guidance'):fmt(Math.round(proposed))+' '+T('kcal/gün','kcal/day');
 const rows=$('energyDayRows');rows.replaceChildren();
 let loggedDays=0,loggedTotal=0;
 for(let i=0;i<7;i++){
  const tr=document.createElement('tr');
  const day=document.createElement('td');day.textContent=weekdays[locale][i];
  const need=document.createElement('td');need.textContent=daily[i].maintenance===null?'—':fmt(Math.round(daily[i].maintenance));
  const food=document.createElement('td');food.textContent=plan&&plan[i]!==null?fmt(Math.round(plan[i])):'—';
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
  if(logged!==null&&balance.loggedBalance!==null){loggedDays++;loggedTotal+=balance.loggedBalance;}
  tr.append(day,need,food,actual,diff);rows.append(tr);
 }
 $('energyLoggedSummary').textContent=loggedDays?T('Kayıt girilen ','Logged ')+loggedDays+T(' gün için ortalama tahmini fark: ',' days, average estimated balance: ')+deficitText(loggedTotal/loggedDays)+' kcal.':T('Henüz gerçek tüketim girilmedi. Tablodaki farklar öğün planına göre tahmindir.','No actual intake logged. The balances shown are based on your meal plan.');
}
function init(){
 if(!$('energyPane'))return;
 for(const [id,key] of [['energyAge','age'],['energyHeight','height'],['energyWeight','weight'],['energyCoefficient','coefficient'],['energyActivity','activity'],['energyDeficit','deficit']])numberInput(id,key);
 $('energyAddSession').onclick=()=>{
  if(state.sessions.length>=30)return;
  state.sessions.push({type:'weights',minutes:60,days:[]});
  save(KEY,state);renderSessions();refresh();
 };
 root.EnergyBalance.refresh=refresh;
 root.EnergyBalance._shownLanguage='';
 renderSessions();renderTraining();refresh();
}
root.EnergyBalance={refresh:()=>{},_shownLanguage:''};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})(globalThis);
