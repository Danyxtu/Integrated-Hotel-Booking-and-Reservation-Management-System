<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Room;
use App\Models\Payment;
use App\Models\Customer;
use App\Enums\PaymentStatus as EnumsPaymentStatus;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        /**
         * return =>    totalbookings (totalcount)
         *              current occupancy rate (OR = (Number Occupied Rooms / Total Available Rooms) * 100)
         *              Monthly Revenue MR = Total Price of Confirmed Bookings within the month
         *              Pending Checkins = confirmed bookings without checkin yet (paid)
         * Recent Bookings Within The Day after 24 hours reset
         *  
         */
        $totalBookings = Booking::count();

        $occupiedRooms = Booking::where('check_in_date', '<=', now())
            ->where('check_out_date', '>=', now())
            ->count();
        $totalRooms = Room::count();
        $occupancyRate = ($totalRooms > 0) ? ($occupiedRooms / $totalRooms) * 100 : 0;

        $monthlyRevenue = Payment::where('status', EnumsPaymentStatus::Completed)
            ->whereMonth('created_at', now()->month)
            ->sum('amount');
        
        $pendingCheckIns = Booking::where('check_in_date', '=', now()->format('Y-m-d'))
            ->where('status', 'Pending')
            ->count();

        
        $stats = [
            [
                'name' => 'Total Bookings',
                'value' => $totalBookings,
                'trend' => '+12%', // a placeholder for now
                'icon' => 'Calendar',
                'color' => 'blue',
            ],
            [
                'name' => 'Current Occupancy',
                'value' => round($occupancyRate) . '%',
                'trend' => '+8%', // a placeholder for now
                'icon' => 'Hotel',
                'color' => 'purple',
            ],
            [
                'name' => 'Monthly Revenue',
                'value' => '$' . round($monthlyRevenue / 1000) . 'K',
                'trend' => '+23%', // a placeholder for now
                'icon' => 'DollarSign',
                'color' => 'green',
            ],
            [
                'name' => 'Pending Check-ins',
                'value' => $pendingCheckIns,
                'trend' => 'Today', // a placeholder for now
                'icon' => 'CheckCircle',
                'color' => 'orange',
            ],
        ];

        // Recent Bookings
        $recentBookingsRaw = Booking::with('customer', 'room.roomType')
            ->latest()
            ->take(5)
            ->get();
        
        $recentBookings = $recentBookingsRaw->map(function ($booking) {
            return [
                'id' => $booking->id,
                'guest' => $booking->customer->first_name . ' ' . $booking->customer->last_name,
                'details' => $booking->room->roomType->name . ' | ' . Carbon::parse($booking->check_in_date)->diffInDays(Carbon::parse($booking->check_out_date)) . ' nights | $' . $booking->total_price,
                'time' => Carbon::parse($booking->created_at)->diffForHumans(),
            ];
        });

        // Pending Actions
        $pendingPayments = Payment::where('status', EnumsPaymentStatus::Pending)->count();
        $pendingActions = [];
        if ($pendingPayments > 0) {
            $pendingActions[] = [
                'id' => 1,
                'type' => 'Payment',
                'description' => $pendingPayments . ' pending payment(s) to review',
                'time' => 'Urgent',
                'color' => 'bg-red-500',
                'route' => route('admin.payments.pending'),
            ];
        }

        $customers = Customer::all()->map(function ($customer) {
            return [
                'id' => $customer->id,
                'name' => $customer->first_name . ' ' . $customer->last_name,
            ];
        });

        $rooms = Room::with('roomType')->get()->map(function ($room) {
            return [
                'id' => $room->id,
                'name' => $room->roomType->name . ' (' . $room->room_number . ')',
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'pendingActions' => $pendingActions,
            'customers' => $customers,
            'rooms' => $rooms,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *//**
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
