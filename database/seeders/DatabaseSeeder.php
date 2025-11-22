<?php

namespace Database\Seeders;

use App\Enums\RoomStatus;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\Customer;
use App\Models\Booking; // Added this line
use App\Models\Payment;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $faker = Faker::create();
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'first_name' => 'Admin',
                'last_name' => 'Test',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );
        User::firstOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'first_name' => 'User',
                'last_name' => 'Test',
                'password' => Hash::make('password'),
                'role' => 'user',
            ]
        );

        $this->call([
            RoomTypeSeeder::class,
        ]);

        $roomTypes = RoomType::all();

        // Create 50 rooms, all 'Available' by default from the factory
        Room::factory()->count(50)->create([
            'room_type_id' => fn() => $roomTypes->random()->id,
        ]);
        
        $customers = Customer::factory()->count(20)->create();
        
        // Get all available rooms and shuffle them
        $availableRooms = Room::where('status', RoomStatus::Available)->get()->shuffle();

        // Create 25 bookings, ensuring each room is booked only once
        $bookingCounter = 10000;
        foreach ($availableRooms->take(25) as $room) {
            $bookingStatus = $faker->randomElement(['Confirmed', 'Checked In']);

            $booking = Booking::factory()->create([
                'customer_id' => $customers->random()->id,
                'room_id' => $room->id,
                'status' => $bookingStatus,
                'booking_number' => 'BK' . (++$bookingCounter),
            ]);

            Payment::factory()->create([
                'booking_id' => $booking->id,
                'amount' => $booking->total_price,
            ]);

            // Update the room's status based on the booking
            if ($bookingStatus === 'Confirmed' || $bookingStatus === 'Checked In') {
                $room->status = RoomStatus::Occupied;
                $room->save();
            }
        }
    }
}
