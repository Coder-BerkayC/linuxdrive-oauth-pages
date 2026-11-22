'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
require('../engine.v2.js');
require('../kitchen.v2.js');
const K=globalThis.KitchenMeasures;
test('60 g oats maps to twelve level tablespoons',()=>{
 assert.match(K.format('oats',60,'g').label,/12 silme yemek kaşığı/);
});
test('250 ml milk maps to one and a quarter Turkish water glasses',()=>{
 assert.match(K.format('milk',250,'ml').label,/1 ¼ su bardağı/);
});
test('25 g uncooked rice maps to two level tablespoons',()=>{
 assert.match(K.format('rice',25,'g').label,/2 silme yemek kaşığı/);
});
test('spices display teaspoon estimates',()=>{
 assert.match(K.format('cumin',1,'g').label,/½ silme çay kaşığı/);
});
test('30 g thick yogurt maps to approximate tablespoons',()=>{
 assert.match(K.format('yogurt',30,'g').label,/1 ½ yemek kaşığı/);
});
test('protein powder uses its own scoop, not generic tablespoon density',()=>{
 assert.match(K.format('casein',15,'g').label,/½ ürün ölçeği/);
});
test('ten grams almonds uses pieces',()=>{
 assert.match(K.format('almond',10,'g').label,/8 badem/);
});
test('raw chicken stays in grams and has no misleading volume conversion',()=>{
 assert.equal(K.format('chicken',200,'g'),null);
});
test('not applicable to count based ingredients',()=>{
 assert.equal(K.format('egg',2,'adet'),null);
});
test('negative and nonfinite inputs do not emit kitchen amounts',()=>{
 assert.equal(K.format('oats',-2,'g'),null);
 assert.equal(K.format('oats',NaN,'g'),null);
});
