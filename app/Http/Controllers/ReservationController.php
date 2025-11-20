<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

     public function showAllBookings(){
        return Inertia::render('Admin/Reservations/AllBookings');
    }
    public function showCheckInsToday(){
        return  Inertia::render('Admin/Reservations/CheckInsToday');
    }
    public function showCheckoutsToday(){
        return Inertia::render('Admin/Reservations/CheckOutsToday');
    }
    public function showPending(){
        return Inertia::render('Admin/Reservations/Pending');
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
