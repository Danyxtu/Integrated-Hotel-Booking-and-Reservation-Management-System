<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Hotel;
use App\Models\RoomTypeLookup;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;
    

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $rooms = [
        [
            'name' => 'Standard Room',
            'default_price' => 1500.00,
            'default_description' => 'Comfortable room with basic amenities for a relaxing stay.',
            'default_capacity_adults' => 2,
            'default_capacity_children' => 1,
        ],
        [
            'name' => 'Deluxe Room',
            'default_price' => 2000.00,
            'default_description' => 'Spacious room with premium facilities and scenic views.',
            'default_capacity_adults' => 2,
            'default_capacity_children' => 2,
        ],
        [
            'name' => 'Suite',
            'default_price' => 3500.00,
            'default_description' => 'Luxurious suite with living area, premium bedding, and exclusive amenities.',
            'default_capacity_adults' => 3,
            'default_capacity_children' => 2,
        ],
        [
            'name' => 'Family Room',
            'default_price' => 2500.00,
            'default_description' => 'Large room suitable for families with multiple beds and extra space.',
            'default_capacity_adults' => 4,
            'default_capacity_children' => 3,
        ],
    ];

        for ($i = 1; $i <= 20; $i++) {
            Hotel::factory()->create([
                'name' => "Hotel {$i}",
                'description' => "This is a mock description for Hotel {$i}. Enjoy a comfortable stay at our property.",
                'address' => "Street " . (100 + $i),
                'city' => ['Manila', 'Cebu', 'Davao', 'Baguio'][$i % 4],
                'country' => 'Philippines',
                'email' => 'example@gmail.com',
                'phone' => '+639932146172',
                'website' => 'https://web.facebook.com/Danyxtu018',
                'cover_image_url' => "https://picsum.photos/seed/hotel{$i}/800/600",
            ]);
        }

        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@luxhome.com',
        ]);

        User::factory()->unverified()->create([
            'name' => 'Unverified User',
            'email' => 'user@luxhome.com',
        ]);

        foreach ($rooms as $room){
            RoomTypeLookup::factory()->create($room);
        }
        
    }
}
