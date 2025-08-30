import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status') || '';
    const sort = searchParams.get('sort') || '';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '8';
    
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (status) params.append('status', status);
    if (sort) params.append('sort', sort);
    params.append('page', page);
    params.append('per_page', limit);
    
    const apiUrl = `${process.env.API_URL}/products?${params.toString()}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }
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