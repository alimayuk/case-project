import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let sessionKey = request.cookies.get('session_key')?.value;
  const response = NextResponse.next();

  if (!sessionKey) {
    try {
      const apiResponse = await fetch(`${process.env.API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (apiResponse.ok) {
        const cartData = await apiResponse.json();
        sessionKey = cartData.session_key;
        
        if (sessionKey) {
          response.cookies.set('session_key', sessionKey, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7
          });
        }
      }
    } catch (error) {
      console.error('Sepet oluşturma hatası:', error);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/search',
    '/product/:path*',
    '/cart',
    '/api/cart/:path*',
    '/debug'
  ]
};