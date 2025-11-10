<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- CONTROLLERS ---
// Import the controllers we need
use App\Http\Controllers\DashboardController;
// use App\Http\Controllers\HotelSearchController;
use App\Http\Controllers\HotelController;
use App\Models\Hotel; // You can keep this if other routes need it, but DashboardController handles it now.

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
|
| These are visible to all guests, even if not logged in.
|
*/

// The Welcome/Homepage
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// The public search results route
// Route::get('/search', HotelSearchController::class)->name('search');


/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
|
| These routes require a user to be logged in.
|
*/
Route::middleware(['auth', 'verified'])->group(function () {

    // This is the new "smart" dashboard route.
    // DashboardController will check if user is admin or regular user.
    Route::get('/dashboard', [DashboardController::class, 'show'])->name('dashboard');

    // --- User Profile ---
    // These are for any logged-in user (admin or regular)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // --- (TODO) User-Specific Routes ---
    // Routes for regular users to see their own bookings, etc.
    // Example:
    // Route::get('/my-bookings', [UserBookingController::class, 'index'])->name('user.bookings.index');


    /*
    |--------------------------------------------------------------------------
    | Admin-Only Routes
    |--------------------------------------------------------------------------
    |
    | These routes are protected by the 'is_admin' check in the
    | AuthenticatedLayout and (soon) a dedicated admin middleware.
    |
    */

    // We'll keep your /hotels route, but it should be for admins.
    // Let's prefix it with 'admin' to make it clear.
    Route::prefix('admin')->name('admin.')->group(function () {
        
        // This is your /hotels route, now at /admin/hotels
        Route::get('/hotels', function () {
            return Inertia::render('Admin/Hotels/Index', [
                'hotels' => Hotel::all(),
            ]);
        })->name('hotels.index'); // Full route name is 'admin.hotels.index'

        // (TODO) Add the other admin routes here for CRUD operations
        Route::get('/hotels/create', [HotelController::class, 'create'])->name('hotels.create');
        Route::post('/hotels', [HotelController::class, 'store'])->name('hotels.store');
        // Route::get('/hotels/{hotel}/edit', [HotelController::class, 'edit'])->name('hotels.edit');
        // Route::put('/hotels/{hotel}', [HotelController::class, 'update'])->name('hotels.update');
        // Route::delete('/hotels/{hotel}', [HotelController::class, 'destroy'])->name('hotels.destroy');
        
        // Route::get('/bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
    });
    
});

// Auth routes (Login, Register, etc.)
require __DIR__.'/auth.php';