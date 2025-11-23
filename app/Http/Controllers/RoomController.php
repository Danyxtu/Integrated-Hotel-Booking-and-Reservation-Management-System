<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\RoomType;
use App\Models\Booking;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $searchParams = $request->query();

        $startDate = $searchParams['start_date'] ?? null;
        $endDate = $searchParams['end_date'] ?? null;
        $adults = $searchParams['adults'] ?? 1;
        $children = $searchParams['children'] ?? 0;
        $roomTypeId = $searchParams['room_type_id'] ?? null;

        $query = Room::with('roomType');

        if ($startDate && $endDate) {
            $bookedRoomIds = Booking::whereIn('status', ['Confirmed', 'Checked In'])
                ->where(function ($query) use ($startDate, $endDate) {
                    $query->where('check_in_date', '<', $endDate)
                          ->where('check_out_date', '>', $startDate);
                })
                ->pluck('room_id');
            
            $query->whereNotIn('id', $bookedRoomIds);
        }

        if ($adults || $children) {
            $query->whereHas('roomType', function ($subQuery) use ($adults, $children) {
                $subQuery->where('capacity_adults', '>=', $adults)
                         ->where('capacity_children', '>=', $children);
            });
        }

        if ($roomTypeId) {
            $query->where('room_type_id', $roomTypeId);
        }

        $filteredRooms = $query->get();

        $rooms = $filteredRooms->map(function ($room) {
            return [
                'id' => $room->roomType->id,
                'room_id' => $room->id, // Pass the actual room ID for booking
                'name' => $room->roomType->name,
                'description' => $room->roomType->description,
                'price' => $room->roomType->price,
                'image_path' => $room->roomType->image_path ?? 'https://via.placeholder.com/600x400',
                'features' => explode(',', $room->roomType->amenities),
                'rating' => 4.5, // Placeholder rating
                'capacity_adults' => $room->roomType->capacity_adults,
                'capacity_children' => $room->roomType->capacity_children,
            ];
        })->unique('id')->values()->toArray(); // Ensure unique room types and re-index

        $allRoomTypes = RoomType::all()->map(function ($roomType) {
            return [
                'id' => $roomType->id,
                'name' => $roomType->name,
            ];
        })->toArray();

        return Inertia::render('Customer/Rooms', [
            'rooms' => $rooms,
            'roomTypes' => $allRoomTypes, // All room types for the filter dropdown
            'searchParams' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'adults' => $adults,
                'children' => $children,
                'room_type_id' => $roomTypeId,
            ],
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
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
    public function show(Room $room)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Room $room)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        //
    }
}
