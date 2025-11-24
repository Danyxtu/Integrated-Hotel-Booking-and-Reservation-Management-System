<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Mail\PaymentCancelled;
use App\Mail\PaymentConfirmed;
use App\Mail\PaymentRefunded;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function showAllPayments(Request $request){
        $sortBy = $request->get('sort_by', 'created_at'); // Default sort by created_at
        $sortDirection = $request->get('sort_direction', 'desc'); // Default sort direction desc
        $statusFilter = $request->get('status_filter');
        $methodFilter = $request->get('method_filter');
        $searchTerm = $request->get('search');

        // Get all possible PaymentStatus enum values
        $allStatuses = PaymentStatus::getValues();

        $paymentsQuery = Payment::with(['booking.customer']);

        if ($statusFilter && $statusFilter !== 'All') {
            $paymentsQuery->where('status', $statusFilter);
        }

        if ($methodFilter && $methodFilter !== 'All') {
            $paymentsQuery->where('payment_method', $methodFilter);
        }

        if ($searchTerm) {
            $paymentsQuery->where(function ($query) use ($searchTerm) {
                $query->where('id', 'like', '%' . $searchTerm . '%')
                      ->orWhereHas('booking', function ($query) use ($searchTerm) {
                          $query->where('booking_number', 'like', '%' . $searchTerm . '%');
                      })
                      ->orWhereHas('booking.customer', function ($query) use ($searchTerm) {
                          $query->where('first_name', 'like', '%' . $searchTerm . '%')
                                ->orWhere('last_name', 'like', '%' . $searchTerm . '%');
                      });
            });
        }

        $payments = $paymentsQuery->orderBy($sortBy, $sortDirection)->get();

        return Inertia::render('Admin/Payments/AllPayments', [
            'payments' => $payments,
            'statuses' => $allStatuses,
            'sortBy' => $sortBy,
            'sortDirection' => $sortDirection,
            'filters' => [
                'status_filter' => $statusFilter,
                'method_filter' => $methodFilter,
                'search' => $searchTerm,
            ]
        ]);
    }
    public function showAllPendingPayments(){
        $payments = Payment::with('booking.customer')->where('status', PaymentStatus::Pending)->latest()->get();
        return Inertia::render('Admin/Payments/Pending', [
            'payments' => $payments,
            'statuses' => ['Pending', 'Completed', 'Cancelled'], // Hardcoded values as a workaround
        ]);
    }
    public function showAllRefunds(){
        // You might want to fetch and pass refunded payments here in the future
        $payments = Payment::with('booking.customer')->where('status', PaymentStatus::Refunded)->latest()->get();
        return Inertia::render('Admin/Payments/Refunds',[
            'payments' => $payments
        ]);
    }

    public function updateStatus(Request $request, Payment $payment)
    {
        $request->validate([
            'status' => ['required', Rule::in(PaymentStatus::getValues())],
        ]);

        $oldStatus = $payment->status;
        $payment->status = $request->status;
        $payment->save();

        // Load relationships for email
        $payment->loadMissing(['booking.customer', 'booking.room.roomType']);

        // Send email based on status change
        if ($payment->booking && $payment->booking->customer) {
            try {
                if ($request->status === PaymentStatus::Cancelled) {
                    Mail::to($payment->booking->customer->email)->send(new PaymentCancelled($payment));
                } elseif ($request->status === PaymentStatus::Completed) {
                    Mail::to($payment->booking->customer->email)->send(new PaymentConfirmed($payment));
                }
            } catch (\Exception $e) {
                Log::error('Failed to send payment status email: ' . $e->getMessage());
                // Continue execution even if email fails
            }
        }

        return back()->with('success', 'Payment status updated successfully.');
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
    public function show(Payment $payment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        //
    }

    public function refundPayment(Request $request, Payment $payment)
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:255'],
        ]);

        $payment->status = PaymentStatus::Refunded;
        $payment->refund_reason = $request->reason;
        $payment->save();

        // Load relationships for email
        $payment->loadMissing(['booking.customer', 'booking.room.roomType']);

        // Send refund email to customer
        if ($payment->booking && $payment->booking->customer) {
            try {
                Mail::to($payment->booking->customer->email)->send(new PaymentRefunded($payment));
            } catch (\Exception $e) {
                Log::error('Failed to send payment refund email: ' . $e->getMessage());
                // Continue execution even if email fails
            }
        }

        return back()->with('success', 'Payment refunded successfully.');
    }
}
