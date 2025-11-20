<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
         $request->validate([
            'customer_id'    => 'required|exists:customers,id',
            'room_id'        => 'required|exists:rooms,id',
            'check_in_date'  => 'required|date|before_or_equal:check_out_date',
            'check_out_date' => 'required|date|after_or_equal:check_in_date',
            'total_price'    => 'required|numeric|min:0',
            'status'         => 'required|in:pending,confirmed,checked_in,checked_out,cancelled', // match your enum
        ]);

        // Create booking
        $booking = Booking::create($request->all());

        // Optionally, return redirect or Inertia response
        return redirect()->route('admin.dashboard')->with('success', 'Booking created successfully.');

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
