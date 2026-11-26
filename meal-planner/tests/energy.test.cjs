'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
require('../energy.v1.js');
const E=globalThis.EnergyMath;
const male={age:30,height:180,weight:80,coefficient:'male',activity:'sedentary'};
const female={...male,coefficient:'female'};
test('Mifflin St Jeor resting energy is correct',()=>{
 assert.equal(E.restEnergy(male),1780);
 assert.equal(E.restEnergy(female),1614);
});
test('empty or invalid adult data cannot generate an estimate',()=>{
 assert.equal(E.restEnergy({...male,age:17}),null);
 assert.equal(E.restEnergy({...male,weight:0}),null);
 assert.equal(E.restEnergy({...male,coefficient:''}),null);
});
test('daily maintenance includes only nonexercise baseline plus net workout',()=>{
 const daily=E.dailyEnergy(male,[{type:'weights',minutes:60,days:[0,2,4]}]);
 assert.equal(daily.length,7);
 assert.equal(daily[0].rest,1780);
 assert.equal(daily[1].maintenance,2136);
 assert.equal(daily[0].exercise,200);
 assert.equal(daily[2].maintenance,2336);
});
test('sessions on the same weekday are additive',()=>{
 const sess=[{type:'weights',minutes:60,days:[0]},{type:'walk',minutes:30,days:[0]}];
 assert.equal(E.dayNetExercise(sess,80,0),300);
 assert.equal(E.dayNetExercise(sess,80,1),0);
});
test('negative or absurd session durations are ignored',()=>{
 assert.equal(E.sessionNet({type:'run',minutes:-15},80),0);
 assert.equal(E.sessionNet({type:'run',minutes:999},80),0);
 assert.equal(E.sessionNet({type:'nonsense',minutes:60},80),0);
});
test('planned and logged balances must be distinguished',()=>{
 assert.deepEqual(E.dayBalance(2500,2100,null),{plannedIntake:2100,loggedIntake:null,plannedBalance:400,loggedBalance:null});
 assert.deepEqual(E.dayBalance(2500,2100,2300),{plannedIntake:2100,loggedIntake:2300,plannedBalance:400,loggedBalance:200});
});
test('missing planned food data is never treated as a zero intake',()=>{
 const v=E.dayBalance(2500,null,null);
 assert.equal(v.plannedBalance,null);
 assert.equal(v.loggedBalance,null);
});
test('surplus appears as negative rather than positive deficit',()=>{
 const v=E.dayBalance(2000,2600,2700);
 assert.equal(v.plannedBalance,-600);
 assert.equal(v.loggedBalance,-700);
});
test('activity outside training uses configurable rough baseline',()=>{
 assert.equal(E.dailyEnergy({...male,activity:'light'},[])[0].maintenance,1780*1.35);
});
