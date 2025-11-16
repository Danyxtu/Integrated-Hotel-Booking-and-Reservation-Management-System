<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\Room;
use App\Enums\RoomStatus;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\RoomType;

class RoomController extends Controller
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
    public function store(Request $request, Hotel $hotel)
    {
        $validated = $request->validate([
            'room_type_id' => [
                'required',
                Rule::exists('room_types', 'id')->where(function ($query) use ($hotel) {
                    return $query->where('hotel_id', $hotel->id);
                }),
            ],
            'room_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('rooms')->where(function ($query) use ($hotel) {
                    return $query->where('hotel_id', $hotel->id);
                }),
            ],
        ]);

        Room::create([
            'hotel_id' => $hotel->id,
            'room_type_id' => $validated['room_type_id'],
            'room_number' => $validated['room_number'],
            'status' => RoomStatus::AVAILABLE->value,
        ]);

        return redirect()->back()->with('success', 'Room added successfully!');
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
