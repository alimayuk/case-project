'use client';

import { useState, useEffect } from 'react';

export function useCart() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        const itemCount = data.data?.items?.reduce((total: number, item: any) => total + item.qty, 0) || 0;
        setCartCount(itemCount);
      }
    } catch (error) {
      console.error('Cart count fetch error:', error);
    }
  };

  useEffect(() => {
    updateCartCount();

    // Her 5 saniyede bir güncelle
    const interval = setInterval(updateCartCount, 5000);
    return () => clearInterval(interval);
  }, []);

  return { cartCount, updateCartCount };
}