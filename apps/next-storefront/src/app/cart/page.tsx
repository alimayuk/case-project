'use client';

import { useEffect, useState } from 'react';
import { Cart, CartItem as CartItemType } from '@/types';
import CartItem from '@/components/CartItem';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/cart');
        const data = await response.json();
        
        if (response.ok) {
          setCart(data.data);
        } else {
          setError(data.error?.message || 'Sepet yüklenemedi');
          setCart(null);
        }
      } catch (error) {
        console.error('Sepet yükleme hatası:', error);
        setError('Bağlantı hatası');
        setCart(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, []);
  
  const updateCart = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      
      if (response.ok) {
        setCart(data.data);
        setError(null);
      } else {
        setError(data.error?.message || 'Sepet güncellenemedi');
      }
    } catch (error) {
      console.error('Sepet güncelleme hatası:', error);
      setError('Bağlantı hatası');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Sepet yükleniyor...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold mb-4">Hata</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-8">Sepetinize henüz ürün eklemediniz.</p>
          <Link
            href="/search"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sepetim</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border">
            {cart.items.map((item: CartItemType) => (
              <CartItem 
                key={item.id} 
                item={item} 
                onUpdate={updateCart}
              />
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
          
          {cart.summary && (
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Ara Toplam (KDV Hariç)</span>
                <span>{cart.summary.subtotal_excl_vat.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between">
                <span>KDV Toplamı</span>
                <span>{cart.summary.vat_total.toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Genel Toplam</span>
                <span>{cart.summary.grand_total.toFixed(2)} ₺</span>
              </div>
            </div>
          )}
          
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 mb-4">
            Ödeme Yap
          </button>
          
          <Link
            href="/search"
            className="block text-center text-blue-600 hover:underline"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
}