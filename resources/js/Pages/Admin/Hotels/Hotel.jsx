import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, usePage, Head } from "@inertiajs/react";
import BreadcrumbIcon from "@/Components/BreadCrumbs";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState, useEffect } from "react";
import AddRoomTypeModal from "@/Components/AddRoomTypeModal";
import AddRoomModal from "@/Components/AddRoomModal";
import toast from "react-hot-toast";
import Delete from "../../../Components/Delete";
import {
    Pencil,
    Trash2,
    ClipboardList,
    Hotel as HotelIcon,
    KeyRound,
    MapPin,
    FileText,
    Phone,
    Mail,
    Globe,
    BarChart,
    Plus,
    Users,
    Baby,
    ImageOff,
} from "lucide-react";
import EditHotelModal from "@/Components/EditHotelModal";
import RoomTypeCard from "@/Components/RoomTypeCard";
import RoomCard from "@/Components/RoomCard";

export default function Hotel({ hotel, roomTypeLookups, rooms }) {
    // Get flash messages and auth user from props
    const { flash, auth } = usePage().props;

    const [activeTab, setActiveTab] = useState("details");
    const [isRoomTypeModalOpen, setIsRoomTypeModalOpen] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedHotel(hotel);
                                    setOpenEdit(true);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                                <Pencil className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedHotel(hotel);
                                    setOpenDelete(true);
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
                                    <span className="flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5" />
                                        Details
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("rooms")}
                                    className={`px-6 py-3 text-sm font-semibold transition-all ${
                                        activeTab === "rooms"
                                            ? "border-b-2 border-blue-600 text-blue-600 bg-white"
                                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <HotelIcon className="w-5 h-5" />
                                        Room Types
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("all_rooms")}
                                    className={`px-6 py-3 text-sm font-semibold transition-all ${
                                        activeTab === "all_rooms"
                                            ? "border-b-2 border-green-600 text-green-600 bg-white"
                                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <KeyRound className="w-5 h-5" />
                                        All Rooms ({rooms.length})
                                    </span>
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
                                                            <MapPin className="w-4 h-4" />
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
                                                    <ImageOff className="w-20 h-20 mb-3 text-gray-400" />
                                                    <p className="text-lg font-medium">
                                                        No Image Available
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description Card */}
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500 shadow-md">
                                            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                About This Hotel
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
                                                <Phone className="w-5 h-5" />
                                                Contact Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Email */}
                                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Mail className="w-5 h-5 text-blue-600" />
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
                                                        <Phone className="w-5 h-5 text-green-600" />
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
                                                        <Globe className="w-5 h-5 text-purple-600" />
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
                                                        <MapPin className="w-5 h-5 text-red-600" />
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
                                                <BarChart className="w-5 h-5" />
                                                Quick Stats
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                                                    <HotelIcon className="w-8 h-8 text-amber-600" />
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
                                                    <KeyRound className="w-4 h-4" />
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
                                                    <Plus className="w-4 h-4" />
                                                    <span>Add Room Type</span>
                                                </span>
                                            </PrimaryButton>
                                        </div>

                                        {/* Room Types */}
                                        {roomTypes.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {roomTypes.map((room) => (
                                                    <RoomTypeCard
                                                        key={room.id}
                                                        roomTypes={room}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                                <HotelIcon className="w-20 h-20 text-gray-300 mb-4" />
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

                                {/* --- ALL ROOMS --- */}
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
                                                    <KeyRound className="w-4 h-4" />
                                                    <span>Add New Room</span>
                                                </span>
                                            </PrimaryButton>
                                        </div>

                                        {/* Room List */}
                                        {rooms.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {rooms.map((room) => (
                                                    <RoomCard
                                                        key={room.id}
                                                        room={room}
                                                        roomTypes={roomTypes}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                                <KeyRound className="w-20 h-20 text-gray-300 mb-4" />
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

            {/* Room Type Crud Modals */}
            {/* Add */}
            {isRoomTypeModalOpen && (
                <AddRoomTypeModal
                    hotelId={hotel.id}
                    lookups={roomTypeLookups}
                    onClose={closeRoomTypeModal}
                    onSuccess={() => console.log("Room type added.")}
                />
            )}
            {/* Delete */}
            {openDelete && (
                <Delete
                    open={openDelete}
                    setOpen={setOpenDelete}
                    resource={selectedHotel}
                    getDeleteRoute={(hotel) =>
                        route("admin.hotels.destroy", hotel.id)
                    }
                    successMessage="Hotel Deleted Successfully"
                />
            )}
            {/* Edit */}
            {openEdit && (
                <EditHotelModal
                    open={open}
                    setOpenEdit={setOpenEdit}
                    selectedHotel={selectedHotel}
                />
            )}

            {/* New Room Crud Modal */}
            {isRoomModalOpen && (
                <AddRoomModal hotel={hotel} onClose={closeRoomModal} />
            )}
        </>
    );
}
