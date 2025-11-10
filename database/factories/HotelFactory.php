<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Hotel>
 */
class HotelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company() . 'Hotel', 
            'address' => fake()->address(),
            'city' => fake()->city(),
            'country' => fake()->country(),
            'description' => fake()->paragraph(3),
            'cover_image_url' => fake()->imageUrl(800, 600, 'travel', true, 'Hotel'),
        ];
    }
}
