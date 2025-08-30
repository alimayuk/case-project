'use server';

import { cookies } from 'next/headers';

export async function addToCart(data: { product_variant_id: number; qty: number }) {
    const sessionKey = cookies().get('session_key')?.value;

    if (!sessionKey) {
        return { error: { message: 'Session key not found' } };
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_key: sessionKey,
                product_variant_id: data.product_variant_id,
                qty: data.qty
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result };
        }

        return { success: true, data: result };
    } catch (error) {
        console.error('Add to cart error:', error);
        return { error: { message: 'Internal server error' } };
    }
}

export async function updateCartItem(itemId: number, qty: number) {
    const sessionKey = cookies().get('session_key')?.value;

    if (!sessionKey) {
        return { error: { message: 'Session key not found' } };
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_key: sessionKey,
                qty
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result };
        }

        return { success: true, data: result };
    } catch (error) {
        console.error('Update cart item error:', error);
        return { error: { message: 'Internal server error' } };
    }
}

export async function removeCartItem(itemId: number) {
    const sessionKey = cookies().get('session_key')?.value;

    if (!sessionKey) {
        throw new Error('Session key not found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            session_key: sessionKey
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove cart item');
    }

    return response.json();
}

export async function getCart() {
    const sessionKey = cookies().get('session_key')?.value;

    if (!sessionKey) {
        return null;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart?session_key=${sessionKey}`, {
        cache: 'no-store'
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
}