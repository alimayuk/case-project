'use client';

import { Product, ProductVariant } from '@/types';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { addToCart } from '@/actions/cart-actions';

interface AddToCartButtonProps {
    variant: ProductVariant;
    product: Product;
    onAdd?: () => void;
}

export default function AddToCartButton({ variant, product, onAdd }: AddToCartButtonProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState('');
    const [disabled, setDisabled] = useState(false);

    const handleAddToCart = async () => {
        if (variant.quantity <= 0) {
            setMessage('Stokta yok');
            setTimeout(() => setMessage(''), 2000);
            return;
        }

        setIsAdding(true);
        setMessage('');

        try {
            const result = await addToCart({
                product_variant_id: variant.id,
                qty: 1
            });

            if (result.error) {
                if (result.error.code === 'INSUFFICIENT_STOCK') {
                    setDisabled(true);
                    setMessage(`Maksimum ${result.error.max_quantity} adet ekleyebilirsiniz`);
                } else {
                    setMessage(result.error.message || 'Hata oluştu');
                }
            } else {
                setMessage('Sepete eklendi!');
                onAdd?.();
            }
        } catch (error: any) {
            setMessage(error.message || 'Hata oluştu');
        } finally {
            setIsAdding(false);
            setTimeout(() => setMessage(''), 2000);
        }
    };

    return (
        <div className="flex flex-col items-end relative">
            <button
                onClick={handleAddToCart}
                disabled={isAdding || disabled || variant.quantity <= 0}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                    variant.quantity <= 0 || disabled
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                } text-white disabled:opacity-50`}
            >
                <ShoppingCart size={16} />
                <span>{isAdding ? 'Ekleniyor...' : 'Sepete Ekle'}</span>
            </button>

            {message && (
                <span
                    className={`absolute top-full mt-1 text-sm transition-opacity duration-300 ${
                        message.includes('Hata') || message.includes('Maksimum')
                            ? 'text-red-600'
                            : 'text-green-600'
                    }`}
                >
                    {message}
                </span>
            )}
        </div>
    );
}
