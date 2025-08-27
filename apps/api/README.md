# Laravel 11 / Mini E-Ticaret API

Bu proje, Laravel 11 ile geliştirilmiş basit bir e-ticaret API'sidir.  
Amaç: Ürünleri listelemek, varyantlarını yönetmek ve sepete eklemek, stok kontrolü ve KDV hesaplamaları ile birlikte test edilebilir bir yapı sağlamak.

---

## Kurulum

git clone <https://github.com/alimayuk/case-project.git>
cd <repo-folder>
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

---

## Özellikler

-   Ürün yönetimi (products, product_variants)
-   Sepet yönetimi (carts, cart_items)
-   Stok kontrolü (sepete ekleme ve güncelleme sırasında)
-   Sepet fiyat snapshot’ları (`unit_price_snapshot`, `vat_rate_snapshot`)
-   KDV hesaplamaları (ara toplam, KDV toplamı, genel toplam)
-   Cache mekanizması (ürün listesi için 60 saniye)
-   Rate limit (saniyede 5 istek sepete ekleme/güncelleme/silme)
-   JSON hata yapısı (`code`, `message`, `fields`)
-   Feature testler (ürün arama, sepete ekleme, stok aşımları)

---

## Modeller & İlişkiler

-   **products**: `id, sku (unique), name, price, vat_rate, status [0/1], created_at`
-   **product_variants**: `id, product_id, variant_name, quantity, price_override`
-   **carts**: `id, user_id (nullable), session_key, created_at`
-   **cart_items**: `id, cart_id, product_variant_id, qty, unit_price_snapshot, vat_rate_snapshot, created_at`

Kurallar:

-   Sepete eklenen ürünün fiyatı ve KDV oranı snapshot olarak kaydedilir.
-   Sepete ekleme ve güncellemede stok yeterliliği kontrol edilir.

---

## Endpoint’ler

### Sepet

| Method | Endpoint                    | Açıklama                                                               |
| ------ | --------------------------- | ---------------------------------------------------------------------- |
| POST   | `/api/cart`                 | Anonim kullanıcı için sepet oluşturur, döner: `cart_id`, `session_key` |
| GET    | `/api/cart?session_key=...` | Sepeti ve özetini getirir (subtotal, vat_total, grand_total)           |
| POST   | `/api/cart/items`           | Sepete ürün ekler. Body: `{ session_key, product_variant_id, qty }`    |
| PATCH  | `/api/cart/items/{id}`      | Sepet öğesinin miktarını günceller, stok kontrolü yapılır              |
| DELETE | `/api/cart/items/{id}`      | Sepet öğesini siler, stok geri eklenir                                 |

### Ürün

| Method | Endpoint                          | Açıklama                                                                           |
| ------ | --------------------------------- | ---------------------------------------------------------------------------------- |
| GET    | `/api/products`                   | Ürünleri listeler, filtreleme ve sayfalama (`query`, `status`, `per_page`, `sort`) |
| GET    | `/api/products/{id}/other-colors` | Aynı SKU grubundaki diğer renk varyantları                                         |
| GET    | `/api/products/{id}/variants`     | Belirli ürünün varyantlarını getirir                                               |

---

## Cache

-   `/api/products` endpointi, query parametrelerine göre **60 saniye cache**lenir.
-   Cache temizleme: `Cache::flush()` (geliştirme ortamı)

---

## Test

-   php artisan test

---

## Hata Yapısı

Tüm hatalar tutarlı JSON formatında döner:

```json
{
    "code": 422,
    "message": "Yetersiz stok",
    "fields": {
        "available_quantity": 3
    }
}
```
