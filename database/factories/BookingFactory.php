<?php

namespace Database\Factories;

use App\Enums\BookingStatus;
use App\Models\Customer;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = $this->faker->dateTimeBetween('now', '+1 month');
        $checkOut = (clone $checkIn)->modify('+'.rand(1, 14).' days');
        return [
            'customer_id' => Customer::factory(),
            'room_id' => Room::factory(),
            'check_in_date' => $checkIn,
            'check_out_date' => $checkOut,
            'total_price' => $this->faker->numberBetween(100, 5000),
            'status' => $this->faker->randomElement(BookingStatus::getValues()),
        ];
    }
}
