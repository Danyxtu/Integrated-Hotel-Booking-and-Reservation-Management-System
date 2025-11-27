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
use Illuminate\Support\Facades\Http; // Import HTTP Facade
use App\Mail\BookingConfirmation;

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

        $bookedRoomIds = Booking::whereIn('status', ['Confirmed', 'Checked In'])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('check_in_date', '<', $endDate)
                    ->where('check_out_date', '>', $startDate);
            })
            ->pluck('room_id');

        $availableRooms = Room::whereNotIn('id', $bookedRoomIds)->with('roomType')->get();

        return response()->json($availableRooms);
    }

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

        $bookedRoomIds = Booking::whereIn('status', ['Confirmed', 'Checked In'])
            ->where(function ($query) use ($startDate, $endDate) {
                $query->where('check_in_date', '<', $endDate)
                    ->where('check_out_date', '>', $startDate);
            })
            ->pluck('room_id');

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
                'image_path' => $room->roomType->image_url ?? 'https://via.placeholder.com/600x400',
                'features' => explode(',', $room->roomType->amenities),
                'rating' => $room->roomType->rating ?? 4.5,
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
            'email'          => 'required|email|max:255',
            'phone'          => 'required|string|max:20',
        ]);

        $lastBooking = Booking::latest('id')->first();
        $number = $lastBooking ? $lastBooking->id + 1 : 1;
        $bookingNumber = 'BK' . str_pad($number, 5, '0', STR_PAD_LEFT);

        $customer = Customer::create([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'email'      => $validated['email'],
            'phone'      => $validated['phone'],
            'type'       => 'walk_in',
            'user_id'    => null,
        ]);

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

        Payment::create([
            'booking_id'      => $booking->id,
            'amount'          => $validated['total_price'],
            'payment_method'  => 'Unspecified',
            'status'          => PaymentStatus::Pending,
            'transaction_id'  => 'TRX' . strtoupper(uniqid()),
            'payment_date'    => Carbon::now(),
        ]);

        // Load relationships for email
        $booking->loadMissing(['customer', 'room.roomType', 'payment']);

        // Send booking confirmation email with pending payment notification
        if ($customer->email) {
            try {
                Mail::to($customer->email)->send(new BookingConfirmation($booking));
            } catch (\Exception $e) {
                Log::error('Failed to send walk-in booking email: ' . $e->getMessage());
                // Continue execution even if email fails
            }
        }

        return redirect()->route('admin.dashboard')->with('success', 'Booking created successfully.');
    }

    public function storePublic(Request $request)
    {
        // dd($request->all());
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
            'payment_method' => 'nullable|string|in:pay_later,gcash'
        ]);

        return DB::transaction(function () use ($validated, $request) {
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

            $lastBooking = Booking::latest('id')->first();
            $number = $lastBooking ? $lastBooking->id + 1 : 1;
            $bookingNumber = 'BK' . str_pad($number, 5, '0', STR_PAD_LEFT);

            $selectedMethod = $validated['payment_method'] ?? null;

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

            $paymentMethodLabel = match ($selectedMethod) {
                'pay_later' => 'Pay Later',
                'gcash' => 'GCash',
                default => 'Pending Online',
            };

            Payment::create([
                'booking_id' => $booking->id,
                'amount' => $validated['total_price'],
                'payment_method' => $paymentMethodLabel,
                'status' => PaymentStatus::Pending,
                'transaction_id' => 'PENDING',
                'payment_date' => Carbon::now(),
            ]);

            // Handle Pay Later Logic
            if ($selectedMethod === 'pay_later') {
                try {
                    $booking->loadMissing(['customer', 'room.roomType', 'payment']);
                    Mail::to($customer->email)->send(new BookingConfirmation($booking));
                } catch (\Exception $e) {
                    Log::error('Failed to send booking email: ' . $e->getMessage());
                }

                return back()->with('success', 'Reservation received! Please check your email for payment instructions.');
            }
            
            // Redirect to PayMongo Payment for online payments (GCash and others)
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
     * Initiate PayMongo Checkout.
     */
    public function payWithPaymongo(Booking $booking)
    {
        $response = Http::withBasicAuth(config('services.paymongo.secret_key'), '')
            ->post('https://api.paymongo.com/v1/checkout_sessions', [
                'data' => [
                    'attributes' => [
                        'line_items' => [[
                            'name' => 'Reservation: ' . $booking->booking_number,
                            'amount' => (int)($booking->total_price * 100), // Amount in cents
                            'currency' => 'PHP', // PayMongo standard currency
                            'quantity' => 1,
                            'description' => $booking->room->roomType->name . ' (' . $booking->check_in_date->format('M d') . ' - ' . $booking->check_out_date->format('M d') . ')',
                        ]],
                        'payment_method_types' => ['card', 'gcash', 'paymaya', 'grab_pay', 'dob'],
                        'success_url' => route('bookings.payment.success', ['booking' => $booking->id]),
                        'cancel_url' => route('customer.dashboard'),
                        'description' => 'Hotel Reservation ' . $booking->booking_number,
                    ]
                ]
            ]);

        if ($response->successful()) {
            $data = $response->json()['data'];
            $checkoutUrl = $data['attributes']['checkout_url'];
            $checkoutSessionId = $data['id'];

            // Store the Checkout Session ID (cs_...) to verify later
            $booking->payment()->update([
                'transaction_id' => $checkoutSessionId
            ]);

            return Inertia::location($checkoutUrl);
        }

        Log::error('PayMongo Checkout Creation Failed: ' . $response->body());
        return redirect()->back()->with('error', 'Unable to initiate payment. Please try again.');
    }

    /**
     * Handle PayMongo Success Callback.
     */
    public function paymentSuccess(Request $request, Booking $booking)
    {
        $payment = $booking->payment;
        $sessionId = $payment->transaction_id; // Retrieved from our DB

        if (!$sessionId || !str_starts_with($sessionId, 'cs_')) {
            return redirect()->route('customer.dashboard')->with('error', 'Invalid payment session.');
        }

        // Verify with PayMongo API
        $response = Http::withBasicAuth(config('services.paymongo.secret_key'), '')
            ->get('https://api.paymongo.com/v1/checkout_sessions/' . $sessionId);

        if ($response->successful()) {
            $attributes = $response->json()['data']['attributes'];
            $payments = $attributes['payments'] ?? [];

            // Check if there is at least one paid payment
            $isPaid = collect($payments)->contains(function ($p) {
                return $p['attributes']['status'] === 'paid';
            });

            if ($isPaid) {
                $booking->update(['status' => 'Confirmed']);

                // Get the actual payment ID (pay_...)
                $paymentId = $payments[0]['id'] ?? $sessionId;
                $paymentMethod = $payments[0]['attributes']['source']['type'] ?? 'PayMongo';

                $payment->update([
                    'status' => PaymentStatus::Completed,
                    'payment_method' => ucfirst($paymentMethod),
                    'transaction_id' => $paymentId,
                    'payment_date' => Carbon::now(),
                ]);

                try {
                    Mail::to($booking->customer->email)->send(new BookingConfirmation($booking));
                } catch (\Exception $e) {
                    Log::error('Failed to send booking email: ' . $e->getMessage());
                }

                return redirect()->route('customer.dashboard')->with('success', 'Payment successful! Booking confirmed.');
            }
        }

        return redirect()->route('customer.dashboard')->with('error', 'Payment could not be verified. Please contact support.');
    }
}
