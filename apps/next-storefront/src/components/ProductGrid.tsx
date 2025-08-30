import { Product } from '@/types';
import ProductCard from './ProductCard';

interface Props {
  products?: Product[];
}

export default function ProductGrid({ products = [] }: Props) {
  if (!products.length) return <p>Ürün bulunamadı.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

