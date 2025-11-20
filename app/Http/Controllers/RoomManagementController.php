<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Pest\Mutate\Mutators\Sets\ReturnSet;
use PHPUnit\Framework\MockObject\ReturnValueNotConfiguredException;

class RoomManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }
    public function showAllRooms(){
        return Inertia::render('Admin/RoomManagement/AllRooms');
    }
    public function showAllRoomTypes(){
        return Inertia::render('Admin/RoomManagement/RoomTypes');
    }
    public function showRoomAvailable(){
        return Inertia::render('Admin/RoomManagement/RoomAvailability');
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
