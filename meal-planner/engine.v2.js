/* Pure calculations for the seven day planner. No API calls or credentials. */
(function(root) {
  'use strict';
  const ZONE = 'Europe/Istanbul';
  const clone = value => JSON.parse(JSON.stringify(value));
  const dateOnly = input => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(input || new Date());
    const part = t => parts.find(x => x.type === t).value;
    return part('year') + '-' + part('month') + '-' + part('day');
  };
  const fromISO = iso => new Date(iso + 'T12:00:00Z');
  const addDays = (iso, n) => {
    const x = fromISO(iso); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0,10);
  };
  const startOfWeek = (day = dateOnly()) => {
    const dayNum = fromISO(day).getUTCDay();
    return addDays(day, -((dayNum + 6) % 7));
  };
  const blankMeal = (rid = 'burrito', id = 1) => ({ id: 'meal' + id, recipeId: rid, portions: 1 });
  const defaultDays = () => Array.from({ length:7 }, () => [
    blankMeal('oats',1), blankMeal('burrito',2), blankMeal('burrito',3), blankMeal('snack',4)
  ]);
  const initialWeek = (template = null) => ({
    version:2, days: Array.isArray(template) && template.length === 7 ? clone(template) : defaultDays(),
    purchased:{}
  });
  const indexCatalog = catalog => ({
    recipes:Object.fromEntries(catalog.recipes.map(r => [r.id,r])),
    ingredients:Object.fromEntries(catalog.ingredients.map(i => [i.id,i]))
  });
  const emptyMacros = () => ({kcal:0,protein:0,carbs:0,fat:0});
  const addMacros = (total, part, factor=1) => {
    for(const key of ['kcal','protein','carbs','fat']) total[key] += (part[key] || 0) * factor;
    return total;
  };
  const nutrition = (recipe, ingredients) => {
    const result = emptyMacros();
    if(!recipe) return result;
    for(const [id,quantity] of recipe.ingredients){
      const ingredient=ingredients[id]; if(!ingredient) continue;
      const multiplier = ingredient.unit === 'adet' ? quantity : quantity/100;
      for(const [k,idx] of [['kcal',0],['protein',1],['carbs',2],['fat',3]]) {
        result[k] += ingredient.macros[idx] * multiplier;
      }
    }
    return result;
  };
  const dayNutrition = (meals, index) => {
    const total=emptyMacros();
    for(const meal of meals) {
      const portions = Math.max(0, Number(meal.portions)||0);
      const recipe = index.recipes[meal.recipeId];
      if(recipe && portions) addMacros(total,nutrition(recipe,index.ingredients),portions);
    }
    return total;
  };
  const weekNutrition = (days,index) => days.map(d=>dayNutrition(d,index));
  const groceries = (days,index) => {
    const amounts = new Map();
    for(const meals of days) for(const meal of meals) {
      const recipe=index.recipes[meal.recipeId];if(!recipe)continue;
      const portions=Math.max(0,Number(meal.portions)||0);
      for(const [id,quantity] of recipe.ingredients) amounts.set(id,(amounts.get(id)||0)+quantity*portions);
    }
    return [...amounts.entries()].map(([id,quantity])=>{
      const ingredient=index.ingredients[id];if(!ingredient)return null;
      const packs=Math.ceil((quantity - 1e-9)/ingredient.packageSize);
      return {id,quantity, packs, purchaseQuantity:packs*ingredient.packageSize, ingredient};
    }).filter(Boolean).sort((a,b)=>a.ingredient.name.localeCompare(b.ingredient.name,'tr'));
  };
  // Count fractional servings of one recipe across the entire selected week.
  const plannedPortions = (days, recipeId) => {
    if (!Array.isArray(days)) return 0;
    let total = 0;
    for (const meals of days) {
      if (!Array.isArray(meals)) continue;
      for (const meal of meals) {
        if (meal.recipeId !== recipeId) continue;
        const count = Number(meal.portions);
        if (Number.isFinite(count) && count > 0) total += count;
      }
    }
    return total;
  };
  // Calculate exact batch ingredient requirements without rounding up to store packages.
  // Recipe ingredient amounts are stated for a single serving.
  const batchIngredients = (recipe, portions, index) => {
    const count = Number(portions);
    if (!recipe || !Array.isArray(recipe.ingredients) ||
        !Number.isFinite(count) || count <= 0) return [];
    return recipe.ingredients.map(([id, quantity]) => ({
      id,
      quantity: quantity * count,
      ingredient: index.ingredients[id],
    })).filter(x => x.ingredient && Number.isFinite(x.quantity) && x.quantity > 0);
  };
  const round = (value, decimals=1) => Math.round((value + Number.EPSILON) * 10**decimals) / 10**decimals;
  const amountLabel = (n,unit) => {
    if(unit==='g' && n>=1000)return round(n/1000,2).toLocaleString('tr-TR')+' kg';
    if(unit==='ml' && n>=1000)return round(n/1000,2).toLocaleString('tr-TR')+' L';
    return round(n,1).toLocaleString('tr-TR')+' '+unit;
  };
  const packageLabel = g => {
    if(g.ingredient.loose) return amountLabel(g.purchaseQuantity,g.ingredient.unit)+' açık reyon';
    return g.packs+' × '+g.ingredient.packageLabel;
  };
  const validate = catalog => {
    if(!catalog||catalog.version!==2||!Array.isArray(catalog.recipes)||!Array.isArray(catalog.ingredients))return false;
    const known=new Set(catalog.ingredients.map(x=>x.id));
    const recipeNames=new Set();
    for(const r of catalog.recipes) {
      if(!r.id||recipeNames.has(r.id)||!Array.isArray(r.ingredients))return false;
      recipeNames.add(r.id);
      for(const [id,qty] of r.ingredients)if(!known.has(id)||!Number.isFinite(qty)||qty<0)return false;
    }
    return catalog.ingredients.every(i=>i.packageSize>0&&Array.isArray(i.macros)&&i.macros.length===4&&i.macros.every(x=>Number.isFinite(x)&&x>=0));
  };
  root.MealEngine={dateOnly,addDays,startOfWeek,defaultDays,initialWeek,indexCatalog,nutrition,dayNutrition,weekNutrition,groceries,plannedPortions,batchIngredients,round,amountLabel,packageLabel,validate,clone};
})(globalThis);
