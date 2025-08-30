'use client';

import { Product } from '@/types';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import { PackageX } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const defaultVariant = product.variants?.find(v => v.quantity > 0);
  const isInStock = !!defaultVariant;
  const hasVariants = product.variants && product.variants.length > 0;

  const handleAddSuccess = () => {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all bg-white">
      <div className="aspect-square bg-gray-200 relative flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-gray-400">
          <span className="text-4xl">🖼️</span>
          <span className="text-sm mt-1">Ürün Görseli</span>
        </div>
      </div>

      <div className="p-5 flex flex-col">
        <Link href={`/product/${product.id}`} className="hover:text-blue-600">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">
            {product.price} ₺
          </span>

          {hasVariants ? (
            isInStock ? (
              <AddToCartButton
                variant={defaultVariant}
                product={product}
                onAdd={handleAddSuccess}
              />
            ) : (
              <span className="flex items-center gap-1 text-sm font-semibold text-red-500 bg-red-100 px-3 py-1 rounded-lg">
                <PackageX className="w-4 h-4" /> Tükendi
              </span>
            )
          ) : (
            <span className="flex items-center gap-1 text-sm font-semibold text-red-500 bg-red-100 px-3 py-1 rounded-lg">
              <PackageX className="w-4 h-4" /> Stokta Yok
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
