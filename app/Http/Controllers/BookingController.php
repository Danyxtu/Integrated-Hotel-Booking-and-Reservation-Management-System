<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Room;
use App\Models\Payment; // Import the Payment model
use App\Enums\PaymentStatus; // Import the PaymentStatus enum
use Carbon\Carbon; // Import Carbon for payment_date
use Inertia\Inertia; // Import Inertia
use Illuminate\Foundation\Application; // Import Application for version info
use Illuminate\Support\Facades\Route; // Import Route for has()
use Illuminate\Support\Facades\DB; // Import DB for transactions
use Illuminate\Support\Facades\Log; // Import Log for simulating email

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
     * Handle public room search.
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date|after_or_equal:start_date',
            'adults'     => 'nullable|integer|min:1',
            'children'   => 'nullable|integer|min:0',
        ]);

        $startDate = $validated['start_date'] ?? Carbon::now()->toDateString();
        $endDate = $validated['end_date'] ?? Carbon::now()->addDay()->toDateString();
        $adults = $validated['adults'] ?? 1;
        $children = $validated['children'] ?? 0;

        // Find rooms that are booked in the given date range
        $bookedRoomIds = Booking::whereIn('status', ['Confirmed', 'Checked In'])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('check_in_date', '<', $endDate)
                    ->where('check_out_date', '>', $startDate);
            })
            ->pluck('room_id');

        // Get all rooms that are not in the booked list and match capacity
        $availableRooms = Room::whereNotIn('id', $bookedRoomIds)
            ->whereHas('roomType', function ($query) use ($adults, $children) {
                $query->where('capacity_adults', '>=', $adults)
                    ->where('capacity_children', '>=', $children);
            })
            ->with('roomType')
            ->get();

        $rooms = $availableRooms->map(function ($room) {
            return [
                'id' => $room->roomType->id, // Use roomType's ID
                'room_id' => $room->id, // Pass the actual room ID for booking
                'name' => $room->roomType->name,
                'price' => $room->roomType->price,
                'image_path' => $room->roomType->image_path ?? 'https://via.placeholder.com/600x400',
                'features' => explode(',', $room->roomType->amenities),
                'rating' => 4.5, // Placeholder rating
            ];
        })->toArray();

        return Inertia::render('Welcome', [
            'rooms' => $rooms, // Pass the transformed rooms data
            'searchParams'   => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
                'adults'     => $adults,
                'children'   => $children,
            ],
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION, // Re-add laravelVersion
            'phpVersion' => PHP_VERSION, // Re-add phpVersion
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

        // Create a corresponding payment record
        Payment::create([
            'booking_id'      => $booking->id,
            'amount'          => $validated['total_price'],
            'payment_method'  => 'Unspecified', // Default method for admin-created bookings
            'status'          => PaymentStatus::Pending, // Default to pending
            'transaction_id'  => 'TRX' . strtoupper(uniqid()), // Generate a simple unique transaction ID
            'payment_date'    => Carbon::now(),
        ]);

        return redirect()->route('admin.dashboard')->with('success', 'Booking created successfully.');
    }

    /**
     * Handle public room booking storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storePublic(Request $request)
    {
        Log::info('Received public booking request', $request->all());

        $validated = $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'email'          => 'required|email|max:255',
            'phone'          => 'required|string|max:20',
            'room_id'        => 'required|exists:rooms,id',
            'check_in_date'  => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'total_price'    => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // 1. Re-check room availability
            $isRoomAvailable = !Booking::where('room_id', $validated['room_id'])
                ->whereIn('status', ['Confirmed', 'Checked In'])
                ->where(function ($query) use ($validated) {
                    $query->where('check_in_date', '<', $validated['check_out_date'])
                        ->where('check_out_date', '>', $validated['check_in_date']);
                })
                ->exists();

            if (!$isRoomAvailable) {
                return redirect()->back()->withErrors(['room_id' => 'The selected room is not available for the chosen dates.'])->withInput();
            }

            // 2. Find or create customer
            $customer = Customer::firstOrCreate(
                ['email' => $validated['email']],
                [
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'phone' => $validated['phone'],
                    'type' => 'guest', // Mark as guest booking
                    'user_id' => $request->user() ? $request->user()->id : null, // Link to authenticated user if any
                ]
            );

            // 3. Generate unique booking number
            $lastBooking = Booking::latest('id')->first();
            $number = $lastBooking ? $lastBooking->id + 1 : 1;
            $bookingNumber = 'BK' . str_pad($number, 5, '0', STR_PAD_LEFT);

            // 4. Create booking
            $booking = Booking::create([
                'customer_id' => $customer->id,
                'room_id' => $validated['room_id'],
                'check_in_date' => $validated['check_in_date'],
                'check_out_date' => $validated['check_out_date'],
                'total_price' => $validated['total_price'],
                'status' => 'Pending', // Public bookings start as Pending
                'booking_source' => 'online', // use allowed enum value ('online' or 'walk_in')
                'booking_number' => $bookingNumber,
            ]);

            // 5. Create a corresponding payment record (Pending for now)
            Payment::create([
                'booking_id' => $booking->id,
                'amount' => $validated['total_price'],
                'payment_method' => 'Pending Online', // Indicates online booking, pending payment
                'status' => PaymentStatus::Pending,
                'transaction_id' => 'TRX' . strtoupper(uniqid()),
                'payment_date' => Carbon::now(),
            ]);

            // 6. Simulate email sending
            Log::info('Simulating booking confirmation email sent to ' . $customer->email . ' for booking ' . $booking->booking_number);

            return redirect()->route('customer.rooms')->with('success', 'Booking request submitted successfully! A confirmation will be sent to your email.');
        });
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
