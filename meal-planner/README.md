# Haftalık Marketim

Safari'den kullanılmak üzere hazırlanmış statik haftalık alışveriş ve tarif sitesi.

## Bağlantı ve yayın

GitHub Pages yayın kaynağı bu repoda `main` ve `/(root)` olmalı. Bu ayar açıksa sayfa:

https://coder-berkayc.github.io/linuxdrive-oauth-pages/meal-planner/

Henüz aktif değilse repo `Settings > Pages > Build and deployment > Deploy from a branch > main > /(root) > Save` menüsünden bir kez etkinleştirilir.

Bu alt klasör, repodaki mevcut OAuth ana sayfası ve gizlilik metninden ayrı tutulur.

## Kullanım

* Pazartesi yeni hafta otomatik oluşur. Sonraki veya önceki haftaya bakılabilir.
* Aldım işaretleri haftaya özeldir. `Evde var` işaretleri sonraki haftalarda da kalır.
* Ürünlerin yanında yazan paket miktarları Türkiye marketlerine uygundur. Haftalık tüketim ayrı görünür.
* Ürünlerin fiyatına dokunarak paket fiyatı girilebilir. Sadece fiyatı bilinen kalemlerin toplamı hesaplanır, eksik kalem sayısı gösterilir.
* `Alınacak listeyi kopyala` düğmesi sadece alınması gereken ürünleri panoya alır.
* Safari'den Paylaş menüsü ile Ana Ekrana Ekle kullanılabilir.

## Listeyi ChatGPT ile güncelleme

Kaynak dosya: `meal-planner/plan.json`

Kullanıcı yeni tarif, malzeme, porsiyon veya paket değişikliği istediğinde aynı JSON dosyası güncellenir. Mevcut `id` değerlerini değiştirmemek önemli: Safari'deki önceki stok ve fiyat seçimleri o değerlerle eşleştiriliyor.

Normal haftalarda dosyayı değiştirmek gerekmez. Tarih hesabı iPhone'un saatinden değil, `Europe/Istanbul` zaman diliminden yapılır. Site her açıldığında güncel JSON'u yükler; son erişilen plan ağ kesilirse cihazda önbellekten bulunabilir.

## Gizlilik

Repo ve temel tarif/alım listesi herkese açıktır. Kişiye özel sağlık ve ağırlık bilgileri repoya eklenmemiştir. Safari'deki işaretler, stok ve kaydedilen fiyatlar tarayıcı `localStorage` alanındadır; GitHub'a, başka cihaza veya hesaba senkronize edilmez. Tarayıcı verileri silinirse kayıtlar kaybolabilir.

## Saklama güvenliği

Tavuk ve pirinçli dürümlerin okulda gün boyunca güvenli soğuklukta saklanması gerekir. Buzdolabı olmadığında 4°C altında tutulduğu doğrulanamayan akşam dürümü güvenli kabul edilmez. Mikrodalgada ısıtma önceki güvensiz saklama koşullarını düzeltmez.

## Sürüm

İlk sürüm: 21 Kasım 2026. Kaynak: 15 Kasım 2026 tarihli `Haftalik_Okul_Beslenme_ve_Alisveris_Plani.md` sürüm 1.2. Fiyatlar otomatik piyasa verisi değildir.
