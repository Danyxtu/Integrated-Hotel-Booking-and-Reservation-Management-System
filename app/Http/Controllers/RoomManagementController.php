<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Room; // Import the Room model
use App\Models\RoomType; // Import the RoomType model
use App\Models\Booking; // Import the Booking model
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class RoomManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }
    public function showAllRooms(Request $request)
    {
        $filters = $request->only(['status', 'type', 'search']);

        $query = Room::query()->with('roomType');

        if ($request->filled('status') && $request->input('status') !== 'All') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('type') && $request->input('type') !== 'All') {
            $query->whereHas('roomType', function ($q) use ($request) {
                $q->where('name', $request->input('type'));
            });
        }

        if ($request->filled('search')) {
            $query->where('room_number', 'like', '%' . $request->input('search') . '%');
        }

        $rooms = $query->get();

        $roomTypes = RoomType::all();
        $roomStatuses = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];

        return Inertia::render('Admin/RoomManagement/AllRooms', [
            'rooms' => $rooms,
            'roomTypes' => $roomTypes,
            'roomStatuses' => $roomStatuses,
            'filters' => $filters,
        ]);
    }
    public function showAllRoomTypes(Request $request)
    {
        $roomTypes = RoomType::all();
        if ($request->wantsJson()) {
            return response()->json([
                'room_types' => $roomTypes,
            ]);
        }
        return Inertia::render('Admin/RoomManagement/RoomTypes', [
            'roomTypes' => $roomTypes,
        ]);
    }
    public function showRoomAvailable(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->addDays(7)->toDateString());

        $rooms = Room::with('roomType')->get();
        $bookings = Booking::with('room')
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('check_in_date', [$startDate, $endDate])
                    ->orWhereBetween('check_out_date', [$startDate, $endDate])
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('check_in_date', '<', $startDate)
                            ->where('check_out_date', '>', $endDate);
                    });
            })
            ->get();

        return Inertia::render('Admin/RoomManagement/RoomAvailability', [
            'rooms' => $rooms,
            'bookings' => $bookings,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }

    public function storeRoom(Request $request)
    {
        $validated = $request->validate([
            'room_number'  => 'required|string|max:255|unique:rooms,room_number',
            'room_type_id' => 'required|exists:room_types,id',
            'status'       => ['required', 'string', Rule::in(['Available', 'Occupied', 'Cleaning', 'Maintenance'])],
        ]);

        Room::create($validated);

        return back()->with('success', 'Room added successfully.');
    }

    public function storeRoomType(Request $request)
    {
        $validated = $request->validate([
            'name'              => 'required|string|max:255|unique:room_types,name',
            'description'       => 'nullable|string',
            'price'             => 'required|numeric|min:0',
            'capacity_adults'   => 'required|integer|min:1',
            'capacity_children' => 'required|integer|min:0',
            'amenities'         => 'nullable|string',
            'image'             => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('room_type_images');
            $validated['image_path'] = $path;
        }

        RoomType::create($validated);

        return back()->with('success', 'Room Type added successfully.');
    }

    public function updateRoomType(Request $request, RoomType $roomType)
    {
        $validated = $request->validate([
            'name'              => ['required', 'string', 'max:255', Rule::unique('room_types')->ignore($roomType->id)],
            'description'       => 'nullable|string',
            'price'             => 'required|numeric|min:0',
            'capacity_adults'   => 'required|integer|min:1',
            'capacity_children' => 'required|integer|min:0',
            'amenities'         => 'nullable|string',
            'image'             => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($roomType->image_path) {
                Storage::delete($roomType->image_path);
            }
            $path = $request->file('image')->store('room_type_images');
            $validated['image_path'] = $path;
        }

        $roomType->update($validated);

        return back()->with('success', 'Room Type updated successfully.');
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
    public function show(Room $room) // Type-hinting for route model binding
    {
        // Eager load roomType and current_booking (if any) with its customer
        $room->load(['roomType', 'currentBooking.customer']);

        return Inertia::render('Admin/RoomManagement/RoomDetailsModal', [
            'room' => $room,
        ]);
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
    public function destroyRoomType(Request $request, RoomType $roomType)
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        // Verify password and ensure user is authenticated
        $currentUser = Auth::user();
        if (!$currentUser || !Hash::check($request->password, $currentUser->password)) {
            return back()->withErrors(['password' => 'Incorrect password.']);
        }

        // Check for associated bookings
        $hasBookings = Booking::whereHas('room', function ($query) use ($roomType) {
            $query->where('room_type_id', $roomType->id);
        })->exists();

        if ($hasBookings) {
            return back()->with('error', 'Cannot delete this room type because it has active bookings.');
        }

        // Delete image if it exists
        if ($roomType->image_path) {
            Storage::delete($roomType->image_path);
        }

        $roomType->delete();

        return back()->with('success', 'Room Type deleted successfully.');
    }
}
