<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\Customer;
use App\Models\Booking; // Added this line
use App\Models\Payment;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
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

        for ($i = 0; $i < 50; $i++) {
            Room::factory()->create([
                'room_type_id' => $roomTypes->random()->id,
            ]);
        }

        $customers = Customer::factory()->count(20)->create();
        $rooms = Room::all();
        $bookingCounter = 10000; // Initialize counter for booking numbers

        for ($i = 0; $i < 50; $i++) {
            $booking =  Booking::factory()->create([
                            'customer_id' => $customers->random()->id,
                            'room_id' => $rooms->random()->id,
                            'booking_source' => 'walk_in', // optional
                            'booking_number' => 'BK' . (++$bookingCounter), // Explicitly generate booking number
                        ]);

            Payment::factory()->create([
                'booking_id' => $booking->id,
                'amount' => $booking->total_price,
            ]);
        }
    }
}
