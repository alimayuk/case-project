import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

async function getFeaturedProducts(): Promise<Product[]> {
  const response = await fetch(
    `${process.env.API_URL}/products?status=1&sort=-created_at&limit=8`,
    {
      next: { revalidate: 60 }
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data || [];
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Öne Çıkan Ürünler</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">Henüz ürün bulunmamaktadır.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}