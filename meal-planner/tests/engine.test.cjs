'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs');
const path=require('node:path');
require('../engine.v2.js');
const E=globalThis.MealEngine;
const catalog=JSON.parse(fs.readFileSync(path.join(__dirname,'..','catalog.v2.json'),'utf8'));
const index=E.indexCatalog(catalog);
test('catalog integrity',()=>assert.equal(E.validate(catalog),true));
test('Monday to Sunday full week',()=>{
 assert.equal(E.startOfWeek('2026-11-21'),'2026-11-16');
 assert.equal(E.addDays('2026-11-16',6),'2026-11-22');
 const days=E.defaultDays();assert.equal(days.length,7);assert.ok(days.every(x=>x.length===4));
});
test('nutrition is positive and consistent',()=>{
 const n=E.nutrition(index.recipes.burrito,index.ingredients);
 assert.ok(n.kcal>650&&n.kcal<750);
 assert.ok(n.protein>55&&n.protein<70);
});
test('14 burritos equal 2.8 kg raw chicken and three packs',()=>{
 const groceries=E.groceries(E.defaultDays(),index);
 const chicken=groceries.find(g=>g.id==='chicken');
 const tortilla=groceries.find(g=>g.id==='tortilla');
 assert.equal(chicken.quantity,2800);assert.equal(chicken.packs,3);
 assert.equal(tortilla.quantity,14);assert.equal(tortilla.packs,3);
});
test('changing recipe and portions changes groceries and daily macros',()=>{
 const days=E.defaultDays();const before=E.dayNutrition(days[0],index);
 days[0][1].portions=2;
 const after=E.dayNutrition(days[0],index);
 const burrito=E.nutrition(index.recipes.burrito,index.ingredients);
 assert.ok(Math.abs(after.kcal-before.kcal-burrito.kcal)<1e-7);
 const chicken=E.groceries(days,index).find(x=>x.id==='chicken');
 assert.equal(chicken.quantity,3000);
});
test('zero scheduled meals means no grocery items',()=>{
 assert.deepEqual(E.groceries(Array.from({length:7},()=>[]),index),[]);
});
test('previous template is deep cloned, purchased resets',()=>{
 const template=E.defaultDays();const one=E.initialWeek(template),two=E.initialWeek(template);
 one.days[0][0].recipeId='snack';one.purchased.chicken=true;
 assert.equal(two.days[0][0].recipeId,'oats');
 assert.deepEqual(two.purchased,{});
});
test('loose produce is rounded to grocery increments',()=>{
 const x=E.groceries(E.defaultDays(),index).find(g=>g.id==='pepper');
 assert.equal(x.quantity,700);assert.equal(x.purchaseQuantity,700);
 assert.match(E.packageLabel(x),/açık reyon/);
});
