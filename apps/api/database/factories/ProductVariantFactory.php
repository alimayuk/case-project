<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ProductVariant;
use App\Models\Product;

class ProductVariantFactory extends Factory
{
    protected $model = ProductVariant::class;

    public function definition()
    {
        return [
            'product_id' => Product::factory(),
            'variant_name' => $this->faker->randomElement(['S', 'M', 'L', 'XL', 'Red', 'Blue', 'Black']),
            'quantity' => $this->faker->numberBetween(0, 50),
            'price_override' => $this->faker->optional(0.3)->randomFloat(2, 50, 500),
        ];
    }
}
