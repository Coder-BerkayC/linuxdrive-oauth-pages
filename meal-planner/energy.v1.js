/* Approximate adult energy balance calculations. No network, health records or AI. */
(function(root){
'use strict';
const ACTIVITY={
  rest:{met:1,labelTR:'Dinlenme',labelEN:'Rest'},
  weights:{met:3.5,labelTR:'Ağırlık antrenmanı (orta)',labelEN:'Strength training (moderate)'},
  heavyweights:{met:6,labelTR:'Ağırlık antrenmanı (yoğun)',labelEN:'Strength training (vigorous)'},
  walk:{met:3.5,labelTR:'Yürüyüş',labelEN:'Walking'},
  fastwalk:{met:4.3,labelTR:'Tempolu yürüyüş',labelEN:'Brisk walking'},
  run:{met:8.3,labelTR:'Koşu',labelEN:'Running'},
  bike:{met:6.8,labelTR:'Bisiklet',labelEN:'Cycling'},
  swim:{met:5.8,labelTR:'Yüzme',labelEN:'Swimming'},
  yoga:{met:2.5,labelTR:'Yoga',labelEN:'Yoga'}
};
const BASE=[
 {id:'sedentary',factor:1.2,tr:'Genelde oturarak',en:'Mostly seated'},
 {id:'light',factor:1.35,tr:'Günlük hafif hareketli',en:'Light daily movement'},
 {id:'moderate',factor:1.5,tr:'Gün boyu hareketli',en:'Active throughout the day'},
 {id:'high',factor:1.7,tr:'Fiziksel olarak yoğun gün',en:'Physically demanding day'}
];
const finite=n=>Number.isFinite(Number(n))&&n!==''&&n!==null&&n!==undefined;
const profileValid=p=>Boolean(p&&finite(p.age)&&p.age>=18&&p.age<=100&&finite(p.height)&&p.height>=100&&p.height<=250&&finite(p.weight)&&p.weight>=30&&p.weight<=350&&['male','female'].includes(p.coefficient)&&BASE.some(x=>x.id===p.activity));
const restEnergy=p=>{
 if(!profileValid(p))return null;
 return 10*Number(p.weight)+6.25*Number(p.height)-5*Number(p.age)+(p.coefficient==='male'?5:-161);
};
const sessionNet=(session,weight)=>{
 if(!session||!ACTIVITY[session.type]||!finite(session.minutes)||!finite(weight))return 0;
 const minutes=Number(session.minutes);
 if(minutes<=0||minutes>300||weight<=0)return 0;
 // Compendium MET estimate; subtract 1 MET resting portion to avoid counting it twice.
 // 1 MET approximates one kcal/kg/hour; considerable individual uncertainty.
 return Math.max(0,ACTIVITY[session.type].met-1)*Number(weight)*minutes/60;
};
const dayNetExercise=(sessions,weight,dayIndex)=>{
 let total=0;
 for(const s of Array.isArray(sessions)?sessions:[]){
  if(Array.isArray(s.days)&&s.days.includes(dayIndex))total+=sessionNet(s,weight);
 }
 return total;
};
const dailyEnergy=(profile,sessions)=>{
 const rest=restEnergy(profile);
 if(rest===null)return null;
 const factor=BASE.find(x=>x.id===profile.activity).factor;
 return Array.from({length:7},(_,day)=>{
  const exercise=dayNetExercise(sessions,profile.weight,day);
  return {rest,base:rest*factor,exercise,maintenance:rest*factor+exercise};
 });
};
const dayBalance=(maintenance,planned,logged=null)=>{
 const hasLogged=logged!==''&&logged!==null&&logged!==undefined&&Number.isFinite(Number(logged))&&Number(logged)>=0;
 const calculated=Number(maintenance);
 const hasPlanned=planned!==null&&planned!==undefined&&planned!==''&&Number.isFinite(Number(planned));
 return {
   plannedIntake:hasPlanned?Number(planned):null,
   loggedIntake:hasLogged?Number(logged):null,
   plannedBalance:hasPlanned?calculated-Number(planned):null,
   loggedBalance:hasLogged?calculated-Number(logged):null,
 };
};
const average=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;
root.EnergyMath={ACTIVITY,BASE,profileValid,restEnergy,sessionNet,dayNetExercise,dailyEnergy,dayBalance,average};
})(globalThis);
