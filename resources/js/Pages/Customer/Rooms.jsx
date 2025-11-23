import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, usePage } from "@inertiajs/react";
import React, { useState, useMemo, useEffect } from "react";
import { differenceInDays } from "date-fns";
import {
    Wifi,
    Wind,
    Bed,
    Users,
    Star,
    X,
    ChevronLeft,
    ChevronRight,
    Filter,
    Search,
} from "lucide-react";
import Modal from "@/Components/Modal";
import axios from "axios";

const Rooms = () => {
    const { rooms, roomTypes } = usePage().props;
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [availableRooms, setAvailableRooms] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        adults: 1,
        children: 0,
        priceRange: [0, 1000],
        selectedRoomTypes: [],
    });

    useEffect(() => {
        if (filters.startDate && filters.endDate) {
            setLoading(true);
            axios
                .post(route("customer.rooms.checkAvailability"), {
                    start_date: filters.startDate,
                    end_date: filters.endDate,
                })
                .then((response) => {
                    setAvailableRooms(response.data.map((room) => room.id));
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching available rooms:", error);
                    setLoading(false);
                });
        } else {
            setAvailableRooms(null);
        }
    }, [filters.startDate, filters.endDate]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoomTypeChange = (typeName) => {
        setFilters((prev) => {
            const selected = prev.selectedRoomTypes;
            if (selected.includes(typeName)) {
                return {
                    ...prev,
                    selectedRoomTypes: selected.filter((t) => t !== typeName),
                };
            }
            return { ...prev, selectedRoomTypes: [...selected, typeName] };
        });
    };

    const filteredRooms = useMemo(() => {
        if (!Array.isArray(rooms)) {
            return [];
        }
        return rooms.filter((room) => {
            if (
                room.price < filters.priceRange[0] ||
                room.price > filters.priceRange[1]
            )
                return false;
            if (
                room.capacity_adults < filters.adults ||
                room.capacity_children < filters.children
            )
                return false;
            if (
                filters.selectedRoomTypes.length > 0 &&
                !filters.selectedRoomTypes.includes(room.room_type?.name)
            )
                return false;
            if (availableRooms !== null && !availableRooms.includes(room.id))
                return false;
            return true;
        });
    }, [rooms, filters, availableRooms]);

    return (
        <CustomerLayout>
            <Head title="Browse Rooms" />

            {/* Hero Section with Search */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Find Your Perfect Room
                </h1>
                <p className="text-blue-100 mb-4">
                    Browse our collection of luxurious accommodations
                </p>
                <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white rounded-lg px-4 py-2 flex items-center">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search rooms..."
                            className="ml-2 flex-1 border-none outline-none text-sm"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden bg-white text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                    >
                        <Filter className="w-5 h-5" />
                        Filters
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Filter Sidebar */}
                <aside
                    className={`${
                        showFilters ? "block" : "hidden lg:block"
                    } w-full lg:w-80`}
                >
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Filters
                            </h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="lg:hidden text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Date Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Check-in & Check-out
                            </label>
                            <div className="space-y-3">
                                <input
                                    type="date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                                <input
                                    type="date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        {/* Guests */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Guests
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-600 mb-1 block">
                                        Adults
                                    </label>
                                    <input
                                        type="number"
                                        name="adults"
                                        min="1"
                                        value={filters.adults}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 mb-1 block">
                                        Children
                                    </label>
                                    <input
                                        type="number"
                                        name="children"
                                        min="0"
                                        value={filters.children}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Price Range
                            </label>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    value={filters.priceRange[1]}
                                    onChange={(e) =>
                                        setFilters((f) => ({
                                            ...f,
                                            priceRange: [
                                                f.priceRange[0],
                                                parseInt(e.target.value),
                                            ],
                                        }))
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        ${filters.priceRange[0]}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700">
                                        ${filters.priceRange[1]}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Room Types */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Room Type
                            </label>
                            <div className="space-y-3">
                                {Array.isArray(roomTypes) &&
                                    roomTypes.map((type) => (
                                        <label
                                            key={type.id}
                                            className="flex items-center cursor-pointer group"
                                        >
                                            <input
                                                id={`type-${type.id}`}
                                                type="checkbox"
                                                onChange={() =>
                                                    handleRoomTypeChange(
                                                        type.name
                                                    )
                                                }
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                                                {type.name}
                                            </span>
                                        </label>
                                    ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <button
                            onClick={() =>
                                setFilters({
                                    startDate: "",
                                    endDate: "",
                                    adults: 1,
                                    children: 0,
                                    priceRange: [0, 1000],
                                    selectedRoomTypes: [],
                                })
                            }
                            className="w-full mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </aside>

                {/* Room List */}
                <main className="flex-1 min-w-0">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            {loading
                                ? "Checking availability..."
                                : `${filteredRooms.length} rooms available`}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map((room) => (
                                    <RoomCard
                                        key={room.id}
                                        room={room}
                                        filters={filters}
                                        onSelectRoom={setSelectedRoom}
                                        isAvailable={
                                            availableRooms === null ||
                                            availableRooms.includes(room.id)
                                        }
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                                    <div className="text-gray-400 mb-4">
                                        <Search className="w-16 h-16 mx-auto" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        No rooms found
                                    </h3>
                                    <p className="text-gray-600">
                                        Try adjusting your filters to see more
                                        results
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {selectedRoom && (
                <RoomDetailModal
                    room={selectedRoom}
                    onClose={() => setSelectedRoom(null)}
                    filters={filters}
                    isAvailable={
                        availableRooms === null ||
                        availableRooms.includes(selectedRoom.id)
                    }
                />
            )}
        </CustomerLayout>
    );
};

const RoomCard = ({ room, filters, onSelectRoom, isAvailable }) => {
    const { startDate, endDate } = filters;
    let totalNights = 0;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start < end) totalNights = differenceInDays(end, start);
    }

    const amenitiesIcons = {
        WiFi: <Wifi className="w-4 h-4" />,
        AC: <Wind className="w-4 h-4" />,
        "King Bed": <Bed className="w-4 h-4" />,
    };

    return (
        <div
            className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-lg ${
                isAvailable ? "cursor-pointer" : "opacity-60"
            }`}
            onClick={() => isAvailable && onSelectRoom(room)}
        >
            <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-72 h-56 md:h-auto flex-shrink-0">
                    <img
                        src={
                            room.image_path ||
                            room.images?.[0] ||
                            "https://via.placeholder.com/300x200"
                        }
                        alt={
                            room.room_type?.name ||
                            room.roomType?.name ||
                            room.name ||
                            "Room"
                        }
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between h-full">
                        {/* Room Info */}
                        <div className="flex-1 mb-4 lg:mb-0 lg:pr-6">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {room.room_type?.name ||
                                        room.roomType?.name ||
                                        room.name ||
                                        "Room"}
                                </h3>
                                {!isAvailable && (
                                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                                        Unavailable
                                    </span>
                                )}
                            </div>

                            {/* Capacity */}
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{room.capacity_adults} Adults</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4 opacity-70" />
                                    <span>
                                        {room.capacity_children} Children
                                    </span>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {room.amenities?.slice(0, 4).map((amenity) => (
                                    <div
                                        key={amenity}
                                        className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full"
                                    >
                                        {amenitiesIcons[amenity] || (
                                            <Star className="w-3 h-3" />
                                        )}
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                                {room.amenities?.length > 4 && (
                                    <div className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                                        +{room.amenities.length - 4} more
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {room.room_type?.description ||
                                    room.roomType?.description ||
                                    room.description ||
                                    ""}
                            </p>
                        </div>

                        {/* Price & Action */}
                        <div className="lg:w-48 flex-shrink-0 flex flex-col items-end justify-between lg:border-l lg:pl-6 lg:h-full">
                            <div className="text-right mb-4 w-full">
                                <div className="flex items-baseline justify-end mb-1">
                                    <span className="text-3xl font-bold text-gray-900">
                                        ${room.price}
                                    </span>
                                    <span className="text-sm text-gray-600 ml-1">
                                        /night
                                    </span>
                                </div>
                                {totalNights > 0 && (
                                    <div className="bg-blue-50 px-3 py-2 rounded-lg mt-2">
                                        <p className="text-xs text-blue-700 mb-0.5">
                                            {totalNights} night
                                            {totalNights > 1 ? "s" : ""}
                                        </p>
                                        <p className="text-lg font-bold text-blue-900">
                                            $
                                            {(room.price * totalNights).toFixed(
                                                2
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                className={`w-full font-semibold py-3 px-6 rounded-lg transition text-sm ${
                                    isAvailable && startDate && endDate
                                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }`}
                                disabled={
                                    !isAvailable || !startDate || !endDate
                                }
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isAvailable) onSelectRoom(room);
                                }}
                            >
                                {startDate && endDate
                                    ? isAvailable
                                        ? "View Details"
                                        : "Unavailable"
                                    : "Select Dates"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RoomDetailModal = ({ room, onClose, filters, isAvailable }) => {
    const { startDate, endDate } = filters;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    let totalNights = 0;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start < end) totalNights = differenceInDays(end, start);
    }

    const images = room.image_path
        ? [room.image_path]
        : room.images && room.images.length > 0
        ? room.images
        : ["https://via.placeholder.com/600x400"];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) => (prev - 1 + images.length) % images.length
        );
    };

    return (
        <Modal show={true} onClose={onClose} maxWidth="5xl">
            <div className="relative max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {room.room_type?.name ||
                            room.roomType?.name ||
                            room.name ||
                            "Room"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Image Carousel */}
                        <div>
                            <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-4">
                                <img
                                    src={images[currentImageIndex]}
                                    alt={`${
                                        room.room_type?.name ||
                                        room.roomType?.name ||
                                        room.name ||
                                        "Room"
                                    } ${currentImageIndex + 1}`}
                                    className="w-full h-96 object-cover"
                                />

                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-700" />
                                        </button>

                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() =>
                                                        setCurrentImageIndex(
                                                            idx
                                                        )
                                                    }
                                                    className={`w-2 h-2 rounded-full transition ${
                                                        idx ===
                                                        currentImageIndex
                                                            ? "bg-white w-6"
                                                            : "bg-white/50"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Grid */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {images.slice(0, 4).map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setCurrentImageIndex(idx)
                                            }
                                            className={`relative rounded-lg overflow-hidden border-2 transition ${
                                                idx === currentImageIndex
                                                    ? "border-blue-600"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-20 object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Room Details */}
                        <div className="flex flex-col">
                            <div className="flex-1">
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    {room.room_type?.description ||
                                        room.description ||
                                        ""}
                                </p>

                                {/* Room Specs */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <h4 className="font-bold text-gray-900 mb-3">
                                        Room Specifications
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">
                                                Max Adults:
                                            </span>
                                            <p className="font-semibold text-gray-900">
                                                {room.capacity_adults}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">
                                                Max Children:
                                            </span>
                                            <p className="font-semibold text-gray-900">
                                                {room.capacity_children}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-900 mb-3">
                                        Amenities
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {room.amenities?.map((amenity) => (
                                            <span
                                                key={amenity}
                                                className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Policies */}
                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-900 mb-3">
                                        Booking Policies
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">
                                                ✓
                                            </span>
                                            <span>
                                                Free cancellation until 24 hours
                                                before check-in
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">
                                                •
                                            </span>
                                            <span>Check-in time: 3:00 PM</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">
                                                •
                                            </span>
                                            <span>
                                                Check-out time: 11:00 AM
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Booking Section */}
                            <div className="border-t pt-6">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
                                    <div className="flex items-baseline justify-between mb-2">
                                        <div>
                                            <span className="text-3xl font-bold text-gray-900">
                                                ${room.price}
                                            </span>
                                            <span className="text-gray-600 ml-2">
                                                per night
                                            </span>
                                        </div>
                                    </div>
                                    {totalNights > 0 && (
                                        <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                                            <span className="text-sm text-gray-700">
                                                Total for {totalNights} night
                                                {totalNights > 1 ? "s" : ""}
                                            </span>
                                            <span className="text-2xl font-bold text-blue-900">
                                                $
                                                {(
                                                    room.price * totalNights
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    className={`w-full font-bold py-4 px-6 rounded-xl transition text-lg ${
                                        isAvailable && startDate && endDate
                                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                    disabled={
                                        !isAvailable || !startDate || !endDate
                                    }
                                >
                                    {startDate && endDate
                                        ? isAvailable
                                            ? "Confirm Booking"
                                            : "Not Available"
                                        : "Select Dates to Book"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Rooms;
