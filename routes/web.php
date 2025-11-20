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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');



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
        Route::get('/reservations/check-ins', [ReservationController::class, 'showCheckInsToday'])->name('reservations.check-ins');
        Route::get('/reservations/check-outs', [ReservationController::class, 'showCheckoutsToday'])->name('reservations.check-outs');
        Route::get('/reservations/pendings', [ReservationController::class, 'showPending'])->name('reservations.pending');

        // Room Management
        Route::get('/rooms/all', [RoomManagementController::class, 'showAllRooms'])->name('rooms.all');
        Route::get('/rooms/room-types', [RoomManagementController::class, 'showAllRoomTypes'])->name('room_types.index');
        Route::get('/rooms/availability', [RoomManagementController::class, 'showRoomAvailable'])->name('rooms.availability');

        // Payments
        Route::get('/payments/all',[PaymentController::class, 'showAllPayments'])->name('payments.all');
        Route::get('/payments/pending',[PaymentController::class, 'showAllPendingPayments'])->name('payments.pending');
        Route::get('/payments/refunds',[PaymentController::class, 'showAllRefunds'])->name('payments.refunds');
        Route::get('/payments/reports',[PaymentController::class, 'showAllReports'])->name('payments.reports');

        // Guests & Users
        Route::get('/users/guests', [UserController::class, 'showAllGuests'])->name('users.guests');
        Route::get('/users/staffs', [UserController::class, 'showAllStaff'])->name('users.staff');
        Route::get('/users/roles', [UserController::class, 'showAllRoles'])->name('users.roles');
        
        // Settings
        Route::get('/settings/general', [SettingsController::class, 'showGeneralSettings'])->name('settings.general');
        Route::get('/settings/pricing-and-rates', [SettingsController::class, 'showPricingAndRates'])->name('settings.pricing');
        Route::get('/settings/email-templates', [SettingsController::class, 'showEmailTemplates'])->name('settings.emails');
        Route::get('/settings/integrations', [SettingsController::class, 'showIntegrations'])->name('settings.integrations');

        Route::post('admin/bookings/store', [BookingController::class, 'store'])->name('bookings.store');
});



require __DIR__.'/auth.php';
