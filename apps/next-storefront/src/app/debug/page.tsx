'use client';

import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [sessionKey, setSessionKey] = useState<string>('');
  const [cartData, setCartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getCookie = (name: string) => {
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
  };

  const getCart = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      setCartData(data);
      setMessage(`Status: ${response.status}`);
      
      setSessionKey(getCookie('session_key') || 'Bulunamadı');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const createCart = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/cart', { method: 'POST' });
      const data = await response.json();
      setCartData(data);
      setMessage(`Status: ${response.status}`);
      
      setSessionKey(getCookie('session_key') || 'Bulunamadı');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const clearCookies = () => {
    document.cookie = 'session_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setSessionKey('Bulunamadı');
    setCartData(null);
    setMessage('Cookies temizlendi');
  };

  useEffect(() => {
    setSessionKey(getCookie('session_key') || 'Bulunamadı');
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Sayfası</h1>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p><strong>Session Key:</strong> {sessionKey}</p>
        <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
        <p><strong>Message:</strong> {message}</p>
      </div>

      <div className="space-x-2 mb-4">
        <button 
          onClick={getCart}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Sepeti Getir (GET)
        </button>
        
        <button 
          onClick={createCart}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Yeni Sepet Oluştur (POST)
        </button>

        <button 
          onClick={clearCookies}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Cookies Temizle
        </button>
      </div>

      {loading && <p className="text-blue-600">Yükleniyor...</p>}
      
      {cartData && (
        <div>
          <h2 className="text-xl font-bold mb-2">Response:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(cartData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}