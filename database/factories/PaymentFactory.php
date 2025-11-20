<?php

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'amount' => $this->faker->numberBetween(100, 5000),
            'payment_date' => $this->faker->dateTimeThisMonth(),
            'payment_method' => $this->faker->randomElement(['credit_card', 'paypal', 'cash']),
            'status' => $this->faker->randomElement(PaymentStatus::getValues()),
        ];
    }
}
