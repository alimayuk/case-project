import { NextRequest, NextResponse } from 'next/server';

async function createNewCart(request: NextRequest) {
  try {
    const apiUrl = `${process.env.API_URL}/cart`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to create cart');
    }
    
    const cartData = await response.json();
    
    if (!cartData.session_key) {
      throw new Error('No session key returned from API');
    }
    
    const nextResponse = NextResponse.json(cartData, { status: 201 });
    nextResponse.cookies.set('session_key', cartData.session_key, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });
    
    return nextResponse;
  } catch (error) {
    console.error('Error creating new cart:', error);
    return NextResponse.json(
      { error: { code: 'CART_CREATION_FAILED', message: 'Failed to create cart' } },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionKey = request.cookies.get('session_key')?.value;
    
    if (!sessionKey) {
      return await createNewCart(request);
    }
    
    const apiUrl = `${process.env.API_URL}/cart?session_key=${sessionKey}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    const data = await response.json();
    
    if (response.status === 404 && data.code === 'CART_NOT_FOUND') {
      return await createNewCart(request);
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in /api/cart:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    return await createNewCart(request);
  } catch (error) {
    console.error('Error in POST /api/cart:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}