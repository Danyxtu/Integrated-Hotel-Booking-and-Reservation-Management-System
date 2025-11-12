import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Hotel({ hotel }) {
    // Helper function for defensive display
    const displayData = (data, fallback = "N/A") => {
        return data || fallback;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Hotel Details: {displayData(hotel.name)}
                </h2>
            }
        >
            <Head title={`Hotel: ${displayData(hotel.name)}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                                {displayData(hotel.email)}
                                            </dd>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                                            <dt className="font-medium text-gray-500">
                                                Phone
                                            </dt>
                                            <dd className="sm:col-span-2 text-gray-900">
                                                {displayData(hotel.phone)}
                                            </dd>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                                            <dt className="font-medium text-gray-500">
                                                Website
                                            </dt>
                                            <dd className="sm:col-span-2 text-blue-600 hover:underline">
                                                {hotel.website ? (
                                                    <a
                                                        href={hotel.website}
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
                                                {displayData(hotel.address)},{" "}
                                                {displayData(hotel.city)},{" "}
                                                {displayData(hotel.country)}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                                <hr />
                                {/* You can add related data here, like rooms or bookings, once loaded */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Related Data
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {/* Example: Check if rooms are loaded */}
                                        {hotel.rooms
                                            ? `This hotel has ${hotel.rooms.length} rooms.`
                                            : "Room data not loaded. See configuration notes."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
