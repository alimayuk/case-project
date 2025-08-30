🛒 Mini Sepet - Next.js Mağaza Uygulaması
Laravel REST API backend'i ile entegre çalışan modern bir Next.js e-ticaret mağaza uygulaması.

✨ Özellikler
🎯 Sayfalar
Ana Sayfa (/) - SSR ile öne çıkan ürünler

Arama Sayfası (/search) - Server component + client arama

Ürün Detay (/product/[id]) - ISR (60sn revalidate) ile ürün bilgileri

Sepet Sayfası (/cart) - Client component ile sepet yönetimi

Debug Sayfası (/debug) - API test ve debug için

⚡ Teknik Özellikler
Next.js 14+ App Router

TypeScript tam desteği

SSR/ISR/CSR stratejileri

Edge Runtime desteği

Middleware ile session yönetimi

API Route Handlers ile güvenli proxy

Server Actions ile form işlemleri

Responsive tasarım

🛒 Sepet Özellikleri
Aynı ürünler tek satırda birleştirilir

Gerçek zamanlı stok kontrolü

Maksimum stok sınırlaması

Otomatik sepet güncellemesi

Session bazlı sepet yönetimi

🚀 Kurulum
Ön Gereksinimler
Node.js 20+

Laravel API (localhost:8000)

npm veya yarn

Adımlar
Depoyu klonlayın

bash
git clone <https://github.com/alimayuk/case-project.git>
cd storefront-app
Bağımlılıkları yükleyin

bash
npm install
# veya
yarn install
Environment değişkenlerini ayarlayın

env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
API_URL=http://localhost:8000/api
Development sunucusunu başlatın

bash
npm run dev
# veya
yarn dev
Tarayıcıda açın

text
http://localhost:3000
📦 Proje Yapısı
text
storefront-app/
├── app/
│   ├── api/                 # API route handlers
│   │   ├── cart/
│   │   ├── products/
│   │   └── ...
│   ├── cart/               # Sepet sayfası
│   ├── product/[id]/       # Ürün detay sayfası
│   ├── search/             # Arama sayfası
│   └── ...
├── components/             # React bileşenleri
│   ├── AddToCartButton.tsx
│   ├── CartItem.tsx
│   ├── Navigation.tsx
│   ├── ProductCard.tsx
│   └── ...
├── hooks/                  # Custom hooks
│   └── useCart.ts
├── actions/                # Server actions
│   └── cart-actions.ts
├── types/                  # TypeScript tanımları
│   └── index.ts
└── ...
🔧 API Entegrasyonu
Laravel API Endpoint'leri
GET /api/products - Ürün listesi

GET /api/products/{id} - Ürün detay

POST /api/cart - Yeni sepet oluştur

GET /api/cart - Sepeti getir

POST /api/cart/items - Sepete ürün ekle

PATCH /api/cart/items/{id} - Sepet öğesini güncelle

DELETE /api/cart/items/{id} - Sepet öğesini sil

Environment Variables
env
NEXT_PUBLIC_API_URL=http://localhost:8000/api  # Client tarafı
API_URL=http://localhost:8000/api              # Server tarafı
🎨 Kullanım
Ana Sayfa
Öne çıkan ürünleri görüntüleme

Hızlı sepete ekleme

Ürün detaylarına gitme

Arama Sayfası
Ürün adı/SKU arama

Filtreleme ve sıralama

SSR + client interactivity

Ürün Detay
ISR ile hızlı yükleme

Varyant seçimi

Stok bilgisi

Sepete ekleme

Sepet Sayfası
Gerçek zamanlı sepet yönetimi

Miktar güncelleme

Ödeme işlemleri

Otomatik session yönetimi

🛠️ Geliştirme
Script'ler
bash
npm run dev      # Development sunucusu
npm run build    # Production build
npm run start    # Production sunucusu
npm run lint     # ESLint check
Yeni Özellik Eklemek
İlgili sayfayı app/ dizininde oluşturun

TypeScript tanımlarını types/ dizininde güncelleyin

API route'larını app/api/ dizininde ekleyin

Bileşenleri components/ dizininde oluşturun

🔒 Güvenlik
API key'ler client tarafına sızdırılmaz

Tüm API calls server-side yapılır

CORS ve CSRF korumaları

Session management middleware ile