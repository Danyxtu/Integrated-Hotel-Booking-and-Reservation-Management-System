<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\RoomController; // <-- IMPORT NEW CONTROLLER

// Models
use App\Models\Hotel;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Example (if you enable this later)
// Route::get('/search', HotelSearchController::class)->name('search');


/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', [DashboardController::class, 'show'])
        ->name('dashboard');


    /*
    |--------------------------------------------------------------------------
    | Profile Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });


    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->name('admin.')->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Hotels CRUD
        |--------------------------------------------------------------------------
        */

        Route::get('/hotels', [HotelController::class, 'index'])
            ->name('hotels.index');

        Route::get('/hotels/create', [HotelController::class, 'create'])
            ->name('hotels.create');

        Route::post('/hotels', [HotelController::class, 'store'])
            ->name('hotels.store');

        Route::get('/hotels/{hotel}', [HotelController::class, 'show'])
            ->name('hotels.show');

        // Future:
        // Route::get('/hotels/{hotel}/edit', [HotelController::class, 'edit'])->name('hotels.edit');
        // Route::put('/hotels/{hotel}', [HotelController::class, 'update'])->name('hotels.update');
        Route::delete('/hotels/{hotel}', [HotelController::class, 'destroy'])->name('hotels.destroy');


        /*
        |--------------------------------------------------------------------------
        | Room Types (under a hotel)
        |--------------------------------------------------------------------------
        */

        Route::resource('hotels.room_types', RoomTypeController::class)
            ->shallow()
            ->only(['store', 'edit', 'update', 'destroy']);


        /*
        |--------------------------------------------------------------------------
        | Rooms (under a hotel)
        |--------------------------------------------------------------------------
        */

        // <-- ADD THIS ROUTE FOR CREATING A ROOM -->
        Route::post('/hotels/{hotel}/rooms', [RoomController::class, 'store'])
            ->name('hotels.rooms.store');


        /*
        |--------------------------------------------------------------------------
        | (TODO) Admin Bookings
        |--------------------------------------------------------------------------
        */
        // Route::get('/bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
    });

});


// Authentication scaffolding (login/register)
require __DIR__.'/auth.php';