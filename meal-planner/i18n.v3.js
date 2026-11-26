/* Localized strings for the public seven day meal planner. No API calls. */
(function(root){
'use strict';
const en={
  "names": {
    "chicken": "Chicken breast (raw)",
    "tortilla": "Large tortilla (about 70 g)",
    "rice": "Rice (dry)",
    "cheese": "Kashar or melting cheese",
    "onion": "Onion",
    "pepper": "Red or green pepper",
    "greens": "Lettuce or arugula",
    "yogurt": "Strained yogurt",
    "garlic": "Garlic",
    "lemon": "Lemon",
    "oats": "Rolled oats",
    "milk": "UHT milk",
    "banana": "Banana",
    "casein": "Micellar casein powder",
    "cinnamon": "Cinnamon",
    "apple": "Apple",
    "almond": "Almonds",
    "oliveoil": "Olive oil",
    "cumin": "Cumin",
    "paprika": "Sweet paprika",
    "blackpepper": "Black pepper",
    "chili": "Chili flakes",
    "salt": "Salt",
    "egg": "Eggs",
    "bread": "Whole grain bread",
    "tomato": "Tomato",
    "cucumber": "Cucumber"
  },
  "recipes": {
    "burrito": {
      "name": "Chicken and rice burrito",
      "servingLabel": "1 large burrito",
      "category": "Main meal",
      "steps": [
        "Dice the chicken and mix it with the spices and a little oil.",
        "Cook the rice and cool it quickly in shallow containers.",
        "Sauté the onions and peppers. Cook the chicken in batches to an internal temperature of 74°C (165°F).",
        "Combine the chicken and vegetables, then divide the cooked rice and cheese among the tortillas.",
        "Pack the yogurt sauce and fresh greens separately. Freeze any rice filled portions you will not eat within a day, on the same day they were prepared."
      ]
    },
    "oats": {
      "name": "Chocolate banana overnight oats",
      "servingLabel": "1 jar",
      "category": "Breakfast",
      "steps": [
        "Put 60 g oats, 250 ml milk, and 15 g casein in a jar.",
        "Add cinnamon and stir well.",
        "Refrigerate for at least 4 hours. Add the banana in the morning.",
        "Keep milk based oats safely chilled at school."
      ]
    },
    "snack": {
      "name": "Apple and almonds",
      "servingLabel": "1 snack",
      "category": "Snack",
      "steps": [
        "Wash the apple.",
        "Portion 30 g almonds into a separate container.",
        "Pack them in your bag."
      ]
    },
    "eggsandwich": {
      "name": "Egg and cheese sandwich",
      "servingLabel": "1 sandwich",
      "category": "Breakfast",
      "steps": [
        "Cook both eggs thoroughly.",
        "Add the eggs, cheese, and vegetables to the whole grain bread.",
        "Keep perishable ingredients chilled. Do not leave the sandwich at room temperature for hours."
      ]
    },
    "chickenbowl": {
      "name": "Chicken and rice bowl",
      "servingLabel": "1 bowl",
      "category": "Main meal",
      "steps": [
        "Cook the rice and chicken, bringing the chicken to an internal temperature of 74°C (165°F).",
        "Sauté the peppers and onion in a little oil.",
        "Put the ingredients in a serving container, keeping the yogurt separate.",
        "Cool quickly and freeze any portions you will not eat the same day."
      ]
    },
    "yogurtbowl": {
      "name": "Yogurt, fruit and oat bowl",
      "servingLabel": "1 bowl",
      "category": "Breakfast",
      "steps": [
        "Mix the yogurt and oats.",
        "Slice the banana and sprinkle the almonds over the top.",
        "Keep chilled until eating."
      ]
    }
  },
  "categories": {
    "Ana öğün": "Main meal",
    "Kahvaltı": "Breakfast",
    "Ara öğün": "Snack"
  },
  "groups": {
    "protein": "Protein foods",
    "bakliyat": "Grains and bread",
    "sut": "Dairy",
    "sebze": "Vegetables",
    "meyve": "Fruit",
    "diger": "Oils and spices"
  },
  "package": {
    "chicken": "1 kg pack",
    "tortilla": "pack of 6",
    "rice": "1 kg pack",
    "cheese": "250 g pack",
    "onion": "100 g loose produce increment",
    "pepper": "100 g loose produce increment",
    "greens": "100 g pack",
    "yogurt": "500 g tub",
    "garlic": "1 bulb (about 50 g)",
    "lemon": "each",
    "oats": "500 g pack",
    "milk": "1 L carton",
    "banana": "each",
    "casein": "700 g tub (existing stock)",
    "cinnamon": "40 g pack",
    "apple": "each",
    "almond": "200 g pack",
    "oliveoil": "500 ml bottle",
    "cumin": "40 g pack",
    "paprika": "50 g pack",
    "blackpepper": "40 g pack",
    "chili": "50 g pack",
    "salt": "500 g pack",
    "egg": "carton of 10",
    "bread": "500 g pack",
    "tomato": "100 g loose produce increment",
    "cucumber": "100 g loose produce increment"
  },
  "weekdays": [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ],
  "static": {
    "HAFTALIK MARKETİM": "MY WEEKLY GROCERIES",
    "Yükleniyor": "Loading",
    "Yenile": "Refresh",
    "Yedi günlük kişisel yemek planı": "Your seven day meal plan",
    "Öğünlerini seç.": "Choose your meals.",
    "Alışverişin hazır olsun.": "Your groceries, sorted.",
    "Tarifleri değiştir, porsiyonları ayarla, günlük besin değerlerini takip et.": "Pick recipes, adjust portions, and track daily nutrition.",
    "Hafta yükleniyor": "Loading week",
    "Bu hafta": "This week",
    "Plan yükleniyor...": "Loading your plan...",
    "Günlük ort. kcal": "Avg. daily kcal",
    "Günlük ort. protein": "Avg. daily protein",
    "Farklı malzeme": "Different ingredients",
    "7 Gün": "7 Days",
    "Kalori Dengesi": "Energy Balance",
    "Alışveriş": "Shopping",
    "Tarifler": "Recipes",
    "Hedefler": "Goals",
    "Haftalık plan": "Weekly plan",
    "Pazartesi ile Pazar": "Monday through Sunday",
    "Bir güne dokun, öğün sayısını ve tarifini değiştir. Alışveriş listesi otomatik hesaplanır.": "Select a day to change meals and recipes. Your shopping list updates automatically.",
    "Gün": "Day",
    "4 öğün": "4 meals",
    "+ Öğün ekle": "+ Add meal",
    "Bu günü tüm haftaya uygula": "Apply this day to the entire week",
    "Toplu öğün sayısı": "Number of daily meals",
    "7 güne uygula": "Apply to 7 days",
    "Tek bir günde farklı sayıda öğün istiyorsan yukarıdaki ekle veya sil seçeneklerini kullan.": "Add or remove meals above if you want a different number on a particular day.",
    "Günlük besin değerleri": "Daily nutrition",
    "Tahmini": "Estimated",
    "Besin değerleri genel ürün verilerine göre tahmin edilir. Ambalajın besin etiketi ve gerçek tartım değerleri daha doğrudur. Hedefe tam ulaşmak zorunda değilsin.": "Nutrition values are estimates. Product labels and weighed portions are more accurate. You do not have to hit the target exactly.",
    "Yedi günün özeti": "Seven day summary",
    "Öğün": "Meals",
    "Kalori": "Calories",
    "Protein": "Protein",
    "Otomatik alışveriş listesi": "Automatic shopping list",
    "Mutfak ölçüsü: Kapalı": "Kitchen measures: Off",
    "Aşağıdaki miktarlar 7 güne seçtiğin bütün tariflerin toplamıdır. Paketler Türkiye'deki yaygın satış boyutlarına yuvarlanır.": "These quantities total the recipes selected for all seven days. Shopping amounts are rounded to common Turkish package sizes.",
    "Mutfak ölçüleri yaklaşıktır. Market alışverişinde paket ve gram miktarı esas alınır.": "Kitchen measures are approximate. Use package sizes and grams when shopping.",
    "Ürün ara": "Search products",
    "Tümü": "All",
    "Alınacak": "To buy",
    "Alınan": "Purchased",
    "Evde var": "In stock",
    "Fiyat hesabı": "Price estimates",
    "Paketli üründe bir paket fiyatı, açık reyonda 100 gram fiyatı gir. Toplam, gereken paket sayısıyla çarpılır. Bilinmeyen fiyatlar toplamın dışında kalır. “Evde var” seçeneği malzemenin tamamının evde bulunduğunu varsayar.": "Enter the price per pack for packaged goods or per 100 g for loose produce. The estimate multiplies the price by the quantity to purchase. Unknown prices are excluded. Marking an item as in stock assumes you have the full quantity.",
    "Alınacak listeyi kopyala": "Copy shopping list",
    "Bu haftanın tiklerini temizle": "Clear this week's checkmarks",
    "Okulda soğuk taşıma": "Safe chilled transport",
    "Tavuklu, pilavlı ve sütlü yemekleri oda sıcaklığında gün boyu bekletme. Okulda buzdolabı yoksa 4°C altında tutabildiğin doğrulanmış bir taşıma düzeni gerekiyor. Mikrodalga güvenli olmayan saklamayı telafi etmez.": "Do not leave chicken, rice, or dairy meals at room temperature all day. If there is no refrigerator at school, use a verified method to keep food below 4°C (40°F). Reheating cannot undo unsafe storage.",
    "Tarif kitaplığı": "Recipe library",
    "Tarif seçip porsiyonunu ayarlayabilirsin. Her tarifteki Toplu hazırla düğmesi, seçili haftanın toplam porsiyonuna göre tek seferlik malzeme miktarlarını hesaplar.": "Choose recipes and portions. Each recipe has a Batch prep button that calculates ingredients for all servings planned this week.",
    "1 çay kaşığı 5 ml, 1 tatlı kaşığı 10 ml, 1 yemek kaşığı 15 ml, 1 su bardağı 200 ml kabul edilir. Karşılıklar yaklaşık değerlerdir. Çiğ tavuk gibi hassas porsiyonları tartıyla ölç.": "We use 5 ml per teaspoon, 10 ml per dessert spoon, 15 ml per tablespoon, and 200 ml per water glass. Estimates vary. Weigh ingredients such as raw chicken.",
    "Kişisel hedeflerin": "Your goals",
    "Buraya girdiğin sayılar yalnızca bu Safari tarayıcısında saklanır. GitHub'a gönderilmez.": "Values entered here stay in this Safari browser and are not sent to GitHub.",
    "Günlük kalori hedefi (kcal)": "Daily calorie target (kcal)",
    "Protein hesabı için referans ağırlık (kg)": "Reference weight for protein (kg)",
    "Mevcut kilon yerine hedef veya uygun bir referans ağırlık kullanabilirsin. Bu bir klinik değerlendirme değil.": "You can use an appropriate target or reference weight instead of your current weight. This is not a medical assessment.",
    "Referans kg başına protein (g/kg)": "Protein per kg of reference weight (g/kg)",
    "İstersen doğrudan günlük protein hedefi (g)": "Or set a daily protein goal directly (g)",
    "Hedef için referans ağırlık gir.": "Enter a reference weight to calculate a goal.",
    "Bu hesaplar bilgilendirme amaçlıdır. Özellikle böbrek hastalığı veya başka bir sağlık durumu varsa kişisel protein hedefini bir sağlık uzmanıyla belirlemelisin.": "These calculations are informational. If you have kidney disease or another health condition, agree on a protein target with your clinician.",
    "FreeLLMAPI planı": "FreeLLMAPI integration",
    "Hesaplama motoru çevrimdışı da çalışır. Bir yapay zekâ modeli daha sonra tarif önerileri, lezzet çeşitliliği ve bütçe optimizasyonu için eklenebilir.": "Nutrition calculations also work offline. AI suggestions for recipes, variety, and budget planning may be added later.",
    "Bu public sitede FreeLLMAPI United API anahtarı tutulmuyor. Doğrudan canlı bağlantı açmak anahtarı başkalarına göstereceği için güvenli olmaz. Bu özellik şimdilik etkin değil.": "This public site does not store a FreeLLMAPI United API key. A direct integration would expose the key, so live AI features are not enabled yet.",
    "Haftalık AI özetini kopyala": "Copy weekly AI summary",
    "İstersen planını ChatGPT'ye veya kendi FreeLLMAPI istemcine yapıştırıp yorumlatabilirsin. Kopyalama dışında veri gönderilmez.": "You can paste your plan into ChatGPT or your own FreeLLMAPI client for feedback. No data is sent unless you choose to copy and share it.",
    "Hesaplar yaklaşık değerlerdir. Fiyatların ve kişisel hedeflerin yalnızca Safari'de tutulur.": "Calculations are estimates. Prices and personal goals are stored in Safari only.",
    "1 öğün": "1 meal",
    "2 öğün": "2 meals",
    "3 öğün": "3 meals",
    "5 öğün": "5 meals",
    "6 öğün": "6 meals",
    "7 öğün": "7 meals",
    "8 öğün": "8 meals",
    "Örneğin 2500": "For example 2500",
    "Örneğin 95": "For example 95",
    "Boşsa kg × katsayı": "If blank, kg × multiplier",
    "Uygulamanın güncel sürümünü yükle": "Load the latest app version",
    "Tüm günler için öğün sayısı": "Number of meals for all days",
    "Alışverişte ürün ara": "Search the shopping list",
    "Önceki hafta": "Previous week",
    "Sonraki hafta": "Next week",
    "1,4 g/kg": "1.4 g/kg",
    "1,5 g/kg": "1.5 g/kg",
    "1,6 g/kg": "1.6 g/kg",
    "1,7 g/kg": "1.7 g/kg",
    "1,8 g/kg": "1.8 g/kg",
    "1,9 g/kg": "1.9 g/kg",
    "2,0 g/kg": "2.0 g/kg"
  },
  "dynamic": {
    "Kapalı": "Off",
    "Açık": "On",
    "Mutfak ölçüsü: ": "Kitchen measures: ",
    "Güncel": "Up to date",
    "Çevrimdışı kayıt": "Offline copy",
    "Tarayıcı kaydı yapılamadı": "Could not save to browser",
    "ile": "to",
    " · Bu hafta": " · This week",
    "Öğün ": "Meal ",
    " öğün": " meals",
    "Tarif seç": "Choose recipe",
    "öğün tarifi": "meal recipe",
    "Porsiyon sayısı": "Number of servings",
    "Öğünü sil": "Remove meal",
    "Karbonhidrat": "Carbs",
    "Yağ": "Fat",
    "Kalori hedefini Hedefler sekmesinden girebilirsin.": "Set a calorie goal on the Goals tab.",
    "Protein hedefini Hedefler sekmesinden girebilirsin.": "Set a protein goal on the Goals tab.",
    "Toplam ": "Total ",
    " farklı malzeme. Alınacak ": " different ingredients. To buy: ",
    " ürün. Kayıtlı fiyat toplamı ": " items. Entered price estimate: ",
    "Henüz yok": "None yet",
    "Fiyatı bilinmeyen ": "Prices missing for ",
    " ürün dahil değil.": " items are excluded.",
    "Gereken: ": "Needed: ",
    "Alınacak: ": "Purchase: ",
    "Evde var ✓": "In stock ✓",
    "Evde var mı?": "Already have it?",
    "Fiyat gir": "Enter price",
    " birim fiyatını gir": " enter unit price",
    " farklı malzeme": " different ingredients",
    " ürün": " products",
    "Bu filtrede ürün bulunamadı.": "No products match this filter.",
    "Bu haftanın planı: ": "This week's plan: ",
    " porsiyon": " servings",
    " (henüz seçilmemiş)": " (not scheduled)",
    "Hazırlanacak porsiyon": "Servings to prepare",
    " toplu porsiyon sayısı": " batch servings",
    "Hafta miktarını kullan": "Use weekly amount",
    "Toplu hazırlık akışı": "Batch preparation steps",
    "Bu sayı yalnızca hazırlık hesabını değiştirir. Haftalık öğün planın ve alışveriş listen aynı kalır.": "Changing this only affects batch preparation. Your weekly meals and shopping list are unchanged.",
    " porsiyon · yaklaşık ": " servings · approx. ",
    " kcal toplam · ": " kcal total · ",
    " g protein toplam": " g total protein",
    "Toplu hazırlığı kapat": "Close batch prep",
    "Toplu hazırla (": "Batch prep (",
    "Bir porsiyonluk tarif": "Single serving recipe",
    "Bir porsiyon için": "For one serving",
    "Hazırlık": "Method",
    "Günlük protein hedefin: ": "Your daily protein target: ",
    "Protein hedefi için referans ağırlık gir.": "Enter a reference weight to calculate a protein goal.",
    "Bu haftanın günlük protein ortalaması: ": "Average daily protein this week: ",
    "Belirlenmedi": "Not set",
    "Bilinmeyen": "Unknown",
    "Alışveriş listesi · ": "Shopping list · ",
    "Kopyalandı": "Copied",
    "Alınacak listeyi kopyala": "Copy shopping list",
    "Seçili günün öğünleri diğer 6 güne kopyalansın mı?": "Copy this day's meals to the other six days?",
    "Bütün günlerdeki öğün sayısı ": "Set the number of meals on all days to ",
    " olsun mu? Fazla öğünler silinecek.": "? Extra meals will be removed.",
    "Sadece bu haftanın satın alındı işaretleri temizlensin mi?": "Clear purchased checkmarks for this week only?",
    "Tarif verileri geçersiz": "Recipe data is invalid",
    "Tarif dosyaları yüklenemedi. İnternet bağlantını kontrol edip yeniden dene.": "Could not load recipes. Check your connection and try again.",
    "yaklaşık ": "about ",
    "silme ": "level ",
    "çay kaşığı": "teaspoon",
    "tatlı kaşığı": "dessert spoon",
    "yemek kaşığı": "tablespoon",
    "su bardağı": "water glass",
    "ürün ölçeği": "scoop",
    "badem": "almonds",
    "diş sarımsak": "garlic cloves",
    "orta boy soğan": "medium onions",
    "orta boy biber": "medium peppers",
    "orta boy domates": "medium tomatoes",
    "orta boy salatalık": "medium cucumbers",
    "dilim ekmek": "slices of bread",
    "avuç yeşillik": "handfuls of greens",
    "bir tutam": "a pinch",
    "Standart su bardağı 200 ml": "Standard water glass = 200 ml",
    "Silme kaşık varsayımı": "Assumes level spoons",
    "Çiğ pirinç için": "Uncooked rice",
    "Rendelenmiş peynir için": "Grated cheese",
    "Kıvamına göre değişir": "Varies with thickness",
    "Badem büyüklüğüne göre değişir": "Depends on almond size",
    "30 g ölçek varsayımı; ürün etiketini kontrol et": "Assumes a 30 g scoop; check the product label",
    "Diş büyüklüğü değişir": "Clove size varies",
    "Doğranmadan önceki yaklaşık miktar": "Approximate weight before cutting",
    "Biberin türüne ve büyüklüğüne göre değişir": "Depends on pepper type and size",
    "Boyuta göre değişir": "Size varies",
    "Dilimin gramajını kontrol et": "Check slice weight",
    "Gevşek yerleştirilmiş, doğranmamış yaprak": "Loose, unchopped leaves"
  },
  "batchSafety": {
    "burrito": "Cook all the rice for the batch in one pot. Cook chicken in several batches if needed, checking for a minimum internal temperature of 74°C (165°F). Cool rice and chicken quickly in shallow containers and freeze servings you will not eat right away on the same day. Pack sauce separately. Thaw safely and reheat thoroughly.",
    "oats": "You can portion dry ingredients in advance. Add milk, yogurt or fresh fruit the night before or on the day of eating. Refrigerate dairy meals and do not leave them at room temperature for hours.",
    "eggsandwich": "Portion bread, cheese and vegetables ahead of time. Cook eggs completely. Keep prepared sandwiches chilled rather than leaving them at room temperature for hours.",
    "chickenbowl": "Cook the rice in one pot and cook the chicken in batches if necessary until its internal temperature reaches 74°C (165°F). Cool cooked rice and chicken quickly in shallow containers. Freeze portions you will not eat right away on the same day. Pack yogurt separately and keep the food cold.",
    "yogurtbowl": "You can portion dry ingredients in advance. Add yogurt and fresh fruit shortly before eating. Keep prepared dairy meals refrigerated and do not leave them at room temperature for hours.",
    "snack": "Portion shelf stable ingredients in advance. Prepare perishable ingredients on the day you eat them and store them at a safe temperature."
  }
};
let language='tr';
const get=()=>language;
const set=code=>{language=code==='en'?'en':'tr';};
const t=(text)=>language==='en'?(en.dynamic[text]??en.static[text]??text):text;
const ingredient=i=>language==='en'?(en.names[i.id]||i.name):i.name;
const recipeName=r=>language==='en'?(en.recipes[r.id]?.name||r.name):r.name;
const recipeSteps=r=>language==='en'?(en.recipes[r.id]?.steps||r.steps):r.steps;
const category=s=>language==='en'?(en.categories[s]||s):s;
const serving=r=>language==='en'?(en.recipes[r.id]?.servingLabel||r.servingLabel):r.servingLabel;
const group=g=>language==='en'?(en.groups[g.id]||g.name):g.name;
const quantity=(n,unit)=>language==='en'&&unit==='adet'?new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(n)+' pcs':null;
const fmtAmount=(label,unit)=>{
 if(language!=='en')return label;
 if(unit==='adet')return label.replace(' adet',' pcs');
 return label.replace(/,(?=\d)/g,'.');
};
const packageLabel=g=>{
 if(language!=='en')return null;
 if(g.ingredient.loose)return fmtAmount(g.purchaseQuantity.toLocaleString('tr-TR')+' '+g.ingredient.unit,g.ingredient.unit)+' loose';
 return g.packs+' × '+(en.package[g.id]||g.ingredient.packageLabel);
};
const measure=(m)=>{
 if(!m||language!=='en')return m;
 const translate=s=>{
  let result=s;
  const keys=Object.keys(en.dynamic).filter(x=>x&&x!== 'Öğün ').sort((a,b)=>b.length-a.length);
  for(const k of keys){if(result.includes(k))result=result.split(k).join(en.dynamic[k]);}
  return result;
 };
 return {label:translate(m.label),note:translate(m.note)};
};
const weekDay=i=>language==='en'?en.weekdays[i]:['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'][i];
const number=n=>new Intl.NumberFormat(language==='en'?'en-US':'tr-TR',{maximumFractionDigits:1}).format(n);
const money=n=>new Intl.NumberFormat(language==='en'?'en-US':'tr-TR',{maximumFractionDigits:0}).format(n)+' TL';
const staticOriginal=new WeakMap();
const attrOriginal=new WeakMap();
const translateStatic=()=>{
 if(typeof document==='undefined')return;
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  const parent=node.parentElement;if(!parent||['SCRIPT','STYLE'].includes(parent.tagName))continue;
  const original=staticOriginal.has(node)?staticOriginal.get(node):node.nodeValue;
  if(!staticOriginal.has(node))staticOriginal.set(node,original);
  const trimmed=original.trim();
  if(!trimmed||!en.static[trimmed])continue;
  node.nodeValue=language==='en'?original.replace(trimmed,en.static[trimmed]):original;
 }
 for(const el of document.querySelectorAll('[placeholder],[title],[aria-label]')){
  let attrs=attrOriginal.get(el);
  if(!attrs){attrs={};for(const key of ['placeholder','title','aria-label'])if(el.hasAttribute(key))attrs[key]=el.getAttribute(key);attrOriginal.set(el,attrs);}
  for(const [key,value] of Object.entries(attrs))if(en.static[value])el.setAttribute(key,language==='en'?en.static[value]:value);
 }
};
root.MealI18n={set,get,t,ingredient,recipeName,recipeSteps,category,serving,group,fmtAmount,packageLabel,measure,weekDay,number,money,translateStatic,english:en};
})(globalThis);
