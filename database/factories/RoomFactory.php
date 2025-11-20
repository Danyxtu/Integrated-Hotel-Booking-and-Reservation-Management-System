<?php

namespace Database\Factories;

use App\Models\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'room_type_id' => RoomType::factory(),
            'room_number' => $this->faker->unique()->numberBetween(100, 999),
            'price_per_night' => $this->faker->numberBetween(100, 1000),
            'capacity_adults' => $this->faker->numberBetween(1, 4),
            'capacity_children' => $this->faker->numberBetween(0, 2),
            'status' => 'available',
        ];
    }
}
