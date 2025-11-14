<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use App\Models\RoomType;
use GrahamCampbell\ResultType\Success;
use Inertia\Inertia;

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
            'description' => 'nullable|string',
            'price_per_night' => 'required|numeric',
            'capacity_adults' => 'required|integer',
            'capacity_children' => 'required|integer',
        ]);

        $roomType = RoomType::create([
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
