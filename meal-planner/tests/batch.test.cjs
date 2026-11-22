'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const fs=require('node:fs');
const p=require('node:path');
require('../engine.v2.js');
const E=globalThis.MealEngine;
const catalog=JSON.parse(fs.readFileSync(p.join(__dirname,'..','catalog.v2.json'),'utf8'));
const index=E.indexCatalog(catalog);
test('fourteen weekly burritos are counted as batch portions',()=>{
 const count=E.plannedPortions(E.defaultDays(),'burrito');
 assert.equal(count,14);
 const g=E.batchIngredients(index.recipes.burrito,count,index);
 assert.equal(g.find(x=>x.id==='chicken').quantity,2800);
 assert.equal(g.find(x=>x.id==='rice').quantity,350);
 assert.equal(g.find(x=>x.id==='tortilla').quantity,14);
});
test('fractional servings are added across different days',()=>{
 const days=E.defaultDays();
 days[0][1].portions=0.5;
 days[2][2].portions=1.5;
 assert.equal(E.plannedPortions(days,'burrito'),14);
});
test('unselected recipe yields zero weekly portions',()=>{
 assert.equal(E.plannedPortions(E.defaultDays(),'eggsandwich'),0);
});
test('custom batch count does not change the meal plan',()=>{
 const days=E.defaultDays();
 const before=JSON.stringify(days);
 const list=E.batchIngredients(index.recipes.burrito,6,index);
 assert.equal(list.find(x=>x.id==='rice').quantity,150);
 assert.equal(list.find(x=>x.id==='chicken').quantity,1200);
 assert.equal(JSON.stringify(days),before);
});
test('zero invalid or missing batch counts return empty list',()=>{
 assert.deepEqual(E.batchIngredients(index.recipes.burrito,0,index),[]);
 assert.deepEqual(E.batchIngredients(index.recipes.burrito,NaN,index),[]);
 assert.deepEqual(E.batchIngredients(null,6,index),[]);
});
test('other recipes have independent batch quantities',()=>{
 const days=E.defaultDays();
 const oats=E.batchIngredients(index.recipes.oats,E.plannedPortions(days,'oats'),index);
 assert.equal(oats.find(x=>x.id==='oats').quantity,420);
 assert.equal(oats.find(x=>x.id==='milk').quantity,1750);
});
