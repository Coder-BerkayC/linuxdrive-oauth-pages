(function(){
'use strict';
const E=globalThis.MealEngine;
const PRE='mealplanner:v2:';
const $=id=>document.getElementById(id);
const weekdays=['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
const money=n=>new Intl.NumberFormat('tr-TR',{maximumFractionDigits:0}).format(n)+' TL';
const number=n=>new Intl.NumberFormat('tr-TR',{maximumFractionDigits:1}).format(n);
const read=(key,fallback)=>{try{let v=localStorage.getItem(key);return v===null?fallback:JSON.parse(v)}catch{return fallback}};
const write=(key,v)=>{try{localStorage.setItem(key,JSON.stringify(v))}catch{showStatus('Tarayıcı kaydı yapılamadı')}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
let catalog=null,idx=null,offset=0,dayIndex=0,tab='plan',filter='all',search='',week=null,activeWeekKey=null;
let profile=read(PRE+'profile',{calories:0,referenceKg:0,proteinPerKg:1.6,proteinManual:0});
let stocks=read(PRE+'stocks',{}),prices=read(PRE+'prices',{});
const monday=()=>E.addDays(E.startOfWeek(),offset*7);
const dateFormat=iso=>new Intl.DateTimeFormat('tr-TR',{timeZone:'UTC',day:'numeric',month:'short'}).format(new Date(iso+'T12:00:00Z'));
function showStatus(msg){const el=$('status');if(el)el.textContent=msg}
function migrate(){
 if(read(PRE+'migrated',false))return;
 const s=read('mealplan:v1:stock',{}),p=read('mealplan:v1:prices',{});
 for(const id of Object.keys(s))if(s[id] && stocks[id]===undefined)stocks[id]=true;
 for(const id of Object.keys(p))if(typeof p[id]==='number'&&prices[id]===undefined)prices[id]=p[id];
 write(PRE+'stocks',stocks);write(PRE+'prices',prices);write(PRE+'migrated',true);
}
function loadWeek(){
 const key=PRE+'week:'+monday();
 activeWeekKey=key;
 week=read(key,null);
 if(!week||!Array.isArray(week.days)||week.days.length!==7){
   const template=read(PRE+'lastTemplate',null);
   week=E.initialWeek(template);
   write(key,week);
 }
 for(let n=0;n<7;n++)if(!Array.isArray(week.days[n]))week.days[n]=[];
 if(!week.purchased||typeof week.purchased!=='object')week.purchased={};
}
function saveWeek(template=true){
 write(PRE+'week:'+monday(),week);
 if(template)write(PRE+'lastTemplate',week.days);
}
function goals(){
 const calories=Math.max(0,Number(profile.calories)||0);
 const manually=Math.max(0,Number(profile.proteinManual)||0);
 const calc=Math.max(0,Number(profile.referenceKg)||0)*Math.max(0,Number(profile.proteinPerKg)||0);
 return {calories,protein:manually||calc};
}
const recipeMacros=r=>E.nutrition(r,idx.ingredients);
const totals=()=>E.weekNutrition(week.days,idx);
const shopping=()=>E.groceries(week.days,idx);
function renderHeader(){
 const m=monday(),last=E.addDays(m,6),dayTotals=totals(),goods=shopping();
 const sum=dayTotals.reduce((a,d)=>{a.kcal+=d.kcal;a.protein+=d.protein;return a},{kcal:0,protein:0});
 $('weekLabel').textContent=dateFormat(m)+' ile '+dateFormat(last)+(offset===0?' · Bu hafta':'');
 $('avgCalories').textContent=Math.round(sum.kcal/7).toLocaleString('tr-TR');
 $('avgProtein').textContent=number(sum.protein/7)+' g';
 $('ingredientCount').textContent=goods.length;
}
function mealOptions(selected){
 const frag=document.createDocumentFragment();
 const cats=[...new Set(catalog.recipes.map(x=>x.category))];
 cats.forEach(c=>{const og=document.createElement('optgroup');og.label=c;
 catalog.recipes.filter(x=>x.category===c).forEach(r=>{
   const opt=document.createElement('option');opt.value=r.id;opt.textContent=r.name;opt.selected=r.id===selected;og.append(opt);
 });frag.append(og)});
 return frag;
}
function addMeal(){const meals=week.days[dayIndex];if(meals.length>=8)return;
 const next=1+Math.max(0,...meals.map(m=>parseInt(String(m.id).replace(/[^0-9]/g,''),10)||0));
 meals.push({id:'meal'+next,recipeId:'snack',portions:1});
 saveWeek();render();
}
function renderPlan(){
 const m=monday();const dayTotals=totals();
 const days=$('days');days.replaceChildren();
 dayTotals.forEach((d,i)=>{
 const btn=document.createElement('button');btn.className='daybtn'+(i===dayIndex?' active':'');
 btn.setAttribute('aria-pressed',String(i===dayIndex));
 btn.innerHTML='<strong>'+weekdays[i]+'</strong><small>'+dateFormat(E.addDays(m,i))+'</small>';
 btn.onclick=()=>{dayIndex=i;renderPlan()};
 days.append(btn);
 });
 $('dayHeading').textContent=weekdays[dayIndex]+' · '+dateFormat(E.addDays(m,dayIndex));
 const meals=week.days[dayIndex],list=$('slots');list.replaceChildren();
 meals.forEach((meal,pos)=>{
  const card=document.createElement('div');card.className='slot';
  const head=document.createElement('div');head.className='slotHead';
  const title=document.createElement('label');title.textContent='Öğün '+(pos+1);
  const nm=document.createElement('span');nm.className='small muted';nm.textContent=(idx.recipes[meal.recipeId]?.category)||'Tarif seç';
  head.append(title,nm);
  const fields=document.createElement('div');fields.className='slotFields';
  const choice=document.createElement('select');choice.setAttribute('aria-label',(pos+1)+'. öğün tarifi');
  choice.append(mealOptions(meal.recipeId));
  choice.addEventListener('change',()=>{meal.recipeId=choice.value;saveWeek();render()});
  const p=document.createElement('input');p.type='number';p.step='0.5';p.min='0.5';p.max='10';p.value=meal.portions;
  p.setAttribute('aria-label','Porsiyon sayısı');
  p.addEventListener('change',()=>{const n=Number(p.value);meal.portions=Number.isFinite(n)?Math.min(10,Math.max(0.5,n)):1;p.value=meal.portions;saveWeek();render()});
  const remove=document.createElement('button');remove.type='button';remove.className='delbtn';remove.textContent='×';remove.title='Öğünü sil';remove.setAttribute('aria-label','Öğünü sil');
  remove.onclick=()=>{meals.splice(pos,1);saveWeek();render()};
  fields.append(choice,p,remove);card.append(head,fields);list.append(card);
 });
 $('mealCountText').textContent=meals.length+' öğün';
 $('addMeal').disabled=meals.length>=8;
 const selected=dayTotals[dayIndex],goal=goals();
 $('todayMacros').innerHTML=[
 ['Kalori',Math.round(selected.kcal)+' kcal'],['Protein',number(selected.protein)+' g'],
 ['Karbonhidrat',number(selected.carbs)+' g'],['Yağ',number(selected.fat)+' g']
 ].map(x=>'<div class="macro"><b>'+esc(x[1])+'</b><span>'+esc(x[0])+'</span></div>').join('');
 $('calorieTargetText').textContent=goal.calories?Math.round(selected.kcal)+' / '+goal.calories+' kcal':'Kalori hedefini Hedefler sekmesinden girebilirsin.';
 $('proteinTargetText').textContent=goal.protein?number(selected.protein)+' / '+number(goal.protein)+' g protein':'Protein hedefini Hedefler sekmesinden girebilirsin.';
 $('calorieProgress').style.width=(goal.calories?Math.min(100,selected.kcal/goal.calories*100):0)+'%';
 $('proteinProgress').style.width=(goal.protein?Math.min(100,selected.protein/goal.protein*100):0)+'%';
 const body=$('weekRows');body.replaceChildren();
 dayTotals.forEach((day,i)=>{
  const tr=document.createElement('tr');
  [weekdays[i],week.days[i].length+' öğün',Math.round(day.kcal).toLocaleString('tr-TR'),number(day.protein)+' g'].forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td)});
  body.append(tr);
 });
}
function sumPrice(goods){
 let total=0,unpriced=0,priced=0;
 for(const g of goods){if(stocks[g.id])continue;
  const raw=prices[g.id];
  if(typeof raw==='number'&&Number.isFinite(raw)&&raw>=0){total+=g.packs*raw;priced++}else unpriced++;
 }
 return {total,unpriced,priced};
}
function copyText(text,button){
 const old=button.textContent;
 const fallback=()=>{const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();try{document.execCommand('copy')}catch{}area.remove()};
 const report=()=>{button.textContent='Kopyalandı';setTimeout(()=>button.textContent=old,1400)};
 if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(report).catch(()=>{fallback();report()})}else{fallback();report()}
}
function itemRow(g){
 const item=document.createElement('div');item.className='item'+(week.purchased[g.id]?' bought':'');
 const checked=document.createElement('input');checked.className='check';checked.type='checkbox';checked.checked=!!week.purchased[g.id];checked.setAttribute('aria-label',g.ingredient.name+' alındı');
 checked.onchange=()=>{if(checked.checked)week.purchased[g.id]=true;else delete week.purchased[g.id];saveWeek(false);render()};
 const body=document.createElement('div');body.className='body';const name=document.createElement('div');name.className='title';name.textContent=g.ingredient.name;body.append(name);
 const quantity=document.createElement('div');quantity.className='detail';quantity.textContent='Gereken: '+E.amountLabel(g.quantity,g.ingredient.unit);body.append(quantity);
 const need=document.createElement('div');need.className='subdetail';need.textContent='Alınacak: '+E.packageLabel(g);body.append(need);
 const stock=document.createElement('button');stock.className='stock'+(stocks[g.id]?' on':'');stock.textContent=stocks[g.id]?'Evde var ✓':'Evde var mı?';
 stock.onclick=()=>{if(stocks[g.id])delete stocks[g.id];else stocks[g.id]=true;write(PRE+'stocks',stocks);render()};body.append(stock);
 const price=document.createElement('button');price.className='price';price.textContent=prices[g.id]===undefined?'Fiyat gir':money(prices[g.id]);price.setAttribute('aria-label',g.ingredient.name+' birim fiyatını gir');
 price.onclick=()=>{
  const inp=document.createElement('input');inp.className='priceedit';inp.type='number';inp.min='0';inp.step='0.01';inp.inputMode='decimal';inp.placeholder='TL';inp.value=prices[g.id]??'';
  price.replaceWith(inp);inp.focus();
  const commit=()=>{const raw=inp.value.trim().replace(',','.');if(raw==='')delete prices[g.id];else {const num=Number(raw);if(Number.isFinite(num)&&num>=0)prices[g.id]=num}write(PRE+'prices',prices);render()};
  inp.addEventListener('blur',commit,{once:true});inp.addEventListener('keydown',e=>{if(e.key==='Enter')inp.blur()});
 };
 item.append(checked,body,price);return item;
}
function renderShopping(){
 const goods=shopping(),cost=sumPrice(goods),remaining=goods.filter(g=>!stocks[g.id]&&!week.purchased[g.id]);
 $('shoppingInfo').innerHTML='Toplam <b>'+goods.length+'</b> farklı malzeme. Alınacak <b>'+remaining.length+'</b> ürün. Kayıtlı fiyat toplamı <b>'+(cost.priced?money(cost.total):'Henüz yok')+'</b>.'+(cost.unpriced?' <span class="muted">Fiyatı bilinmeyen '+cost.unpriced+' ürün dahil değil.</span>':'');
 const container=$('shopGroups');container.replaceChildren();
 for(const group of catalog.groups) {
  const items=goods.filter(g=>g.ingredient.group===group.id).filter(g=>{
    if(search&&!g.ingredient.name.toLocaleLowerCase('tr').includes(search))return false;
    if(filter==='needed')return !stocks[g.id]&&!week.purchased[g.id];
    if(filter==='bought')return !!week.purchased[g.id];
    if(filter==='stock')return !!stocks[g.id];
    return true;
  });
  if(!items.length)continue;
  const s=document.createElement('section');s.className='group';
  const title=document.createElement('div');title.className='gtitle';title.innerHTML='<h3>'+esc(group.name)+'</h3><small>'+items.length+' ürün</small>';s.append(title);
  const list=document.createElement('div');list.className='items';items.forEach(g=>list.append(itemRow(g)));s.append(list);container.append(s);
 }
 if(!container.children.length)container.innerHTML='<div class="panel muted">Bu filtrede ürün bulunamadı.</div>';
}
function renderRecipes(){
 const container=$('recipeList');container.replaceChildren();
 for(const recipe of catalog.recipes){
  const macro=recipeMacros(recipe),card=document.createElement('article');card.className='recipe';
  const head=document.createElement('div');head.className='recipehead';
  const title=document.createElement('div');title.innerHTML='<h3>'+esc(recipe.name)+'</h3><div class="subline">'+esc(recipe.servingLabel)+' · '+esc(recipe.category)+'</div>';
  const tag=document.createElement('span');tag.className='pill';tag.textContent=Math.round(macro.kcal)+' kcal · '+number(macro.protein)+' g protein';
  head.append(title,tag);card.append(head);
  const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Malzemeler ve tarif';
  details.append(summary);
  const h=document.createElement('h3');h.textContent='Bir porsiyon için';details.append(h);
  const ul=document.createElement('ul');
  recipe.ingredients.forEach(([id,qty])=>{const li=document.createElement('li');li.textContent=E.amountLabel(qty,idx.ingredients[id].unit)+' '+idx.ingredients[id].name;ul.append(li)});
  details.append(ul);const st=document.createElement('h3');st.textContent='Hazırlık';details.append(st);
  const ol=document.createElement('ol');recipe.steps.forEach(step=>{const li=document.createElement('li');li.textContent=step;ol.append(li)});
  details.append(ol);card.append(details);container.append(card);
 }
}
function renderProfile(){
 $('goalCalories').value=profile.calories||'';
 $('referenceKg').value=profile.referenceKg||'';
 $('proteinFactor').value=profile.proteinPerKg||1.6;
 $('proteinManual').value=profile.proteinManual||'';
 const g=goals();
 $('proteinEstimate').textContent=g.protein?'Günlük protein hedefin: '+number(g.protein)+' g':'Protein hedefi için referans ağırlık gir.';
 const daily=totals();
 const avg=daily.reduce((a,d)=>a+d.protein,0)/7;
 $('averageNutrition').textContent='Bu haftanın günlük protein ortalaması: '+number(avg)+' g.';
}
function summaryForAI(){
 const g=goals(),d=totals();const lines=[
 '7 günlük beslenme planı (yaklaşık değerler)',
 'Hedef kcal: '+(g.calories||'Belirlenmedi')+'; protein: '+(g.protein?number(g.protein)+' g':'Belirlenmedi'),
 'Sayısal hesapları yeniden uydurma. Tarifleri, çeşitliliği ve pratikliği değerlendir. Tıbbi tanı verme.'
 ];
 d.forEach((v,i)=>lines.push(weekdays[i]+': '+week.days[i].map(m=>(idx.recipes[m.recipeId]?.name||'Bilinmeyen')+' x '+m.portions).join(', ')+' | '+Math.round(v.kcal)+' kcal; '+number(v.protein)+' g protein'));
 lines.push('Soru: Bu 7 günlük düzeni hazırlama kolaylığı, çeşitlilik, yeterlilik ve alışveriş israfı açısından değerlendir.');
 return lines.join('\n');
}
function render(){
 if(!week||!catalog)return;
 renderHeader();renderPlan();renderShopping();renderProfile();
}
function switchTab(value){
 tab=value;
 document.querySelectorAll('[data-tab]').forEach(b=>{let a=b.dataset.tab===value;b.classList.toggle('active',a);b.setAttribute('aria-selected',String(a))});
 ['plan','shopping','recipes','goals'].forEach(p=>$(p+'Pane').classList.toggle('hidden',p!==value));
}
function bind(){
 document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
 $('previous').onclick=()=>{offset--;loadWeek();render()};
 $('next').onclick=()=>{offset++;loadWeek();render()};
 $('now').onclick=()=>{offset=0;dayIndex=0;loadWeek();render()};
 $('addMeal').onclick=addMeal;
 $('cloneDay').onclick=()=>{
  if(!confirm('Seçili günün öğünleri diğer 6 güne kopyalansın mı?'))return;
  const current=E.clone(week.days[dayIndex]);week.days=week.days.map(()=>E.clone(current));saveWeek();render();
 };
 $('applyCount').onclick=()=>{
  const value=parseInt($('dailyMealCount').value,10);
  if(!Number.isInteger(value)||value<1||value>8)return;
  if(!confirm('Bütün günlerdeki öğün sayısı '+value+' olsun mu? Fazla öğünler silinecek.'))return;
  for(const meals of week.days) {
    while(meals.length>value)meals.pop();
    while(meals.length<value)meals.push({id:'meal'+(meals.length+1),recipeId:'snack',portions:1});
  }
  saveWeek();render();
 };
 $('shopSearch').oninput=e=>{search=e.target.value.toLocaleLowerCase('tr');renderShopping()};
 document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{
  filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderShopping();
 });
 $('copyShopping').onclick=()=>{
  const goods=shopping().filter(g=>!stocks[g.id]&&!week.purchased[g.id]);const lines=['Alışveriş listesi · '+$('weekLabel').textContent];
  for(const group of catalog.groups){const items=goods.filter(g=>g.ingredient.group===group.id);if(items.length){lines.push('',group.name);items.forEach(g=>lines.push('☐ '+g.ingredient.name+' · '+E.packageLabel(g)))}}
  copyText(lines.join('\n'),$('copyShopping'));
 };
 $('resetPurchased').onclick=()=>{if(confirm('Sadece bu haftanın satın alındı işaretleri temizlensin mi?')){week.purchased={};saveWeek(false);render()}};
 ['goalCalories','referenceKg','proteinFactor','proteinManual'].forEach(id=>{
   $(id).addEventListener('change',()=>{
    const val=Number($(id).value);if(!Number.isFinite(val)||val<0)return;
    const map={goalCalories:'calories',referenceKg:'referenceKg',proteinFactor:'proteinPerKg',proteinManual:'proteinManual'};
    profile[map[id]]=id==='proteinFactor'?Math.min(3,Math.max(0.5,val)):val;
    write(PRE+'profile',profile);render();
   });
 });
 $('copyAI').onclick=()=>copyText(summaryForAI(),$('copyAI'));
 document.addEventListener('visibilitychange',()=>{
  if(!document.hidden){if(offset===0&&activeWeekKey!==PRE+'week:'+monday()){loadWeek()}render()}
 });
}
async function init(){
 try{
  const response=await fetch('./catalog.v2.json?ts='+Date.now(),{cache:'no-store'});if(!response.ok)throw new Error('HTTP '+response.status);
  const result=await response.json();if(!E.validate(result))throw new Error('Tarif verileri geçersiz');
  catalog=result;write(PRE+'catalogCache',result);showStatus('Güncel');
 }catch(e){
  catalog=read(PRE+'catalogCache',null);
  if(!catalog||!E.validate(catalog)){$('loadError').textContent='Tarif dosyaları yüklenemedi. İnternet bağlantını kontrol edip yeniden dene.';return}
  showStatus('Çevrimdışı kayıt');
 }
 idx=E.indexCatalog(catalog);migrate();loadWeek();const now=E.dateOnly();dayIndex=Math.round((Date.parse(now+'T12:00:00Z')-Date.parse(E.startOfWeek(now)+'T12:00:00Z'))/86400000);bind();render();renderRecipes();$('mainContent').classList.remove('hidden');$('loadError').classList.add('hidden');
}
init();
})();
