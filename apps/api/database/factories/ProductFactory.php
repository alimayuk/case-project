<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        return [
            'sku' => $this->faker->unique()->regexify('[A-Z]{6}-[0-9]{3}'),
            'name' => $this->faker->words(2, true),
            'price' => $this->faker->randomFloat(2, 50, 500),
            'vat_rate' => $this->faker->randomElement([0, 1, 8, 10, 18, 20]),
            'status' => $this->faker->boolean(90),
        ];
    }
}
