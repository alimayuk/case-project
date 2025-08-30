'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Search, Home } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function Navigation() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition">
            MiniSepet
          </Link>
          
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`flex items-center gap-1 transition-colors ${
                pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Home size={20} />
              <span>Ana Sayfa</span>
            </Link>

            <Link
              href="/search"
              className={`flex items-center gap-1 transition-colors ${
                pathname === '/search' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Search size={20} />
              <span>Arama</span>
            </Link>

            <Link
              href="/cart"
              className={`flex items-center gap-1 transition-colors ${
                pathname === '/cart' ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <div className="relative">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>Sepet</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
