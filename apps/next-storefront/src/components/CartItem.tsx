'use client';

import { CartItem as CartItemType } from '@/types';
import { updateCartItem, removeCartItem } from '@/actions/cart-actions';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CartItemProps {
    item: CartItemType;
    onUpdate?: () => void;
}

export default function CartItem({ item, onUpdate }: CartItemProps) {
    const [quantity, setQuantity] = useState(item.qty);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');

    const handleQuantityChange = async (newQty: number) => {
        if (newQty < 1) return;

        setIsUpdating(true);
        setError('');

        try {
            const result = await updateCartItem(item.id, newQty);

            if (result.error) {
                if (result.error.code === 'INSUFFICIENT_STOCK') {
                    setError(`Maksimum ${result.error.max_quantity} adet`);
                } else {
                    setError(result.error.message || 'Güncelleme hatası');
                }
            } else {
                setQuantity(newQty);
                onUpdate?.();
            }
        } catch (error) {
            setError('Güncelleme hatası');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemove = async () => {
        setIsUpdating(true);
        try {
            await removeCartItem(item.id);
            onUpdate?.();
        } catch (error) {
            setError('Silme hatası');
        } finally {
            setIsUpdating(false);
        }
    };

    const totalPrice = item.unit_price_snapshot * quantity;
    const vatAmount = totalPrice * (item.vat_rate_snapshot / 100);
    const maxQuantity = item.variant?.quantity || 0;

    return (
        <div className="flex items-center gap-4 p-4 border-b">
            <div className="flex-1">
                <h4 className="font-semibold">Ürün: {item.variant?.product.name}</h4>
                <p className="text-sm text-gray-600">
                    {item.variant?.variant_name} - {item.unit_price_snapshot} ₺
                </p>
                <div className="flex items-center gap-4 mt-2">
                    <span className="text-lg font-bold">{totalPrice.toFixed(2)} ₺</span>
                    <span className="text-sm text-gray-600">KDV: {vatAmount.toFixed(2)} ₺</span>
                </div>
                {error && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                )}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={isUpdating || quantity <= 1}
                    className="p-1 rounded border disabled:opacity-50"
                >
                    <Minus size={16} />
                </button>

                <span className="w-8 text-center font-semibold">{quantity}</span>

                <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={isUpdating || quantity >= maxQuantity}
                    className="p-1 rounded border disabled:opacity-50"
                >
                    <Plus size={16} />
                </button>
            </div>

            <button
                onClick={handleRemove}
                disabled={isUpdating}
                className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                aria-label="Kaldır"
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
}