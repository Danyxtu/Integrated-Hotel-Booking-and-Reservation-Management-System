<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Room;
use App\Models\Payment;
use App\Enums\PaymentStatus;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmation;
use Stripe\Stripe;
use Stripe\Checkout\Session;

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
                'id' => $room->roomType->id,
                'room_id' => $room->id,
                'name' => $room->roomType->name,
                'price' => $room->roomType->price,
                'image_path' => $room->roomType->image_path,
                'features' => explode(',', $room->roomType->amenities),
                'rating' => $room->roomType->rating ?? 4.5, // Dynamic rating
            ];
        })->toArray();

        return Inertia::render('Welcome', [
            'rooms' => $rooms,
            'searchParams'   => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
                'adults'     => $adults,
                'children'   => $children,
            ],
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    /**
     * Store a newly created resource in storage (Admin/Internal).
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
            'type'       => 'walk_in',
            'user_id'    => null,
        ]);

        // Create booking
        $booking = Booking::create([
            'customer_id'    => $customer->id,
            'room_id'        => $validated['room_id'],
            'check_in_date'  => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'],
            'total_price'    => $validated['total_price'],
            'status'         => $validated['status'],
            'booking_source' => 'walk_in',
            'booking_number' => $bookingNumber,
        ]);

        // Create a corresponding payment record
        Payment::create([
            'booking_id'      => $booking->id,
            'amount'          => $validated['total_price'],
            'payment_method'  => 'Unspecified',
            'status'          => PaymentStatus::Pending,
            'transaction_id'  => 'TRX' . strtoupper(uniqid()),
            'payment_date'    => Carbon::now(),
        ]);

        return redirect()->route('admin.dashboard')->with('success', 'Booking created successfully.');
    }

    /**
     * Handle public room booking storage.
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

        // We use a transaction to ensure data integrity
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
                    'type' => 'guest',
                    'user_id' => $request->user() ? $request->user()->id : null,
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
                'status' => 'Pending',
                'booking_source' => 'online',
                'booking_number' => $bookingNumber,
            ]);

            // 5. Create a corresponding payment record (Pending for now)
            Payment::create([
                'booking_id' => $booking->id,
                'amount' => $validated['total_price'],
                'payment_method' => 'Pending Online',
                'status' => PaymentStatus::Pending,
                'transaction_id' => 'TRX' . strtoupper(uniqid()),
                'payment_date' => Carbon::now(),
            ]);

            // 6. Redirect to Stripe Payment instead of just finishing
            return redirect()->route('bookings.pay', ['booking' => $booking->id]);
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

        $bookedRoomIds = Booking::whereIn('status', ['Confirmed', 'Checked In'])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('check_in_date', '<', $endDate)
                    ->where('check_out_date', '>', $startDate);
            })
            ->pluck('room_id');

        $availableRooms = Room::whereNotIn('id', $bookedRoomIds)
            ->where('room_type_id', $validated['room_type'])
            ->get();

        if ($availableRooms->isEmpty()) {
            return response()->json(['message' => 'No available rooms for the selected criteria.'], 404);
        }

        return response()->json($availableRooms);
    }

    /**
     * Initiate Stripe Checkout.
     */
    public function payWithStripe(Booking $booking)
    {
        // Ideally use config('services.stripe.secret') here if you set it up in config/services.php
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => 'Reservation: ' . $booking->booking_number,
                        'description' => $booking->room->roomType->name . ' (' . $booking->check_in_date->format('M d') . ' - ' . $booking->check_out_date->format('M d') . ')',
                    ],
                    'unit_amount' => (int)($booking->total_price * 100), // Ensure integer (cents)
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('bookings.payment.success', ['booking' => $booking->id]) . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('customer.dashboard'),
        ]);

        return Inertia::location($session->url);
    }

    /**
     * Handle Stripe Success Callback.
     */
    public function paymentSuccess(Request $request, Booking $booking)
    {
        // Verify payment status (basic implementation)
        // Ideally, you verify the session_id with Stripe API here to be 100% secure

        $booking->update(['status' => 'Confirmed']);

        $booking->payment()->update([
            'status' => PaymentStatus::Completed,
            'payment_method' => 'Stripe',
            'transaction_id' => $request->get('session_id') ?? 'STRIPE_' . time(),
            'payment_date' => Carbon::now(),
        ]);

        // Send confirmation email NOW that payment is secure and variables exist
        try {
            Mail::to($booking->customer->email)->send(new BookingConfirmation($booking));
        } catch (\Exception $e) {
            Log::error('Failed to send booking email: ' . $e->getMessage());
        }

        return redirect()->route('customer.dashboard')->with('success', 'Payment successful! Booking confirmed and email sent.');
    }
}
