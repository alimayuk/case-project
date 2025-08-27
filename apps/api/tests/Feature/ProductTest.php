<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;
use App\Models\Product;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush(); 
    }

    public function test_product_list_with_filters_using_db()
    {
        $response = $this->getJson('/api/products?status=1');
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

        // query param ile arama testi
        $response = $this->getJson('/api/products?query=Test&status=1');
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

    public function test_product_list_cache_using_db()
    {
        Cache::flush();
        $response = $this->getJson('/api/products?status=1');

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

    public function test_product_sorting_using_db()
    {
        $response = $this->getJson('/api/products?sort=price');
        $response->assertStatus(200);
        $data = $response->json('data');
        $prices = array_column($data, 'price');
        $sortedPrices = $prices;
        sort($sortedPrices);
        $this->assertEquals($sortedPrices, $prices, "Artan fiyat sıralaması yanlış.");

        $response = $this->getJson('/api/products?sort=-price');
        $response->assertStatus(200);
        $data = $response->json('data');
        $prices = array_column($data, 'price');
        $sortedPrices = $prices;
        rsort($sortedPrices);
        $this->assertEquals($sortedPrices, $prices, "Azalan fiyat sıralaması yanlış.");
    }

    public function test_other_colors_endpoint_using_db()
    {
        $product = Product::has('variants')->first();
        $this->assertNotNull($product, "DB’de variant’ı olan ürün bulunamadı.");

        $response = $this->getJson("/api/products/{$product->id}/variants");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'product_id',
                        'variant_name',
                        'quantity',
                        'price_override',
                        'created_at',
                        'updated_at'
                    ]
                ]
            ]);
    }
}
