<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RoomType>
 */
class RoomTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->numberBetween(100, 1000),
            'capacity_adults' => $this->faker->numberBetween(1, 4),
            'capacity_children' => $this->faker->numberBetween(0, 2),
            'amenities' => 'Wi-Fi, TV, Air Conditioning',
        ];
    }
}
