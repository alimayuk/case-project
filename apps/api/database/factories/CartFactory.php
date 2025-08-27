<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CartFactory extends Factory
{
    public function definition()
    {
        return [
            'user_id' => $this->faker->optional()->numberBetween(1, 100),
            'session_key' => Str::random(32),
        ];
    }
}
