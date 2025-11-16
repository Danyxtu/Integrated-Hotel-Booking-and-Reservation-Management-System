<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Hotel;
use App\Models\RoomType;
use App\Models\RoomTypeLookup;
use Illuminate\Support\Facades\Hash;
use App\Models\Room;

class HotelController extends Controller
{
    public function index()
    {
        $hotels = Hotel::withCount(['roomTypes', 'rooms']) // counts related room types and rooms
        ->paginate(10);
        
        return Inertia::render('Admin/Hotels/Index', [
                'hotels' => $hotels,
            ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Hotels/Create');
    }

    public function show(Hotel $hotel)
    {
        $hotel->load('roomTypes');
        $lookups = RoomTypeLookup::all();

        $rooms = Room::whereHas('room_type', function ($query) use ($hotel) {
            $query->where('hotel_id', $hotel->id);
        })->get();

        return Inertia::render('Admin/Hotels/Hotel', [
            'hotel' => $hotel,
            'roomTypeLookups' => $lookups,
            'rooms' => $rooms,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'description' => 'nullable|string',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'cover_image_url' => 'nullable|url',
        ]);

        $hotel = Hotel::create($validated,
    []);

        return redirect()
            ->route('admin.hotels.index')
            ->with('success', 'Hotel created successfully.');
    }
    
    public function destroy(Request $request, Hotel $hotel)
    {
        $request->validate([
            'password' => 'required',
        ]);

        if (! Hash::check($request->password, $request->user()->password)) {
            return back()->withErrors([
                'password' => 'Incorrect password.',
            ]);
        }

        $hotel->delete();

        return redirect()
            ->route('admin.hotels.index')
            ->with('success', 'Hotel deleted successfully.');
    }

    public function update(Request $request, Hotel $hotel)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:150',
            'country' => 'required|string|max:150',
            'cover_image_url' => 'nullable|url',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:30',
            'website' => 'nullable|url',
        ]);

        $hotel->update($validated);

        return redirect()
            ->back()
            ->with('success', 'Hotel updated successfully.');
    }

}
