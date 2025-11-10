<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HotelController extends Controller
{
    /**
     * Show the form for creating a new hotel.
     */
    public function create()
    {
        return inertia('Admin/Hotels/Create');
    }

    public function store(Request $request)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'description' => 'nullable|string',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'cover_image_url' => 'nullable|url',
            // Add other necessary fields and validation rules
        ]);

        // Create a new hotel record
        $hotel = \App\Models\Hotel::create($validated);

        // Redirect to the hotels index with a success message
        return redirect()->route('admin.hotels.index')->with('success', 'Hotel created successfully.');
    }
}
