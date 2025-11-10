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
        // User::factory(10)->create();

        User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@luxhome.com',
        ]);

        User::factory()->unverified()->create([
            'name' => 'Unverified User',
            'email' => 'user@luxhome.com',
        ]);

        Hotel::factory(20)->create();
    }
}
