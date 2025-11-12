<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Hotel;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 20; $i++) {
            Hotel::factory()->create([
                'name' => "Hotel {$i}",
                'description' => "This is a mock description for Hotel {$i}. Enjoy a comfortable stay at our property.",
                'address' => "Street " . (100 + $i),
                'city' => ['Manila', 'Cebu', 'Davao', 'Baguio'][$i % 4],
                'country' => 'Philippines',
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
    }
}
