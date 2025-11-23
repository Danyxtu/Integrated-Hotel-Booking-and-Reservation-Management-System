<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RoomManagementController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\RoomController;
use App\Models\RoomType; // Import RoomType model
use Illuminate\Http\Request; // Import Request

Route::get('/', function (Request $request) { // Add Request $request
    $roomTypes = RoomType::all(); // Fetch all room types

    $rooms = $roomTypes->map(function ($roomType) {
        return [
            'id' => $roomType->id,
            'name' => $roomType->name,
            'price' => $roomType->price,
            'image_path' => $roomType->image_path ?? 'https://via.placeholder.com/600x400', // Default image if none
            'features' => explode(',', $roomType->amenities), // Assuming amenities are comma-separated
            'rating' => 4.5, // Placeholder rating as it's not in the database
        ];
    })->toArray();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'rooms' => $rooms, // Pass the transformed rooms data
        'searchParams' => $request->query(), // Pass query parameters as searchParams
    ]);
});

// Public Booking and Room Search
Route::get('/search-rooms', [BookingController::class, 'search'])->name('rooms.search');
Route::post('/book-room', [BookingController::class, 'storePublic'])->name('bookings.public.store');


// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware(['auth','role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (){
        Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');

        // Reservations
        Route::get('/reservations/all-bookings', [ReservationController::class, 'showAllBookings'])->name('reservations.all-bookings');
        Route::get('/reservations/all-bookings/{booking}',[ReservationController::class, 'show'])->name('reservations.show-booking');
        Route::get('/reservations/check-ins', [ReservationController::class, 'showCheckInsToday'])->name('reservations.check-ins');
        Route::get('/reservations/check-outs', [ReservationController::class, 'showCheckoutsToday'])->name('reservations.check-outs');
        Route::get('/reservations/pendings', [ReservationController::class, 'showPending'])->name('reservations.pending');

        // Room Management
        Route::get('/rooms/all', [RoomManagementController::class, 'showAllRooms'])->name('rooms.all');
        Route::get('/rooms/room-types', [RoomManagementController::class, 'showAllRoomTypes'])->name('room_types.index');
        Route::get('/rooms/availability', [RoomManagementController::class, 'showRoomAvailable'])->name('rooms.availability');
        Route::post('/rooms/store', [RoomManagementController::class, 'storeRoom'])->name('rooms.store'); // Added route for storing new rooms
        Route::post('/room-types/store', [RoomManagementController::class, 'storeRoomType'])->name('room_types.store'); // Added route for storing new room types
        Route::put('/room-types/{roomType}', [RoomManagementController::class, 'updateRoomType'])->name('room_types.update');
        Route::delete('/room-types/{roomType}', [RoomManagementController::class, 'destroyRoomType'])->name('room_types.destroy');

        // Payments
        Route::get('/payments/all',[PaymentController::class, 'showAllPayments'])->name('payments.all');
        Route::get('/payments/pending',[PaymentController::class, 'showAllPendingPayments'])->name('payments.pending');
        Route::get('/payments/refunds',[PaymentController::class, 'showAllRefunds'])->name('payments.refunds');
        Route::patch('/payments/{payment}/update-status', [PaymentController::class, 'updateStatus'])->name('payments.updateStatus');
        Route::patch('/payments/{payment}/refund', [PaymentController::class, 'refundPayment'])->name('payments.refund');

        // Guests & Users
        Route::get('/users/customers', [UserController::class, 'showAllCustomers'])->name('users.customers'); // Renamed route
        Route::get('/users/admins', [UserController::class, 'showAllAdmins'])->name('users.admins'); // New route
        Route::post('/users/admins/store', [UserController::class, 'storeAdmin'])->name('users.storeAdmin'); // New route
        Route::delete('/users/{user}', [UserController::class, 'deleteUser'])->name('users.delete'); // New route for deleting user
        Route::get('/users/roles', [UserController::class, 'showAllRoles'])->name('users.roles');
        
        // Settings
        Route::get('/settings/general', [SettingsController::class, 'showGeneralSettings'])->name('settings.general');
        Route::put('/settings/general', [SettingsController::class, 'updateGeneralSettings'])->name('settings.updateGeneral'); // New route
        Route::get('/settings/pricing-and-rates', [SettingsController::class, 'showPricingAndRates'])->name('settings.pricing');
        Route::put('/settings/pricing-and-rates', [SettingsController::class, 'updatePricingAndRates'])->name('settings.updatePricingAndRates'); // New route
        Route::get('/settings/email-templates', [SettingsController::class, 'showEmailTemplates'])->name('settings.emails');
        Route::put('/settings/email-templates', [SettingsController::class, 'updateEmailTemplates'])->name('settings.updateEmailTemplates'); // New route
        Route::get('/settings/integrations', [SettingsController::class, 'showIntegrations'])->name('settings.integrations');

        Route::post('/bookings/store', [BookingController::class, 'store'])->name('bookings.store');
        Route::get('/bookings/walk-in', [AdminController::class, 'walkin'])->name('bookings.walkin');
        Route::post('/bookings/walk-in', [BookingController::class, 'walkIn'])->name('bookings.walkin.check');
        Route::put('/bookings/{booking}/update-status', [ReservationController::class, 'updateStatus'])->name('bookings.updateStatus');
});




Route::middleware(['auth','role:user'])
    ->prefix('customer')
    ->name('customer.')
    ->group(function (){
        Route::get('/dashboard', function () {
            return Inertia::render('Customer/Dashboard');
        })->name('dashboard');
        Route::get('/reservations', function () {
            return Inertia::render('Customer/Reservations');
        })->name('reservations');
        Route::get('/rooms', [RoomController::class, 'index'])->name('rooms');
        Route::post('/rooms/check-availability', [BookingController::class, 'checkAvailability'])->name('rooms.checkAvailability');
        Route::get('/settings', [ProfileController::class, 'customerSettings'])->name('settings');
    });

require __DIR__.'/auth.php';