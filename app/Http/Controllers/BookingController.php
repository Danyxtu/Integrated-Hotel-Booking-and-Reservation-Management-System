<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Room;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = $validated['start_date'];
        $endDate = $validated['end_date'];

        // Find rooms that are booked in the given date range
        $bookedRoomIds = Booking::whereIn('status', ['Confirmed', 'Checked In'])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('check_in_date', '<', $endDate)
                      ->where('check_out_date', '>', $startDate);
            })
            ->pluck('room_id');

        // Get all rooms that are not in the booked list
        $availableRooms = Room::whereNotIn('id', $bookedRoomIds)->with('roomType')->get();

        return response()->json($availableRooms);
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
        $validated = $request->validate([
            'room_id'        => 'required|exists:rooms,id',
            'check_in_date'  => 'required|date|before_or_equal:check_out_date',
            'check_out_date' => 'required|date|after_or_equal:check_in_date',
            'total_price'    => 'required|numeric|min:0',
            'status'         => 'required|in:Pending,Confirmed,Cancelled,Checked In,Checked Out,No Show,Expired',
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'phone'          => 'required|string|max:20',
        ]);

        // Generate unique booking number
        $lastBooking = Booking::latest('id')->first();
        $number = $lastBooking ? $lastBooking->id + 1 : 1;
        $bookingNumber = 'BK' . str_pad($number, 5, '0', STR_PAD_LEFT);

        // Create walk-in customer
        $customer = Customer::create([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'phone'      => $validated['phone'],
            'type'       => 'walk_in', // make sure this column exists
            'user_id'    => null,      // walk-ins don't have a user account
        ]);

        // Create booking
        $booking = Booking::create([
            'customer_id'    => $customer->id,
            'room_id'        => $validated['room_id'],
            'check_in_date'  => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'],
            'total_price'    => $validated['total_price'],
            'status'         => $validated['status'], // fixed
            'booking_source' => 'walk_in',
            'booking_number' => $bookingNumber,
        ]);

        return redirect()->route('admin.dashboard')->with('success', 'Booking created successfully.');
    }

    public function walkIn(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'room_type' => 'required|exists:room_types,id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after_or_equal:check_in_date',
        ]);

        $startDate = $validated['check_in_date'];
        $endDate = $validated['check_out_date'];

        // Find rooms that are booked in the given date range
        $bookedRoomIds = Booking::whereIn('status', ['Confirmed', 'Checked In'])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('check_in_date', '<', $endDate)
                    ->where('check_out_date', '>', $startDate);
            })
            ->pluck('room_id');

        // Get all rooms that are not in the booked list and match the room type
        $availableRooms = Room::whereNotIn('id', $bookedRoomIds)
            ->where('room_type_id', $validated['room_type'])
            ->get();

        if ($availableRooms->isEmpty()) {
            return response()->json(['message' => 'No available rooms for the selected criteria.'], 404);
        }

        return response()->json($availableRooms);
    }


    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        //
    }
}
