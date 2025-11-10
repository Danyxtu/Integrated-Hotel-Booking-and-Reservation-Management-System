<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Payment;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show the proper dashboard based on user role.
     */
    public function show(Request $request)
    {
        // Check if the authenticated user is an admin
        if ($request->user()->is_admin) {
            // --- User is an ADMIN ---
            // Fetch data for the admin dashboard
            $stats = [
                'totalHotels' => Hotel::count(),
                'totalRooms' => Room::count(),
                'totalBookings' => Booking::count(),
                'totalRevenue' => Payment::where('status', 'succeeded')->sum('amount'), // From outline
            ];

            // Get the 10 most recent bookings, loading all related data
            $recentBookings = Booking::with('user', 'room.roomType.hotel')
                ->latest()
                ->take(10)
                ->get();

            // Render the *new* Admin Dashboard component
            return Inertia::render('Admin/Dashboard', [
                'stats' => $stats,
                'recentBookings' => $recentBookings,
            ]);

        } else {
            // --- User is a REGULAR USER ---
            // Fetch data for the user dashboard
            // (You would add your real query logic here)
            $upcomingBookings = Booking::where('user_id', $request->user()->id)
                ->where('check_in_date', '>=', now())
                ->orderBy('check_in_date', 'asc')
                ->get();
            
            $recentBookings = Booking::where('user_id', $request->user()->id)
                ->where('check_in_date', '<', now())
                ->orderBy('check_in_date', 'desc')
                ->take(5)
                ->get();

            // Render the *User* Dashboard component
            return Inertia::render('User/Dashboard', [
                'upcomingBookings' => $upcomingBookings,
                'recentBookings' => $recentBookings,
            ]);
        }
    }
}