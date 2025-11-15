<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Hotel;
use App\Models\RoomType;
use Illuminate\Support\Facades\Hash;

class HotelController extends Controller
{
    public function index()
    {
        
        return Inertia::render('Admin/Hotels/Index', [
                'hotels' => Hotel::paginate(10),
            ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Hotels/Create');
    }

    public function show(Hotel $hotel)
    {
        $hotel->load('roomTypes');

        return Inertia::render('Admin/Hotels/Hotel', [
            'hotel' => $hotel
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
}
