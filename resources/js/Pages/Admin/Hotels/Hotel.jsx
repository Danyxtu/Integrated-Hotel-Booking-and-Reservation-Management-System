import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import BreadcrumbIcon from "@/Components/BreadCrumbs";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState } from "react";
import AddRoomTypeModal from "@/Components/AddRoomTypeModal";

export default function Hotel({ hotel }) {
    // 'hotel' prop is automatically updated by Inertia on redirect
    const [activeTab, setActiveTab] = useState("details");
    const [isRoomTypeModalOpen, setIsRoomTypeModalOpen] = useState(false);

    // We get roomTypes directly from the 'hotel' prop.
    // When Inertia refreshes, this prop will be new.
    const roomTypes = hotel.room_types || [];

    // Fallback helper
    const displayData = (data, fallback = "N/A") => data || fallback;

    // We don't need the manual 'handleRoomTypeAdded' function anymore.
    // You could use this to show a toast, but remove the alert().
    const handleModalSuccess = () => {
        // You can use a toast notification library here instead
        console.log("Room type added successfully!");
    };

    const closeRoomTypeModal = () => {
        console.log(
            "PARENT (Hotel.jsx): closeRoomTypeModal() called. Setting state to false."
        );
        setIsRoomTypeModalOpen(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    <nav className="flex items-center text-sm font-medium">
                        <Link
                            href={route("admin.hotels.index")}
                            className="text-gray-500 hover:underline"
                        >
                            Hotels
                        </Link>
                        <BreadcrumbIcon />
                        <span className="text-amber-600">Hotel Details</span>
                    </nav>
                    Hotel Details: {displayData(hotel.name)}
                </h2>
            }
        >
            <Head title={`Hotel: ${displayData(hotel.name)}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Tabs */}
                        <div className="border-b border-gray-200 flex">
                            {/* ... tab buttons ... */}
                            <button
                                onClick={() => setActiveTab("details")}
                                className={`px-4 py-2 text-sm font-medium ${
                                    activeTab === "details"
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                Details
                            </button>
                            <button
                                onClick={() => setActiveTab("rooms")}
                                className={`px-4 py-2 text-sm font-medium ${
                                    activeTab === "rooms"
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                Room Types
                            </button>
                        </div>

                        {/* Tab content */}
                        <div className="p-6 text-gray-900">
                            {activeTab === "details" && (
                                // ... your details content ...
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Column 1: Image */}
                                    <div className="md:col-span-1">
                                        {hotel.cover_image_url ? (
                                            <img
                                                src={hotel.cover_image_url}
                                                alt={displayData(hotel.name)}
                                                className="w-full h-auto object-cover rounded-lg shadow-md"
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg shadow-md">
                                                No Image Available
                                            </div>
                                        )}
                                    </div>
                                    {/* Column 2: Details */}
                                    <div className="md:col-span-2 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Description
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {displayData(
                                                    hotel.description,
                                                    "No description provided."
                                                )}
                                            </p>
                                        </div>
                                        <hr />
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Contact & Location
                                            </h3>
                                            <dl className="mt-2 space-y-2 text-sm">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                                                    <dt className="font-medium text-gray-500">
                                                        Email
                                                    </dt>
                                                    <dd className="sm:col-span-2 text-gray-900">
                                                        {displayData(
                                                            hotel.email
                                                        )}
                                                    </dd>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                                                    <dt className="font-medium text-gray-500">
                                                        Phone
                                                    </dt>
                                                    <dd className="sm:col-span-2 text-gray-900">
                                                        {displayData(
                                                            hotel.phone
                                                        )}
                                                    </dd>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                                                    <dt className="font-medium text-gray-500">
                                                        Website
                                                    </dt>
                                                    <dd className="sm:col-span-2 text-blue-600 hover:underline">
                                                        {hotel.website ? (
                                                            <a
                                                                href={
                                                                    hotel.website
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {hotel.website}
                                                            </a>
                                                        ) : (
                                                            "N/A"
                                                        )}
                                                    </dd>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                                                    <dt className="font-medium text-gray-500">
                                                        Address
                                                    </dt>
                                                    <dd className="sm:col-span-2 text-gray-900">
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
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                        <hr />
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Related Data
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {hotel.rooms
                                                    ? `This hotel has ${hotel.rooms.length} rooms.`
                                                    : "Room data not loaded."}
                                            </p>
                                        </div>
                                        <div className="pt-4 border-t border-gray-200">
                                            <PrimaryButton
                                                type="button"
                                                onClick={() =>
                                                    setIsRoomTypeModalOpen(true)
                                                }
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                Add Room
                                            </PrimaryButton>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === "rooms" && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Room Types Offered
                                        </h3>
                                        <PrimaryButton
                                            type="button"
                                            onClick={() =>
                                                setIsRoomTypeModalOpen(true)
                                            }
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            + Add Room Type
                                        </PrimaryButton>
                                    </div>

                                    {/* Modal */}
                                    {isRoomTypeModalOpen && (
                                        <AddRoomTypeModal
                                            hotelId={hotel.id}
                                            onClose={closeRoomTypeModal}
                                            onSuccess={handleModalSuccess} // Changed to non-blocking function
                                        />
                                    )}

                                    {/* Room Types: Read directly from the prop */}
                                    {roomTypes.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {roomTypes.map((room) => (
                                                <div
                                                    key={room.id}
                                                    className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                                                >
                                                    <h4 className="text-md font-semibold text-gray-900">
                                                        {displayData(room.name)}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {displayData(
                                                            room.description
                                                        )}
                                                    </p>
                                                    <p className="mt-2 text-sm text-gray-700">
                                                        <strong>Price:</strong>{" "}
                                                        ₱
                                                        {displayData(
                                                            room.price_per_night
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        <strong>Adults:</strong>{" "}
                                                        {displayData(
                                                            room.capacity_adults
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        <strong>
                                                            Children:
                                                        </strong>{" "}
                                                        {displayData(
                                                            room.capacity_children
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-700 mt-2">
                                                        <strong>
                                                            Hotel ID:
                                                        </strong>{" "}
                                                        {displayData(
                                                            room.hotel_id
                                                        )}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">
                                            No room types available for this
                                            hotel.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
