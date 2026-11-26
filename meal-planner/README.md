# Haftalık Marketim

Safari ile kullanılabilen yedi günlük kişisel öğün ve alışveriş planlayıcısı.

## Site

https://coder-berkayc.github.io/linuxdrive-oauth-pages/meal-planner/

GitHub Pages yayın kaynağı `main` ve `/(root)`. Bu alt klasör mevcut LinuxDrive OAuth ana sayfasından ayrıdır.

## Mevcut sürüm (2.0)

* Pazartesi ile Pazar arasında 7 günlük plan.
* Öğün sayısı her gün ayrı ayarlanabilir. Tüm haftaya aynı öğün sayısı veya seçili günün tarifleri uygulanabilir.
* Her öğün için bir tarif ve porsiyon sayısı seçilir.
* Malzemeler otomatik toplanır, Türkiye'deki yaygın paket boyutlarına yuvarlanır.
* Günlük kalori, protein, karbonhidrat ve yağ yaklaşık hesaplanır.
* Haftalık alışveriş, stok işaretleri, alınan ürünler ve paket fiyatı takibi yapılır.
* Protein hedefi referans kg × gram/kg veya manuel değerle kişiselleştirilebilir.
* Tarif kitaplığında 6 tarif ve hazırlama notları bulunur.
* Her tarifte **Toplu hazırla** düğmesi o haftanın seçili toplam porsiyonlarını sayar. Tüm malzemeleri çiğ/kuru miktarlarıyla porsiyon sayısına göre çarpar. Kullanıcı toplu hazırlık porsiyonunu bağımsız değiştirebilir veya hafta miktarına dönebilir. Bu hesap haftalık öğün ya da alışveriş listesini değiştirmez. Hazırlama ve saklama uyarıları görünür.
* FreeLLMAPI için güvenli entegrasyon planı vardır; canlı model bağlantısı henüz yoktur.

## Ana dosyalar

* `index.html`: Uygulamanın ana ekranı.
* `styles.v2.css`: Mobil Safari arayüzü.
* `engine.v2.js`: Saf alışveriş ve besin hesaplama fonksiyonları.
* `app.v2.js`: Kullanıcı arayüzü, tarayıcı verileri ve haftalık plan.
* `catalog.v2.json`: Malzemeler, paket boyutları, yaklaşık makrolar ve tarifler.
* `DEVELOPMENT_PLAN.md`: Uygulama kararları, aşamalar, güvenlik, AI mimarisi ve testler.
* `tests/engine.test.cjs`: Hesaplama regresyon testleri.
* `tests/batch.test.cjs`: Toplu hazırlık porsiyon, pirinç, tavuk ve diğer malzeme hesapları.
* `plan.json`: Eski sabit liste sürüm 1 verisi, yeni hesaplama motoru bunu kullanmaz.

## Turkish and English language switch

* Üst bölümdeki `TR / EN` düğmesiyle arayüz dili anında değiştirilir.
* Dil seçimi aynı tarayıcıda `mealplanner:v2:language` anahtarıyla saklanır. Mevcut öğün, fiyat, stok ve diğer kullanıcı kayıtları korunur.
* Kapsam: sabit arayüz metinleri, haftanın günleri, tarif başlıkları ve adımları, malzeme ve kategori isimleri, paket açıklamaları, toplu hazırlık, mutfak ölçüleri, alışveriş listesinin kopyalanan metni, hedef ve güvenlik uyarıları.
* `i18n.v3.js` içinde İngilizce çeviri sözlüğü tutulur. Tüm hesaplamalar orijinal tarif ve malzeme ID'leri üzerinden yapılır; dil değişince hesaplamaların matematiği değişmez.
* Siteye özel API anahtarı, çeviri API hizmeti veya ücretli istek eklenmedi.
* Yerel doğrulama: `tests/i18n.test.cjs`. iPhone Safari üzerindeki manuel kullanım kontrolü ayrıca gerekir.

## Kalori dengesi ve egzersiz sekmesi

`Kalori Dengesi / Energy Balance` yeni beşinci sekmedir.

* Yaş, boy (cm), kilo (kg), Mifflin St Jeor denklem katsayısı ve antrenman **hariç** günlük hareket seviyesi girilir.
* `Mifflin St Jeor` dinlenme enerji harcaması: `10 × kilo + 6.25 × boy − 5 × yaş + 5` (erkek referans denklemi) veya `−161` (kadın referans denklemi). Denklemin her bireye uygun olmadığı kullanıcıya söylenir.
* Günlük hareket katsayıları 1.2, 1.35, 1.5 ve 1.7 olarak belirlenen yaklaşık aktivite varsayımlarıdır. Bu, antrenman hariç gün içi hareketi kapsar.
* Egzersiz türü, seans dakikası ve haftanın seçili günleri girilir. 2024 Physical Activity Compendium MET benzeri temsilî değerleri kullanılır. Ek egzersiz enerjisi kabaca `(MET − 1) × kilo × dakika / 60`; 1 MET dinlenme harcamasını tekrar saymamak için çıkarılır. Tahminler kişiye göre ciddi değişkenlik gösterebilir.
* Günlük **tahmini koruma kalorisi**: `dinlenme enerjisi × günlük hareket katsayısı + o günün net egzersiz kalorisi`.
* Günlük öğün planından gelen kalorilerle koruma tahmini karşılaştırılır. Pozitif fark **tahmini açık**, negatif fark **tahmini fazla** demektir.
* İsteyen kullanıcı gerçekten yediği toplam kaloriyi ayrı kaydeder. Bu kaydın kullanıldığı sonuç `kayıt / logged` olarak etiketlenir. Giriş yoksa gösterilen fark yalnızca `plan` olarak etiketlenir.
* Haftalık kalori günlüğü haftanın her takvim gününe göre cihazda saklanır. Tarihi takip etmek için `Europe/Istanbul` hafta başlangıcı kullanılır.
* Kullanıcı örnek bir günlük hedef açık girebilir, ancak bu klinik ya da kişiye özel reçete değildir. **Gerçek veya ölçülmüş bir açık olarak sunulmaz.**
* Boy, kilo, yaş, katsayı, egzersiz ve tüketim kayıtları GitHub'a yüklenmez. Safari `localStorage` kullanılır; başka cihazla senkronize olmaz.
* Sayısal motor `energy.v1.js`, bağımsız arayüz `energy-ui.v1.js`, test `tests/energy.test.cjs`.
* Metotlar sadece yetişkinlerde genel tahmin için kullanılır. Beslenme tedavisi, gebelik, hastalık veya özel ihtiyaçlar sağlık uzmanıyla değerlendirilir.

Kaynaklar:

* Mifflin et al., *A new predictive equation for resting energy expenditure in healthy individuals* (1990): https://pubmed.ncbi.nlm.nih.gov/2305711/
* 2024 Adult Compendium of Physical Activities: https://pacompendium.com/adult-compendium/
* 2024 Compendium yöntem makalesi: https://pmc.ncbi.nlm.nih.gov/articles/PMC10818145/

## Mutfak ölçüsü dönüşümü

* Tarifler ve alışveriş ekranındaki `Mutfak ölçüsü: Kapalı` düğmesiyle gram ve ml miktarlarının tahmini kaşık, bardak, adet karşılıkları açılır ve kapatılır.
* 1 çay kaşığı = 5 ml, 1 tatlı kaşığı = 10 ml, 1 yemek kaşığı = 15 ml, 1 standart su bardağı = 200 ml kabul edilir. Her malzemenin kaşığa sığan gram miktarı farklıdır.
* Dönüşüm açıldığında mutfak karşılığının yanında özgün gram miktarı kalır. Protein miktarı gibi hassas porsiyonlarda tartı önerilir. Tarifin kalori ve protein hesabı değişmez.
* Tercih Safari'de saklanır, diğer uygulama verileriyle birlikte korunur. Alışverişte satın alınacak paketler her zaman gram veya adet olarak kalır.

## Kullanım

1. Siteyi iPhone Safari'de açıp Paylaş menüsünden Ana Ekrana Ekle.
2. `7 Gün` sekmesinden bir gün seçip öğün ekle, sil veya tarif değiştir.
3. Porsiyon sayısını ayarla. `Alışveriş` sekmesi otomatik yeniden hesaplanır.
4. `Evde var` işaretleri sonraki haftalara taşınır; `Alındı` tikleri sadece ilgili haftaya aittir.
5. Ürünün paket fiyatını TL olarak gir. Açık reyonda fiyat, arayüzdeki 100 g birimine göre girilir.
6. `Hedefler` sekmesinden isteğe bağlı kalori ve protein hedefini belirle.
7. İstersen haftalık plan özetini kullanıcı işlemiyle kopyalayarak AI danışmanlığına sun.

Yeni hafta başladığında alındı işaretleri temizdir. Son kullandığın öğün düzeni yeni haftaya başlangıç şablonu olarak aktarılır.

## Veri saklama

Hedefler, öğün seçimleri, stok ve fiyatlar yalnızca Safari'nin `localStorage` alanında tutulur. Repoya veya sunucuya gönderilmez ve cihazlar arasında senkronize olmaz. Tarayıcı verilerini silmek kayıtları da kaldırır. Sürüm 1 stok ve fiyatları ilk açılışta otomatik taşınır.

Repo public olduğundan tarifler, malzemeler ve kod herkese açıktır. Kişisel kilo, fotoğraf, tahlil, token ve kimlik bilgisi repoya yüklenmemelidir.

## Beslenme verisi uyarısı

Genel makrolar tahmindir; marka etiketleri ve gramajlar doğrulanmalıdır. Protein hedefi hesaplayıcısı sağlık önerisi yerine geçmez. Okulda tavuklu, pirinçli ve sütlü yiyecekler güvenli şekilde soğuk taşınmalıdır.

## Yayın ve doğrulama

GitHub dosyaları güncellendiğinde Pages yeni sürümü yayınlar. Safari önbelleği bazı güncellemeleri geciktirebilir. İleri seviye teknik değerlendirme ve gelecekteki FreeLLMAPI bağlantısı için `DEVELOPMENT_PLAN.md` dosyasına bak.

Otomatik testler: `node --test meal-planner/tests/engine.test.cjs`. Testler sunucusuz hesaplama motorunu kapsar; iPhone Safari üzerinde gerçek cihaz doğrulaması ayrıca yapılmalıdır.
