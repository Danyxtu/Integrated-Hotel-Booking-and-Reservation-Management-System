import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import BreadcrumbIcon from "@/Components/BreadCrumbs";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState, useEffect } from "react";
import AddRoomTypeModal from "@/Components/AddRoomTypeModal";
import AddRoomModal from "@/Components/AddRoomModal";
import toast from "react-hot-toast";
import Delete from "../../../Components/Delete";
import { Pencil, Trash2 } from "lucide-react";

export default function Hotel({ hotel }) {
    // Get flash messages and auth user from props
    const { flash, auth } = usePage().props;

    const [activeTab, setActiveTab] = useState("details");
    const [isRoomTypeModalOpen, setIsRoomTypeModalOpen] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [open, setOpen] = useState(false);

    // Listen for flash messages and show toasts
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const roomTypes = hotel.room_types || [];
    const rooms = hotel.rooms || [];

    const displayData = (data, fallback = "N/A") => data || fallback;

    const closeRoomTypeModal = () => {
        setIsRoomTypeModalOpen(false);
    };

    const closeRoomModal = () => {
        setIsRoomModalOpen(false);
    };

    return (
        <>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="flex items-center justify-between">
                        <div>
                            <nav className="flex items-center text-sm font-medium mb-2">
                                <Link
                                    href={route("admin.hotels.index")}
                                    className="text-gray-500 hover:underline"
                                >
                                    Hotels
                                </Link>
                                <BreadcrumbIcon />
                                <span className="text-amber-600">
                                    Hotel Details
                                </span>
                            </nav>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Hotel Details: {displayData(hotel.name)}
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => console.log("handle edit")}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                                <Pencil className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    console.log("handle delete");
                                    e.stopPropagation();
                                    setSelectedHotel(hotel);
                                    setOpen(true);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                }
            >
                <Head title={`Hotel: ${displayData(hotel.name)}`} />

                {/* --- MODALS --- */}
                {/* Room Type Modal */}
                {isRoomTypeModalOpen && (
                    <AddRoomTypeModal
                        hotelId={hotel.id}
                        onClose={closeRoomTypeModal}
                        onSuccess={() => console.log("Room type added.")}
                    />
                )}

                {/* Add New Room Modal */}
                {isRoomModalOpen && (
                    <AddRoomModal hotel={hotel} onClose={closeRoomModal} />
                )}
                {/* --- END MODALS --- */}

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            {/* Tabs */}
                            <div className="border-b border-gray-200 flex bg-gray-50">
                                <button
                                    onClick={() => setActiveTab("details")}
                                    className={`px-6 py-3 text-sm font-semibold transition-all ${
                                        activeTab === "details"
                                            ? "border-b-2 border-blue-600 text-blue-600 bg-white"
                                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                    }`}
                                >
                                    📋 Details
                                </button>
                                <button
                                    onClick={() => setActiveTab("rooms")}
                                    className={`px-6 py-3 text-sm font-semibold transition-all ${
                                        activeTab === "rooms"
                                            ? "border-b-2 border-blue-600 text-blue-600 bg-white"
                                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                    }`}
                                >
                                    🏨 Room Types
                                </button>
                                <button
                                    onClick={() => setActiveTab("all_rooms")}
                                    className={`px-6 py-3 text-sm font-semibold transition-all ${
                                        activeTab === "all_rooms"
                                            ? "border-b-2 border-green-600 text-green-600 bg-white"
                                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                    }`}
                                >
                                    🔑 All Rooms ({rooms.length})
                                </button>
                            </div>

                            {/* Tab content */}
                            <div className="p-6 text-gray-900">
                                {activeTab === "details" && (
                                    <div className="space-y-6">
                                        {/* Hero Image Section */}
                                        <div className="relative">
                                            {hotel.cover_image_url ? (
                                                <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                                                    <img
                                                        src={
                                                            hotel.cover_image_url
                                                        }
                                                        alt={displayData(
                                                            hotel.name
                                                        )}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                                    <div className="absolute bottom-6 left-6 right-6">
                                                        <h2 className="text-3xl font-bold text-white mb-2">
                                                            {displayData(
                                                                hotel.name
                                                            )}
                                                        </h2>
                                                        <p className="text-white/90 flex items-center gap-2">
                                                            📍{" "}
                                                            {displayData(
                                                                hotel.city
                                                            )}
                                                            ,{" "}
                                                            {displayData(
                                                                hotel.country
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 shadow-lg">
                                                    <svg
                                                        className="w-20 h-20 mb-3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <p className="text-lg font-medium">
                                                        No Image Available
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description Card */}
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500 shadow-md">
                                            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                📝 About This Hotel
                                            </h3>
                                            <p className="text-gray-700 leading-relaxed">
                                                {displayData(
                                                    hotel.description,
                                                    "No description provided."
                                                )}
                                            </p>
                                        </div>

                                        {/* Contact Information Card */}
                                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                📞 Contact Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Email */}
                                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-xl">
                                                            ✉️
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                            Email
                                                        </p>
                                                        <p className="text-sm text-gray-900 break-words">
                                                            {displayData(
                                                                hotel.email
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Phone */}
                                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                        <span className="text-xl">
                                                            📱
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                            Phone
                                                        </p>
                                                        <p className="text-sm text-gray-900">
                                                            {displayData(
                                                                hotel.phone
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Website */}
                                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                        <span className="text-xl">
                                                            🌐
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                            Website
                                                        </p>
                                                        {hotel.website ? (
                                                            <a
                                                                href={
                                                                    hotel.website
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-words"
                                                            >
                                                                {hotel.website}
                                                            </a>
                                                        ) : (
                                                            <p className="text-sm text-gray-400">
                                                                Not available
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Address */}
                                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                        <span className="text-xl">
                                                            📍
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                                            Address
                                                        </p>
                                                        <p className="text-sm text-gray-900">
                                                            {displayData(
                                                                hotel.address
                                                            )}
                                                            ,{" "}
                                                            {displayData(
                                                                hotel.city
                                                            )}
                                                            ,{" "}
                                                            {displayData(
                                                                hotel.country
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Stats Card */}
                                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 shadow-md border-l-4 border-amber-500">
                                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                📊 Quick Stats
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                                                    <span className="text-2xl">
                                                        🏨
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-3xl font-bold text-gray-800">
                                                        {rooms.length}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Total Rooms Available
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="flex justify-end pt-2">
                                            <PrimaryButton
                                                type="button"
                                                onClick={() =>
                                                    setIsRoomModalOpen(true)
                                                }
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span>🔑</span>
                                                    <span>Add New Room</span>
                                                </span>
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "rooms" && (
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">
                                                    Room Types Offered
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Manage your hotel's room
                                                    types and availability
                                                </p>
                                            </div>
                                            <PrimaryButton
                                                type="button"
                                                onClick={() =>
                                                    setIsRoomTypeModalOpen(true)
                                                }
                                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span>➕</span>
                                                    <span>Add Room Type</span>
                                                </span>
                                            </PrimaryButton>
                                        </div>

                                        {/* Room Types */}
                                        {roomTypes.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {roomTypes.map((room) => (
                                                    <div
                                                        key={room.id}
                                                        className="bg-white border-2 border-gray-100 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-200"
                                                    >
                                                        {/* Header */}
                                                        <div className="border-b-2 border-blue-100 pb-3 mb-4">
                                                            <h4 className="text-xl font-bold text-gray-800 mb-1">
                                                                {displayData(
                                                                    room.name
                                                                )}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 italic">
                                                                {displayData(
                                                                    room.description,
                                                                    "No description available"
                                                                )}
                                                            </p>
                                                        </div>

                                                        {/* Price Badge */}
                                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-3 mb-4">
                                                            <p className="text-sm text-gray-600 font-medium">
                                                                Price per Night
                                                            </p>
                                                            <p className="text-2xl font-bold text-green-700">
                                                                ₱
                                                                {displayData(
                                                                    room.price_per_night
                                                                )}
                                                            </p>
                                                        </div>

                                                        {/* Capacity Info */}
                                                        <div className="space-y-2 mb-4">
                                                            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
                                                                <span className="text-sm font-semibold text-blue-900">
                                                                    👥 Adults
                                                                </span>
                                                                <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                                                    {displayData(
                                                                        room.capacity_adults
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
                                                                <span className="text-sm font-semibold text-purple-900">
                                                                    👶 Children
                                                                </span>
                                                                <span className="text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                                                                    {displayData(
                                                                        room.capacity_children
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                                                            <button
                                                                onClick={() =>
                                                                    console.log(
                                                                        "TODO: handle edit"
                                                                    )
                                                                }
                                                                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                                <span>
                                                                    Edit
                                                                </span>
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    console.log(
                                                                        "TODO: handle delete"
                                                                    )
                                                                }
                                                                className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                <span>
                                                                    Delete
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                                <div className="text-6xl mb-4">
                                                    🏨
                                                </div>
                                                <p className="text-gray-500 text-lg font-medium">
                                                    No room types available for
                                                    this hotel
                                                </p>
                                                <p className="text-gray-400 text-sm mt-2">
                                                    Click "Add Room Type" to get
                                                    started
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* --- NEW TAB CONTENT FOR ALL ROOMS --- */}
                                {activeTab === "all_rooms" && (
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">
                                                    All Individual Rooms (
                                                    {rooms.length})
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    View and manage all physical
                                                    rooms in your hotel
                                                </p>
                                            </div>
                                            <PrimaryButton
                                                type="button"
                                                onClick={() =>
                                                    setIsRoomModalOpen(true)
                                                }
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span>🔑</span>
                                                    <span>Add New Room</span>
                                                </span>
                                            </PrimaryButton>
                                        </div>

                                        {/* Room List */}
                                        {rooms.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {rooms.map((room) => (
                                                    <div
                                                        key={room.id}
                                                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                                                    >
                                                        <p className="text-lg font-bold text-gray-800">
                                                            Room{" "}
                                                            {displayData(
                                                                room.room_number
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {roomTypes.find(
                                                                (rt) =>
                                                                    rt.id ===
                                                                    room.room_type_id
                                                            )?.name ||
                                                                "Unknown Type"}
                                                        </p>
                                                        <span
                                                            className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                                                                room.status ===
                                                                "available"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {displayData(
                                                                room.status
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                                <div className="text-6xl mb-4">
                                                    🔑
                                                </div>
                                                <p className="text-gray-500 text-lg font-medium">
                                                    No rooms found
                                                </p>
                                                <p className="text-gray-400 text-sm mt-2">
                                                    Click "Add New Room" to get
                                                    started
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            {/* Modals */}
            {open && (
                <Delete
                    open={open}
                    setOpen={setOpen}
                    selectedHotel={selectedHotel}
                />
            )}
        </>
    );
}
