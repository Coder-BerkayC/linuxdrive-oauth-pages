# Haftalık Marketim | Geliştirme Planı
Sürüm: 2.0
Tarih: 21 Kasım 2026
Kapsam: Safari uyumlu, kişisel kullanıma yönelik yedi günlük öğün planlama ve alışveriş uygulaması.

## Amaç

Bir kişinin her hafta aynı alışveriş listesini elle yazmasını engellemek. Kullanıcı bir haftanın her gününde kaç öğün olacağına, öğünlerde hangi tarifin yenileceğine ve kaç porsiyon hazırlanacağına karar verir. Uygulama bu kararları temel alarak toplam alışveriş miktarlarını ve yaklaşık kalori, protein, karbonhidrat, yağ miktarlarını hesaplar.

## Uygulanan özellikler

1. **Yedi gün:** Pazartesi ile Pazar, İstanbul zaman dilimine göre takvim. Günler arasında gezinme ve önceki/sonraki hafta.
2. **Öğün sayısı:** Her gün bağımsız öğün ekleme/silme; ayrıca tüm yedi gün için toplu öğün sayısı belirleme.
3. **Tarif seçimi:** Her öğüne katalogdan bir tarif seçme ve porsiyonu 0,5 ile 10 arasında ayarlama.
4. **Tarif kataloğu:** Tavuklu pilavlı burrito, muzlu çikolatalı overnight oats, elma badem, yumurtalı kaşarlı sandviç, tavuklu pilav kasesi, yoğurtlu meyveli yulaf.
5. **Besin hesabı:** Her malzemenin 100 g, 100 ml veya adet başına yaklaşık besin değerlerinden deterministik toplama. Dört makro alanı: kcal, protein, karbonhidrat, yağ.
6. **Otomatik alışveriş:** Bir haftadaki tüm öğünlerin malzemeleri birleştirilir. İhtiyaçlar Türkiye'deki yaygın paket boyutlarına yuvarlanır; açık reyon ürünleri 100 gram adımlarla gösterilir.
7. **Stok ve tik:** Evde var işaretleri kalıcıdır; satın alındı işaretleri haftaya özeldir. Her pazartesi yeni hafta için tikler boştur. Son düzenlenen öğün şablonu sonraki haftada başlangıç olarak kullanılır.
8. **Fiyat:** Paket veya açık reyon birimi başına TL fiyatı Safari'de yerel olarak saklanır. Eksik fiyatlar bilinmeyen olarak gösterilir, toplam yanlış şekilde tam maliyet diye sunulmaz.
9. **Hedefler:** İsteğe bağlı günlük kalori hedefi; referans ağırlık x seçilebilir gram/kg faktörüyle protein hedefi veya manuel protein hedefi. Kullanıcının kilosu, adı, fotoğrafı veya sağlık bilgisi public repoda saklanmaz.
10. **AI devri:** Haftalık planın gerekirse başka bir istemciye yapıştırılabilecek özeti kullanıcı talebiyle panoya kopyalanır. API bağlantısı olmadan hiçbir bilgi dışarı gönderilmez.

## Yapılabilirlik kararı

| Fikir | Karar | Durum |
|---|---|---|
| Haftanın 7 günü | Tamamen uygulanabilir | Uygulandı |
| Öğün sayısı seçimi | Tamamen uygulanabilir | Uygulandı |
| Öğün bazında tarif seçimi | Tamamen uygulanabilir | Uygulandı |
| Tarif sayısına göre alışveriş | Tamamen uygulanabilir | Uygulandı |
| Günlük kalori ve makrolar | Uygulanabilir, besin etiketi doğrulaması gerekir | Yaklaşık hesap uygulandı |
| Kişisel protein hedefi | Uygulanabilir, klinik karar olmamalı | Yerel ve düzenlenebilir hedef uygulandı |
| FreeLLMAPI ile otomatik yorum | Uygulanabilir, özel kimlik doğrulamalı backend gerekir | Canlı API kapalı, entegrasyon tasarımı hazır |
| GitHub Pages'te unified key saklamak | Güvenli değil | Uygulanmadı |
| Modelin besin hesabında tek otorite olması | Sayısal hata riski nedeniyle uygun değil | Uygulanmadı |
| Kullanıcı tarifi oluşturma / etiket tarama | Uygulanabilir ama giriş doğrulama ve besin kaynakları gerekir | Sonraki sürüme bırakıldı |
| Çok cihazlı senkronizasyon | Kullanıcı hesabı ve güvenli depolama gerekir | Sonraki sürüme bırakıldı |

## Sayısal hesaplama ve kaynak

`catalog.v2.json` malzemeler, gramajlar, birim, paket boyutları ve yaklaşık besin değerlerini içerir. `engine.v2.js` tarifin porsiyon başına besin değerlerini hesaplar; `app.v2.js` kullanıcı seçimlerine uygular.

Bir tarifteki malzeme miktarı `q` ve besin değeri `N` ise:
* g/ml ürünlerde katkı `N × q/100`
* adet ürünlerinde katkı `N × q`
* haftalık ihtiyaç `Σ (tarif miktarı × porsiyon sayısı × öğün tekrar sayısı)`
* paket sayısı `ceil(haftalık ihtiyaç / paket birimi)`

Önemli: Kalori ve makro değerleri başlangıç için genel, yaklaşık değerlerdir. Özellikle tortilla, süzme yoğurt, peynir ve protein tozu marka/çeşit bazında değişebilir. Bazı ürünler çiğ veya kuru olarak ölçülür. Ambalaj besin etiketleri doğrulandıktan sonra katalog güncellenmelidir.

Protein katsayısının başlangıç seçeneği 1,6 g/kg'dır. Bu kullanıcıya özel reçete değildir. Referans ağırlık olarak doğrudan güncel kilo yerine uygun bir hedef veya referans ağırlık da seçilebilir. Kişisel sağlık koşulları bir sağlık uzmanıyla değerlendirilir.

## Gizlilik ve güvenlik

* GitHub Pages statik ve public. HTML, JS, tarif kataloğu herkesçe görülebilir.
* Tercihler ve hedefler cihazın `localStorage` alanında tutulur: `mealplanner:v2:` öneki.
* Eski sitedeki `mealplan:v1:stock` ve `mealplan:v1:prices` tercihleri ilk açılışta bir defa taşınır.
* Tarayıcı verileri silinirse kişisel seçimler kaybolur; başka cihazla senkronize değildir.
* OAuth tanıtım sayfaları ve rclone yapılandırması korunur. rclone token, Google Drive yetkisi veya API anahtarı bu projeye eklenmez.

## FreeLLMAPI United API güvenli mimarisi (sonraki aşama)

**Amaç:** Model yalnızca seçenek üretir ve metinsel değerlendirme yapar. Kalori ve protein hesapları uygulamanın sayısal motorunda kalır.

İleride kurulacak akış:
1. Safari'de kullanıcı açıkça `AI ile değerlendir` seçer.
2. Uygulama kimlik doğrulamalı, HTTPS kullanan kişisel bir sunucuya yalnızca izin verilen asgari plan verisini gönderir.
3. Sunucu FreeLLMAPI gateway'inin `/v1/chat/completions` arayüzünü özel bir unified key ile çağırır.
4. Gateway ve hizmet sağlayıcı, kendilerine gönderilen içeriği görebilir. Göndermeden önce kullanıcının rızası istenir ve kişisel bilgileri azaltılır.
5. Model bir öneri JSON'u döndürür. Sunucu şema, öğün ve tarif kimlikleri, porsiyon sınırları ve içerik izinlerini doğrular.
6. Tarayıcı öneriyi uygulanmadan önce gösterir. Kullanıcı onaylarsa planı düzenler; besin değerleri deterministik olarak tekrar hesaplanır.
7. İstek hızı, maliyet ve günlük limitler backend'de kontrol edilir. CORS tek başına kimlik doğrulama sayılmaz.

**Yapılmayacaklar:** Unified API anahtarını `plan.json`, JS, HTML, git history veya `localStorage` içine yazma; paylaşılan public API endpointini oturumsuz açma; AI tahminini doğrulanmamış besin etiketi olarak kaydetme.

Bunun için kullanıcının seçtiği özel backend / kimlik doğrulama çözümü ayrıca gerekli. Mevcut FreeLLMAPI gateway'in erişim URL'si veya sunucu ortamı bu sürümde doğrulanmadığından canlı bağlantı kurulmadı.

## Kontroller

`tests/engine.test.cjs` ile:
* katalog geçerli mi?
* hafta Pazartesi/Pazar mı?
* varsayılan 7 gün oluşturuluyor mu?
* 14 burrito için 2,8 kg tavuk ve 3 adet 1 kg paket hesaplanıyor mu?
* porsiyon değişince günlük makro ve alışveriş değişiyor mu?
* boş plan boş alışveriş veriyor mu?
* haftalık satın alma durumu sıfırlanırken tarif şablonu kopyalanıyor mu?
* açık reyon miktarları doğru hesaplanıyor mu?

## Sürüm sonrası hedefler

1. Ürün etiketlerinden kalori ve gramaj düzeltme ekranı.
2. Kullanıcı tanımlı tarif oluşturma, tarif silme ve doğrulamalı malzeme girişi.
3. Alışveriş fişinden marka, ağırlık ve fiyat karşılaştırması; Migros fiyat/gram oranı.
4. Kilerdeki mevcut miktarların gram bazında düşülmesi ve israf optimizasyonu.
5. Opsiyonel şifreli kişisel depolama veya çok cihaz senkronizasyonu.
6. Kimlik doğrulamalı FreeLLMAPI öneri servisi ve kullanıcı onaylı plan değişikliği.
7. Beslenme planının değişimlerinde otomatik test ve sürüm notları.

## Mevcut yayına etkisi

Değişen tek uygulama sayfası `meal-planner/index.html`; yeni kod ve katalog yalnızca `meal-planner/` altındadır. OAuth `index.html`, `privacy.html` ve repo kökünü değiştirmeyin. Yayınlanan adres değişmez.
