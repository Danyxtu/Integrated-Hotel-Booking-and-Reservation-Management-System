<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\Booking;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class RoomManagementController extends Controller
{
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

        return Inertia::render('Admin/RoomManagement/AllRooms', [
            'rooms'        => $query->get(),
            'roomTypes'    => RoomType::all(),
            'roomStatuses' => ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
            'filters'      => $filters,
        ]);
    }

    public function showAllRoomTypes(Request $request)
    {
        $roomTypes = RoomType::all();

        if ($request->wantsJson()) {
            return response()->json(['room_types' => $roomTypes]);
        }

        return Inertia::render('Admin/RoomManagement/RoomTypes', [
            'roomTypes' => $roomTypes,
        ]);
    }

    public function showRoomAvailable(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->toDateString());
        $endDate   = $request->input('end_date', Carbon::now()->addDays(7)->toDateString());

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
            'rooms'     => $rooms,
            'bookings'  => $bookings,
            'startDate' => $startDate,
            'endDate'   => $endDate,
        ]);
    }

    public function storeRoom(Request $request)
    {
        $validated = $request->validate([
            'room_number'  => 'required|string|max:255|unique:rooms,room_number',
            'room_type_id' => 'required|exists:room_types,id',
            'status'       => ['required', Rule::in(['Available', 'Occupied', 'Cleaning', 'Maintenance'])],
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

        // ✔ Upload to Supabase
        if ($request->hasFile('image')) {
            // For Update: Delete old image if it exists
            if (isset($roomType) && $roomType->image_path) {
                Storage::disk('supabase')->delete($roomType->image_path);
            }

            // Upload new image properly
            $path = $request->file('image')->store('room_type_images', 'supabase'); // ✅ Correct method
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

        // ✔ Replace image in Supabase
        if ($request->hasFile('image')) {

            // Delete the old file
            if ($roomType->image_path) {
                Storage::disk('supabase')->delete($roomType->image_path);
            }

            $file = $request->file('image');
            $path = Storage::disk('supabase')->put('room_type_images', $file);

            $validated['image_path'] = $path;
        }

        $roomType->update($validated);

        return back()->with('success', 'Room Type updated successfully.');
    }

    public function show(Room $room)
    {
        $room->load(['roomType', 'currentBooking.customer']);

        return Inertia::render('Admin/RoomManagement/RoomDetailsModal', [
            'room' => $room,
        ]);
    }

    public function destroyRoomType(Request $request, RoomType $roomType)
    {
        $request->validate([
            'password' => ['required'],
        ]);

        $currentUser = Auth::user();

        if (!$currentUser || !Hash::check($request->password, $currentUser->password)) {
            return back()->withErrors(['password' => 'Incorrect password.']);
        }

        // Prevent delete when bookings exist
        $hasBookings = Booking::whereHas(
            'room',
            fn($q) =>
            $q->where('room_type_id', $roomType->id)
        )->exists();

        if ($hasBookings) {
            return back()->with('error', 'Cannot delete this room type because it has active bookings.');
        }

        // ✔ Delete image from Supabase
        if ($roomType->image_path) {
            Storage::disk('supabase')->delete($roomType->image_path);
        }

        $roomType->delete();

        return back()->with('success', 'Room Type deleted successfully.');
    }
}
