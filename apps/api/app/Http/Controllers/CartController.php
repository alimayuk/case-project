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

        $existingItem = CartItem::where('cart_id', $cart->id)
            ->where('product_variant_id', $variant->id)
            ->first();

        if ($existingItem) {
            $newQty = $existingItem->qty + $request->qty;

            if ($newQty > $variant->quantity) {
                return response()->json([
                    'code' => 'INSUFFICIENT_STOCK',
                    'message' => 'Maksimum ' . $variant->quantity . ' adet ekleyebilirsiniz',
                    'max_quantity' => $variant->quantity
                ], 422);
            }

            $existingItem->update(['qty' => $newQty]);
            return new CartResource($cart->fresh());
        }

        if ($request->qty > $variant->quantity) {
            return response()->json([
                'code' => 'INSUFFICIENT_STOCK',
                'message' => 'Maksimum ' . $variant->quantity . ' adet ekleyebilirsiniz',
                'max_quantity' => $variant->quantity
            ], 422);
        }

        $unitPrice = $variant->price_override ?? $variant->product->price;
        $vatRate = $variant->product->vat_rate;

        CartItem::create([
            'cart_id' => $cart->id,
            'product_variant_id' => $variant->id,
            'qty' => $request->qty,
            'unit_price_snapshot' => $unitPrice,
            'vat_rate_snapshot' => $vatRate
        ]);

        return new CartResource($cart->fresh());
    }

    public function updateItem(UpdateCartItemRequest $request, $id)
    {
        $cartItem = CartItem::with('variant')->findOrFail($id);

        if ($request->qty > $cartItem->variant->quantity) {
            return response()->json([
                'code' => 'INSUFFICIENT_STOCK',
                'message' => 'Maksimum ' . $cartItem->variant->quantity . ' adet ekleyebilirsiniz',
                'max_quantity' => $cartItem->variant->quantity
            ], 422);
        }

        $cartItem->update(['qty' => $request->qty]);
        return new CartResource($cartItem->cart->fresh());
    }

    public function removeItem($id)
    {
        $cartItem = CartItem::with('variant')->findOrFail($id);

        $cartItem->variant->increment('quantity', $cartItem->qty);

        $cart = $cartItem->cart;
        $cartItem->delete();

        return new CartResource($cart->fresh());
    }

    public function show(Request $request)
    {
        $sessionKey = $request->query('session_key') ?? $request->input('session_key');

        if (!$sessionKey) {
            return response()->json([
                'code' => 'MISSING_SESSION',
                'message' => 'Session key is required'
            ], 400);
        }

        $cart = Cart::with(['items.variant.product'])
            ->where('session_key', $sessionKey)
            ->first();

        if (!$cart) {
            return response()->json([
                'code' => 'CART_NOT_FOUND',
                'message' => 'Cart not found'
            ], 404);
        }

        return new CartResource($cart);
    }
}
