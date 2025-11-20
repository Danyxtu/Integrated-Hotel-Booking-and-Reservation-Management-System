<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Room;
use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    protected static $counter = 10000;

    public function definition(): array
    {
        $checkIn = $this->faker->dateTimeBetween('now', '+1 month');
        $checkOut = (clone $checkIn)->modify('+' . rand(1, 14) . ' days');

        return [
            'customer_id'    => Customer::factory(),
            'room_id'        => Room::factory(),
            'check_in_date'  => $checkIn,
            'check_out_date' => $checkOut,
            'total_price'    => $this->faker->numberBetween(100, 5000),
            'booking_source' => $this->faker->randomElement(['online', 'walk_in']),
            'status' => $this->faker->randomElement([
                'Pending',
                'Confirmed',
                'Cancelled',
                'Checked In',
                'Checked Out',
                'No Show',
                'Expired'
            ]),
            'booking_number' => 'BK' . (++self::$counter),
        ];
    }
}

