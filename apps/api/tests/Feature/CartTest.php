<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;
use App\Models\ProductVariant;
use App\Models\Cart;

class CartTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
        $this->seed();
    }

    public function test_add_item_to_cart()
    {
        $variant = ProductVariant::firstOrFail();
        $product = $variant->product;

        $cart = Cart::factory()->create();

        $qty = min(2, $variant->quantity);

        $response = $this->postJson('/api/cart/items', [
            'session_key' => $cart->session_key,
            'product_variant_id' => $variant->id,
            'qty' => $qty
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'session_key',
                    'items',
                    'summary' => [
                        'subtotal_excl_vat',
                        'vat_total',
                        'grand_total'
                    ]
                ]
            ]);

        $expectedGrandTotal = ($variant->price_override ?? $product->price) * $qty * (1 + $product->vat_rate / 100);
        $this->assertEqualsWithDelta($expectedGrandTotal, $response['data']['summary']['grand_total'], 0.01);
    }

    public function test_add_item_exceeds_stock()
    {
        $variant = ProductVariant::firstOrFail();
        $cart = Cart::factory()->create();

        $response = $this->postJson('/api/cart/items', [
            'session_key' => $cart->session_key,
            'product_variant_id' => $variant->id,
            'qty' => $variant->quantity + 5
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'code',
                'message',
                'fields' => ['qty']
            ]);
    }

    public function test_product_search()
    {
        Cache::flush();

        $response = $this->getJson('/api/products?query=T-Shirt&status=1');
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'sku',
                        'name',
                        'price',
                        'vat_rate',
                        'status',
                        'created_at',
                        'updated_at',
                        'variants'
                    ]
                ]
            ]);
    }
}
