<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Models\Payment;
use Illuminate\Http\Request;
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
        return Inertia::render('Admin/Payments/Refunds');
    }
    public function showAllReports(){
        //  $monthlyRevenue = Payment::where('status', EnumsPaymentStatus::Completed)
        //     ->whereMonth('created_at', now()->month)
        //     ->sum('amount');

        //  totalRefunds = bookings where status = refunded;
        //  totalTransaction = Booking::count();
        return Inertia::render('Admin/Payments/Reports',[
            // Todo
        ]);
    }

    public function updateStatus(Request $request, Payment $payment)
    {
        $request->validate([
            'status' => ['required', Rule::in(PaymentStatus::getValues())],
        ]);

        $payment->status = $request->status;
        $payment->save();

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

        return back()->with('success', 'Payment refunded successfully.');
    }
}
