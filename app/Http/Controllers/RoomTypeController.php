<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use App\Models\RoomType;
use GrahamCampbell\ResultType\Success;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class RoomTypeController extends Controller
{

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
            'name' => 'required|string',
            'lookup_id' => 'nullable|integer|exists:room_type_lookups,id',
            'description' => 'required|string',
            'price_per_night' => 'required|numeric',
            'capacity_adults' => 'required|integer',
            'capacity_children' => 'required|integer',
        ]);

        RoomType::create([
            ...$validated, 
            'hotel_id' => $hotel->id
        ]);

        return redirect()->back(303)->with('success', 'Room Type created!');
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
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price_per_night' => 'required|numeric',
            'capacity_adults' => 'required|integer',
            'capacity_children' => 'required|integer',
        ]);

        // Find the room type
        $roomType = RoomType::findOrFail($id);

        // Update with validated data
        $roomType->update($validated);

        // Return with success (Inertia-compatible)
        return redirect()
            ->back()
            ->with('success', 'Room type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        if (!Hash::check($request->password, Auth::user()->password)) {
            return response()->json(['password' => 'Incorrect password.'], 422);
        }
        

        // Find the room type
        $roomType = RoomType::findOrFail($id);

        // Delete it
        $roomType->delete();

       return redirect()
            ->back()
            ->with('success', 'Room type deleted successfully.');
        }

}
