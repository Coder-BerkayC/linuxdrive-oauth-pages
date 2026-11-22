/* Approximate Turkish household measures for the selected ingredient.
 * A level teaspoon = 5 ml, dessert spoon = 10 ml, tablespoon = 15 ml,
 * standard water glass = 200 ml. Do not use this for nutritional math.
 */
(function(root){
'use strict';
const quarter=n=>{
  const v=Math.round(n*4)/4;
  if(v<=0)return 'bir tutam';
  const whole=Math.floor(v+1e-8),r=Math.round((v-whole)*4);
  const fractional=['','¼','½','¾'][r]||'';
  return whole?(fractional?whole+' '+fractional:String(whole)):fractional;
};
const amount=(n,unit,detail='')=>quarter(n)+' '+detail+unit;
const volume=(ml,kind,options={})=>{
  const suffix=kind==='dry'?'silme ':'';
  if(ml>=165 && !options.preferSpoons)return amount(ml/200,'su bardağı');
  if(ml>=15)return amount(ml/15,'yemek kaşığı',suffix);
  if(ml>=8)return amount(ml/10,'tatlı kaşığı',suffix);
  if(ml>=1.2)return amount(ml/5,'çay kaşığı',suffix);
  return 'bir tutam';
};
// Level spoon weights vary by ingredient, brand, cut, packing and humidity.
const perSpoon={
 oats:5, rice:12, cheese:7, yogurt:20,
 cumin:5, paprika:7, blackpepper:6,
 chili:5, cinnamon:7, salt:18,
};
function format(id,quantity,unit){
 const n=Number(quantity);if(!Number.isFinite(n)||n<=0)return null;
 if(unit==='ml'){
   if(id==='milk'||id==='oliveoil')return {label:'yaklaşık '+volume(n,'liquid'),note:'Standart su bardağı 200 ml'};
   return null;
 }
 if(unit!=='g')return null;
 if(id==='chicken')return null; // Protein portions need weighing; cup estimates are unreliable.
 if(id==='casein'){
   return {label:'yaklaşık '+quarter(n/30)+' ürün ölçeği',note:'30 g ölçek varsayımı; ürün etiketini kontrol et'};
 }
 if(id==='almond'){
   return {label:'yaklaşık '+Math.round(n/1.2)+' badem',note:'Badem büyüklüğüne göre değişir'};
 }
 if(id==='garlic')return {label:'yaklaşık '+quarter(n/3)+' diş sarımsak',note:'Diş büyüklüğü değişir'};
 if(id==='onion')return {label:'yaklaşık '+quarter(n/100)+' orta boy soğan',note:'Doğranmadan önceki yaklaşık miktar'};
 if(id==='pepper')return {label:'yaklaşık '+quarter(n/120)+' orta boy biber',note:'Biberin türüne ve büyüklüğüne göre değişir'};
 if(id==='tomato')return {label:'yaklaşık '+quarter(n/120)+' orta boy domates',note:'Boyuta göre değişir'};
 if(id==='cucumber')return {label:'yaklaşık '+quarter(n/160)+' orta boy salatalık',note:'Boyuta göre değişir'};
 if(id==='bread')return {label:'yaklaşık '+quarter(n/30)+' dilim ekmek',note:'Dilimin gramajını kontrol et'};
 if(id==='greens')return {label:'yaklaşık '+quarter(n/15)+' avuç yeşillik',note:'Gevşek yerleştirilmiş, doğranmamış yaprak'};
 if(Object.hasOwn(perSpoon,id)){
   const spoonWeight=perSpoon[id];
   const ml=n*15/spoonWeight;
   const text=volume(ml,'dry',{preferSpoons:id==='oats'&&n<=80});
   return {label:'yaklaşık '+text,note:id==='cheese'?'Rendelenmiş peynir için':id==='rice'?'Çiğ pirinç için':id==='yogurt'?'Kıvamına göre değişir':'Silme kaşık varsayımı'};
 }
 return null;
}
root.KitchenMeasures={format,quarter,volume,perSpoon};
})(globalThis);
