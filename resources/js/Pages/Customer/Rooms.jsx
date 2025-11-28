import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, usePage, useForm } from "@inertiajs/react";
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
    Search,
    Calendar,
    User,
    CreditCard,
    Banknote,
    CheckCircle,
} from "lucide-react";
import Modal from "@/Components/Modal";
import axios from "axios";
import RoomCard from "@/Components/RoomCard";
import RoomDetailModal from "@/Components/RoomDetailModal";
import { getImageUrl } from "@/utils/imageUrl";

const Rooms = () => {
    const { rooms } = usePage().props;
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [availableRooms, setAvailableRooms] = useState(null);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        adults: 1,
        children: 0,
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

    const filteredRooms = useMemo(() => {
        if (!Array.isArray(rooms)) {
            return [];
        }
        return rooms.filter((room) => {
            if (
                room.capacity_adults < filters.adults ||
                room.capacity_children < filters.children
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

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 shadow-lg">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Find Your Perfect Room
                    </h1>
                    <p className="text-blue-100">
                        Select your dates to see real-time availability and
                        pricing
                    </p>
                </div>

                {/* Top Bar Controls */}
                <div className="bg-white p-2 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    {/* Start Date */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            name="startDate"
                            placeholder="Check-in"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="pl-10 block w-full border-transparent bg-gray-50 rounded-lg focus:border-blue-500 focus:bg-white focus:ring-0 text-sm"
                        />
                    </div>

                    {/* End Date */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            name="endDate"
                            placeholder="Check-out"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="pl-10 block w-full border-transparent bg-gray-50 rounded-lg focus:border-blue-500 focus:bg-white focus:ring-0 text-sm"
                        />
                    </div>

                    {/* Adults */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            name="adults"
                            value={filters.adults}
                            onChange={handleFilterChange}
                            className="pl-10 block w-full border-transparent bg-gray-50 rounded-lg focus:border-blue-500 focus:bg-white focus:ring-0 text-sm appearance-none"
                        >
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                <option key={num} value={num}>
                                    {num} Adult{num > 1 ? "s" : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Children */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            name="children"
                            value={filters.children}
                            onChange={handleFilterChange}
                            className="pl-10 block w-full border-transparent bg-gray-50 rounded-lg focus:border-blue-500 focus:bg-white focus:ring-0 text-sm appearance-none"
                        >
                            {[0, 1, 2, 3, 4].map((num) => (
                                <option key={num} value={num}>
                                    {num} Child{num !== 1 ? "ren" : ""}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                        Available Rooms
                    </h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {loading
                            ? "Checking..."
                            : `${filteredRooms.length} Options`}
                    </span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500">
                            Checking availability...
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
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
                                    Try adjusting your dates or guest count.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>

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

export default Rooms;
