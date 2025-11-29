<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Booking;
use App\Models\Payment;
use App\Enums\PaymentStatus; // Add this line

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $customer = Customer::where('user_id', $user->id)->first();

        $totalBookings = 0;
        $upcomingBookings = collect(); // Initialize as an empty collection

        if ($customer) {
            $totalBookings = Booking::where('customer_id', $customer->id)->count();
            $upcomingBookings = Booking::where('customer_id', $customer->id)
                ->where('check_in_date', '>', now())
                ->orderBy('check_in_date', 'asc')
                ->get();
        }

        $upcomingStaysCount = $upcomingBookings->count();

        $pendingPayments = (float) Payment::whereHas('booking.customer', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->where('status', PaymentStatus::Pending)
            ->sum('amount');

        $recentActivity = Booking::whereHas('customer', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->with('room.roomType', 'hotel')
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'totalBookings' => $totalBookings,
            'upcomingStaysCount' => $upcomingStaysCount,
            'pendingPayments' => $pendingPayments,
            'upcomingReservations' => $upcomingBookings->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'hotel_name' => $booking->room->hotel->name ?? 'N/A',
                    'room_type_name' => $booking->room->roomType->name ?? 'N/A',
                    'check_in_date' => $booking->check_in_date->format('M d, Y'),
                    'check_out_date' => $booking->check_out_date->format('M d, Y'),
                ];
            }),
            'recentActivity' => $recentActivity->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'description' => 'Booked ' . ($booking->room->roomType->name ?? 'Room') . ' at ' . 'LuxStay Hotel',
                    'date' => $booking->created_at->diffForHumans(),
                ];
            }),
        ]);
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
    public function show(Customer $customer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        //
    }
}
