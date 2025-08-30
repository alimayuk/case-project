import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const sessionKey = request.cookies.get('session_key')?.value;
    
    if (!sessionKey) {
      return NextResponse.json(
        { error: { code: 'MISSING_SESSION', message: 'Session key is required' } },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const apiUrl = `${process.env.API_URL}/cart/items`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        session_key: sessionKey
      }),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}