<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Room; // Import the Room model
use App\Models\RoomType; // Import the RoomType model
use Illuminate\Validation\Rule;

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
        $rooms = Room::with('roomType')->get();
        $roomTypes = RoomType::all();
        // Assuming statuses can be derived from existing rooms or a predefined list
        // For now, let's hardcode based on previous mock data for consistency
        $roomStatuses = ['Available', 'Occupied', 'Cleaning', 'Maintenance']; 

        return Inertia::render('Admin/RoomManagement/AllRooms', [
            'rooms' => $rooms,
            'roomTypes' => $roomTypes,
            'roomStatuses' => $roomStatuses, // Pass room statuses for filtering
        ]);
    }
    public function showAllRoomTypes(){
        $roomTypes = RoomType::all();
        return Inertia::render('Admin/RoomManagement/RoomTypes', [
            'roomTypes' => $roomTypes,
        ]);
    }
    public function showRoomAvailable(){
        return Inertia::render('Admin/RoomManagement/RoomAvailability');
    }

    public function storeRoom(Request $request)
    {
        $validated = $request->validate([
            'room_number'       => 'required|string|max:255|unique:rooms,room_number',
            'room_type_id'      => 'required|exists:room_types,id',
            'price_per_night'   => 'required|numeric|min:0',
            'capacity_adults'   => 'required|integer|min:1',
            'capacity_children' => 'nullable|integer|min:0',
            'status'            => ['required', 'string', Rule::in(['Available', 'Occupied', 'Cleaning', 'Maintenance'])],
        ]);

        Room::create($validated);

        return back()->with('success', 'Room added successfully.');
    }

    public function storeRoomType(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:room_types,name',
            'description' => 'nullable|string',
        ]);

        RoomType::create($validated);

        return back()->with('success', 'Room Type added successfully.');
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
