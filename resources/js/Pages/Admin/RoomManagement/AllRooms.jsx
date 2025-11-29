import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    BedDouble,
    Bath,
    Wifi,
    Tv,
    Wind,
    DollarSign,
    Filter,
    Search,
    PlusCircle,
    Edit,
    MoreVertical,
    ToggleLeft,
    Eye,
} from "lucide-react";
import { router, useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { debounce } from "lodash";
import RoomDetailsModal from "./RoomDetailsModal"; // Import the new modal component

const statusStyles = {
    Available: "bg-green-100 text-green-800",
    Occupied: "bg-red-100 text-red-800",
    Cleaning: "bg-blue-100 text-blue-800",
    Maintenance: "bg-yellow-100 text-yellow-800",
};

// New component for adding rooms
const CreateRoomModal = ({ show, onClose, roomTypes, roomStatuses }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        room_number: "",
        room_type_id: "",
        status: "Available",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.rooms.store"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="xl">
            <form onSubmit={submit} className="p-6 space-y-4">
                <h2 className="text-lg font-medium text-gray-900">
                    Add New Room
                </h2>

                <div>
                    <InputLabel htmlFor="room_number" value="Room Number" />
                    <TextInput
                        id="room_number"
                        type="text"
                        value={data.room_number}
                        onChange={(e) => setData("room_number", e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />
                    {errors.room_number && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.room_number}
                        </p>
                    )}
                </div>

                <div>
                    <InputLabel htmlFor="room_type_id" value="Room Type" />
                    <select
                        id="room_type_id"
                        value={data.room_type_id}
                        onChange={(e) =>
                            setData("room_type_id", e.target.value)
                        }
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        required
                    >
                        <option value="">Select Room Type</option>
                        {roomTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                    {errors.room_type_id && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.room_type_id}
                        </p>
                    )}
                </div>

                <div>
                    <InputLabel htmlFor="status" value="Status" />
                    <select
                        id="status"
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        required
                    >
                        {roomStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                    {errors.status && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.status}
                        </p>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Add Room
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

const AllRooms = ({
    rooms,
    roomTypes,
    roomStatuses,
    filters: initialFilters,
}) => {
    const [filters, setFilters] = useState({
        type: initialFilters.type || "All",
        status: initialFilters.status || "All",
        search: initialFilters.search || "",
    });
    const [isAddRoomModalOpen, setAddRoomModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null); // State for selected room

    const debouncedSearch = useCallback(
        debounce((value) => {
            setFilters((prev) => ({ ...prev, search: value }));
        }, 300),
        []
    );

    useEffect(() => {
        router.get(route("admin.rooms.all"), filters, {
            preserveState: true,
            replace: true,
        });
    }, [filters.type, filters.status, filters.search]);

    const handleFilterChange = (filterName, value) => {
        if (filterName === "search") {
            debouncedSearch(value);
        } else {
            setFilters((prev) => ({ ...prev, [filterName]: value }));
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            All Rooms
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage all rooms in the hotel property.
                        </p>
                    </div>
                    <button
                        onClick={() => setAddRoomModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Add New Room
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-200/80">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                                    Room Type
                                </label>
                                <select
                                    value={filters.type}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "type",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="All">All</option>
                                    {roomTypes.map((type) => (
                                        <option key={type.id} value={type.name}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                                    Room Status
                                </label>
                                <select
                                    value={filters.status}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "status",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="All">All</option>
                                    {roomStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-sm font-semibold text-gray-600 mb-1 block">
                                Search Room
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Enter room number..."
                                    defaultValue={filters.search}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "search",
                                            e.target.value
                                        )
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-hidden flex flex-col"
                        >
                            <div className="relative">
                                {room.room_type?.image_path ? (
                                    <img
                                        src={`/storage/public/${room.room_type.image_path}`}
                                        alt={room.room_type.name}
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                                <span
                                    className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                        statusStyles[room.status]
                                    }`}
                                >
                                    {room.status}
                                </span>
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Room {room.room_number}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {room.room_type?.name}
                                </p>

                                <div className="mt-4 flex-grow">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-gray-700">
                                            Adults
                                        </span>
                                        <span className="text-gray-600">
                                            {room.room_type?.capacity_adults}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="font-semibold text-gray-700">
                                            Children
                                        </span>
                                        <span className="text-gray-600">
                                            {room.room_type
                                                ?.capacity_children || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <p className="text-lg font-bold text-blue-600">
                                        $
                                        {parseFloat(
                                            room.room_type?.price
                                        ).toFixed(2)}
                                        <span className="text-sm font-normal text-gray-500">
                                            /night
                                        </span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                setSelectedRoom(room)
                                            }
                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        {/* <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition"><Edit className="w-4 h-4"/></button>
                                         <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition"><ToggleLeft className="w-4 h-4"/></button>
                                         <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition"><MoreVertical className="w-4 h-4"/></button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {rooms.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-2xl shadow-md border border-gray-200/80">
                        <p className="text-gray-500">
                            No rooms found matching your criteria.
                        </p>
                    </div>
                )}
            </div>
            <CreateRoomModal
                show={isAddRoomModalOpen}
                onClose={() => setAddRoomModalOpen(false)}
                roomTypes={roomTypes}
                roomStatuses={roomStatuses}
            />
            <RoomDetailsModal
                room={selectedRoom}
                show={!!selectedRoom}
                onClose={() => setSelectedRoom(null)}
            />
        </AdminLayout>
    );
};

export default AllRooms;
