<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('room_types')->insert([
            [
                'name' => 'Standard',
                'description' => 'A cozy room perfect for solo travelers or couples.',
                'price' => 150.00,
            ],
            [
                'name' => 'Deluxe',
                'description' => 'A spacious room with a beautiful view.',
                'price' => 250.00,
            ],
            [
                'name' => 'Suite',
                'description' => 'A luxurious suite with a separate living area.',
                'price' => 400.00,
            ],
            [
                'name' => 'Family',
                'description' => 'A large room with multiple beds, ideal for families.',
                'price' => 350.00,
            ]
        ]);
    }
}
