<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Room; // Import the Room model
use Carbon\Carbon; // Import Carbon for date manipulation

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

     public function showAllBookings(){
        $allBookings = Booking::with(['customer', 'room.roomType'])
            ->get()
            ->map(function($booking) {
                // Add a status_label based on the booking status
                $booking->status_label = match($booking->status) {
                    'Pending'     => 'badge-yellow',
                    'Confirmed'   => 'badge-blue',
                    'Cancelled'   => 'badge-red',
                    'Checked In'  => 'badge-green',
                    'Checked Out' => 'badge-gray',
                    'No Show'     => 'badge-orange',
                    'Expired'     => 'badge-dark',
                    default       => 'badge-default',
                };
                return $booking;
            });

        $rooms = Room::with('roomType')->get(); // Fetch rooms with their room types

        return Inertia::render('Admin/Reservations/AllBookings', [
            'bookings'  => $allBookings,
            'rooms'     => $rooms, // Pass rooms to the view
        ]);
    }
    public function showCheckInsToday(){
        $today = Carbon::today()->toDateString();
        $checkInsToday = Booking::with(['customer', 'room.roomType'])
            ->whereDate('check_in_date', $today)
            ->get()
            ->map(function($booking) {
                // Since status is now enum string, status_label can just be status
                $booking->status_label = $booking->status;
                return $booking;
            });

        return Inertia::render('Admin/Reservations/CheckInsToday', [
            'checkInsToday' => $checkInsToday,
        ]);
    }
    public function showCheckoutsToday(){
        $today = Carbon::today()->toDateString();
        $checkouts = Booking::with(['customer', 'room.roomType'])
            ->where(function ($query) use ($today) {
                $query->whereDate('check_out_date', $today)
                      ->orWhere('status', 'Checked Out');
            })
            ->get()
            ->map(function($booking) {
                $booking->status_label = $booking->status;
                return $booking;
            });

        return Inertia::render('Admin/Reservations/CheckOutsToday', [
            'checkouts' => $checkouts,
        ]);
    }
    public function showPending(){
        $pendingBookings = Booking::with(['customer', 'room.roomType'])
            ->whereIn('status', ['Pending', 'Confirmed'])
            ->get()
            ->map(function($booking) {
                $booking->status_label = $booking->status;
                return $booking;
            });

        return Inertia::render('Admin/Reservations/Pending', [
            'pendingBookings' => $pendingBookings,
        ]);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Confirmed,Cancelled,Checked In,Checked Out,No Show,Expired',
        ]);

        $booking->update(['status' => $validated['status']]);

        return back()->with('success', 'Booking status updated successfully.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

