'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchClientProps {
    initialProducts: Product[];
    initialQuery: string;
}

export default function SearchClient({ initialProducts, initialQuery }: SearchClientProps) {
    const [products, setProducts] = useState(initialProducts);
    const [query, setQuery] = useState(initialQuery);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSearch = async (searchQuery: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('query', searchQuery);
            params.append('status', '1');

            const response = await fetch(`/api/products?${params.toString()}`);
            const data = await response.json();

            if (response.ok) {
                setProducts(data.data || []);
                router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const searchQuery = formData.get('search') as string;
                    handleSearch(searchQuery);
                }}
                className="mb-8"
            >
                <div className="flex gap-2">
                    <input
                        type="text"
                        name="search"
                        defaultValue={query}
                        placeholder="Ürün adı veya SKU ara..."
                        className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition"
                    >
                        {loading ? (
                            <>
                                <span className="loader-border loader-small"></span>
                                Aranıyor...
                            </>
                        ) : (
                            'Ara'
                        )}
                    </button>
                </div>
            </form>

            {/* Results */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <span className="loader-border loader-large"></span>
                    <span className="ml-2 text-gray-500">Ürünler yükleniyor...</span>
                </div>
            ) : products.length === 0 && query ? (
                <p className="text-center text-gray-500 flex flex-col items-center py-16">
                    <span className="text-3xl mb-2">😕</span>
                    Aramanızla eşleşen ürün bulunamadı.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="transition transform hover:scale-105 hover:shadow-lg">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
