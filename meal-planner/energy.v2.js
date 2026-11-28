/* Approximate adult energy balance calculations. No network, health records or AI. */
(function(root){
'use strict';
const ACTIVITY={
  rest:{met:1,labelTR:'Dinlenme',labelEN:'Rest'},
  treadmill:{met:null,labelTR:'Koşu bandı (hız/eğim)',labelEN:'Treadmill (speed/grade)'},
  supersets:{met:5.8,labelTR:'Süperset / devre ağırlık',labelEN:'Reciprocal supersets / circuit resistance'},
  elliptical:{met:5,labelTR:'Eliptik (orta)',labelEN:'Elliptical (moderate)'},
  ellipticalHigh:{met:9,labelTR:'Eliptik (yoğun)',labelEN:'Elliptical (vigorous)'},
  ellipticalUnknown:{met:null,labelTR:'Eliptik (yoğunluk seçilecek)',labelEN:'Elliptical (choose effort)'},
  coreLight:{met:2.8,labelTR:'Karın (hafif)',labelEN:'Core (light)'},
  coreModerate:{met:3.8,labelTR:'Karın (orta)',labelEN:'Core / calisthenics (moderate)'},
  coreUnknown:{met:null,labelTR:'Karın (yoğunluk seçilecek)',labelEN:'Core (choose effort)'},
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
// ACSM oxygen cost in mL/kg/min; speed m/min, grade as fraction.
const treadmillVO2=(speedKmh,gradePercent,gait)=>{
 if(!finite(speedKmh)||!finite(gradePercent)||!['walk','run'].includes(gait))return null;
 const v=Number(speedKmh)*1000/60,g=Number(gradePercent)/100;
 if(v<=0||v>400||g<0||g>0.30)return null;
 return 3.5+v*(gait==='walk'?0.1+1.8*g:0.2+0.9*g);
};
const sessionEstimate=(s,weight,baselinePerMinute)=>{
 if(!s||!ACTIVITY[s.type]||!finite(s.minutes)||!finite(weight)||!finite(baselinePerMinute))return null;
 const minutes=Number(s.minutes),mass=Number(weight),base=Number(baselinePerMinute);
 if(minutes<=0||minutes>300||mass<=0||base<0)return null;
 const oxygen=s.type==='treadmill'?treadmillVO2(s.speed,s.grade,s.gait):(ACTIVITY[s.type].met===null?null:ACTIVITY[s.type].met*3.5);
 if(oxygen===null||!Number.isFinite(oxygen))return null;
 const gross=oxygen*mass/1000*5*minutes;
 const speed=Number(s.speed),outOfRange=s.type==='treadmill'&&(s.gait==='walk'?(speed<3||speed>6):speed<8.04);
 return {gross,net:gross-base*minutes,minutes,oxygen,outOfRange};
};
const sessionNet=(s,w,base=Number(w)*3.5/1000*5)=>sessionEstimate(s,w,base)?.net??0;
const dayNetExercise=(sessions,w,day,base)=>(Array.isArray(sessions)?sessions:[]).filter(s=>Array.isArray(s.days)&&s.days.includes(day)).reduce((sum,s)=>sum+sessionNet(s,w,base),0);
const dailyEnergy=(p,sessions)=>{
 const rest=restEnergy(p);if(rest===null)return null;
 const base=rest*BASE.find(x=>x.id===p.activity).factor;
 return Array.from({length:7},(_,day)=>{
  const estimates=(Array.isArray(sessions)?sessions:[]).filter(s=>Array.isArray(s.days)&&s.days.includes(day)).map(s=>sessionEstimate(s,p.weight,base/1440));
  const exercise=estimates.reduce((sum,x)=>sum+(x?.net||0),0),minutes=estimates.reduce((sum,x)=>sum+(x?.minutes||0),0);
  const incomplete=estimates.some(x=>x===null)||minutes>1440;
  return {rest,base,exercise,maintenance:incomplete?null:base+exercise,incomplete,minutes,outOfRange:estimates.some(x=>x?.outOfRange)};
 });
};
const dayBalance=(maintenance,planned,logged=null)=>{
 const hasLogged=logged!==''&&logged!==null&&logged!==undefined&&Number.isFinite(Number(logged))&&Number(logged)>=0;
 const calculated=maintenance===null||maintenance===undefined?null:Number(maintenance);
 const hasPlanned=planned!==null&&planned!==undefined&&planned!==''&&Number.isFinite(Number(planned));
 return {
   plannedIntake:hasPlanned?Number(planned):null,
   loggedIntake:hasLogged?Number(logged):null,
   plannedBalance:hasPlanned&&calculated!==null?calculated-Number(planned):null,
   loggedBalance:hasLogged&&calculated!==null?calculated-Number(logged):null,
 };
};
const average=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:0;
root.EnergyMath={ACTIVITY,BASE,profileValid,restEnergy,treadmillVO2,sessionEstimate,sessionNet,dayNetExercise,dailyEnergy,dayBalance,average};
})(globalThis);
