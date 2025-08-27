<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddCartItemRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CartController extends Controller
{
    public function create(Request $request)
    {
        $sessionKey = Str::random(32);

        $cart = Cart::create([
            'session_key' => $sessionKey,
            'user_id' => auth()->check() ? auth()->id() : null
        ]);

        return response()->json([
            'cart_id' => $cart->id,
            'session_key' => $sessionKey
        ], 201);
    }

    public function addItem(AddCartItemRequest $request)
    {
        $cart = Cart::where('session_key', $request->session_key)->firstOrFail();
        $variant = ProductVariant::findOrFail($request->product_variant_id);

        // stok kontrolü
        if ($variant->quantity < $request->qty) {
            return response()->json([
                'code' => 'INSUFFICIENT_STOCK',
                'message' => 'Yetersiz stok',
                'fields' => [
                    'qty' => 'İstenen miktar mevcut stoktan fazla'
                ]
            ], 422);
        }

        // fiyat snapshot'larını al
        $unitPrice = $variant->price_override ?? $variant->product->price;
        $vatRate = $variant->product->vat_rate;

        // sepet öğesini oluştur
        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_variant_id' => $variant->id,
            'qty' => $request->qty,
            'unit_price_snapshot' => $unitPrice,
            'vat_rate_snapshot' => $vatRate
        ]);

        // stok güncelleme
        $variant->decrement('quantity', $request->qty);

        return new CartResource($cart->fresh());
    }

    public function updateItem(UpdateCartItemRequest $request, $id)
    {
        $cartItem = CartItem::with('variant')->findOrFail($id);

        // stok kontrolü (mevcut miktar + yeni miktar)
        $newQty = $request->qty;
        $oldQty = $cartItem->qty;
        $quantityDifference = $newQty - $oldQty;

        if ($cartItem->variant->quantity < $quantityDifference) {
            return response()->json([
                'code' => 'INSUFFICIENT_STOCK',
                'message' => 'Yetersiz stok',
                'fields' => [
                    'qty' => 'İstenen miktar mevcut stoktan fazla'
                ]
            ], 422);
        }


        // stok güncelleme
        if ($quantityDifference > 0) {
            $cartItem->variant->decrement('quantity', $quantityDifference);
        } else {
            $cartItem->variant->increment('quantity', abs($quantityDifference));
        }

        $cartItem->update(['qty' => $newQty]);

        return new CartResource($cartItem->cart->fresh());
    }

    public function removeItem($id)
    {
        $cartItem = CartItem::with('variant')->findOrFail($id);

        // stok geri ekle
        $cartItem->variant->increment('quantity', $cartItem->qty);

        $cart = $cartItem->cart;
        $cartItem->delete();

        return new CartResource($cart->fresh());
    }

    public function show(Request $request)
    {
        $cart = Cart::with(['items.variant.product'])
            ->where('session_key', $request->session_key)
            ->firstOrFail();

        return new CartResource($cart);
    }
}
