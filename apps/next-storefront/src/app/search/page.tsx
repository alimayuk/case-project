import SearchClient from '@/components/SearchClient';
import { Product } from '@/types';

async function getSearchResults(query: string = ''): Promise<Product[]> {
  if (!query) return [];
  
  const params = new URLSearchParams();
  params.append('query', query);
  params.append('status', '1');
  
  try {
    const response = await fetch(
      `${process.env.API_URL}/products?${params.toString()}`,
      {
        next: { revalidate: 60 }
      }
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

interface SearchPageProps {
  searchParams: { query?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.query || '';
  const products = await getSearchResults(query);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ürün Arama</h1>
      
      {query && (
        <p className="mb-4">
          <strong>{products.length}</strong> ürün bulundu: "{query}"
        </p>
      )}
      
      <SearchClient initialProducts={products} initialQuery={query} />
    </div>
  );
}