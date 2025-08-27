<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        Product::factory(10)->create()->each(function ($product) {
            $product->variants()->saveMany(
                \App\Models\ProductVariant::factory(rand(2, 5))->make()
            );
        });
    }
}
