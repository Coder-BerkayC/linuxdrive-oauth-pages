'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs');
const p=require('node:path');
require('../i18n.v3.js');
require('../engine.v2.js');
const L=globalThis.MealI18n, E=globalThis.MealEngine;
const catalog=JSON.parse(fs.readFileSync(p.join(__dirname,'..','catalog.v2.json'),'utf8'));
test('every recipe and ingredient has a complete English translation',()=>{
 for(const i of catalog.ingredients)assert.equal(typeof L.english.names[i.id],'string',i.id);
 for(const r of catalog.recipes){
   const t=L.english.recipes[r.id];
   assert.ok(t?.name&&t?.servingLabel&&t?.category,r.id);
   assert.equal(t.steps.length,r.steps.length,r.id);
 }
 for(const group of catalog.groups)assert.ok(L.english.groups[group.id]);
});
test('switching language does not affect recipe identifiers or quantities',()=>{
 const selected=catalog.recipes[0],before=JSON.stringify(selected);
 L.set('en');assert.equal(L.recipeName(selected),'Chicken and rice burrito');
 L.set('tr');assert.equal(L.recipeName(selected),'Tavuklu pilavlı burrito');
 assert.equal(JSON.stringify(selected),before);
});
test('English UI labels and week days',()=>{
 L.set('en');
 assert.equal(L.t('Tarifler'),'Recipes');
 assert.equal(L.t('Alınacak'),'To buy');
 assert.equal(L.t('Mutfak ölçüsü: '),'Kitchen measures: ');
 assert.equal(L.weekDay(0),'Mon');
 assert.equal(L.weekDay(6),'Sun');
});
test('Turkish remains the fallback language',()=>{
 L.set('tr');assert.equal(L.t('Tarifler'),'Tarifler');
 assert.equal(L.weekDay(0),'Pzt');
});
test('copying recipes and categories uses English without changing nutrition',()=>{
 L.set('en');
 assert.equal(L.ingredient(catalog.ingredients.find(x=>x.id==='rice')),'Rice (dry)');
 assert.equal(L.category('Ana öğün'),'Main meal');
 const idx=E.indexCatalog(catalog);
 const n=E.nutrition(idx.recipes.burrito,idx.ingredients);
 assert.ok(n.kcal>600&&n.protein>50);
 L.set('tr');assert.equal(L.ingredient(catalog.ingredients.find(x=>x.id==='rice')),'Pilavlık pirinç (çiğ)');
});
test('batch prep safety translations include all six recipes',()=>{
 const ids=catalog.recipes.map(x=>x.id);
 for(const id of ids)assert.ok(L.english.batchSafety[id]||id==='snack',id);
});
test('localized shopping packages preserve quantities',()=>{
 L.set('en');
 const groceries=E.groceries(E.defaultDays(),E.indexCatalog(catalog));
 const chicken=groceries.find(x=>x.id==='chicken');
 assert.equal(chicken.quantity,2800);
 assert.equal(L.packageLabel(chicken),'3 × 1 kg pack');
 L.set('tr');assert.equal(L.packageLabel(chicken),null);
});
