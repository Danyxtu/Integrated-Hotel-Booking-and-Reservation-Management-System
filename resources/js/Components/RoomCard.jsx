import React from "react";
import { differenceInDays } from "date-fns";
import { Wifi, Wind, Bed, Users, Star } from "lucide-react";
import { getImageUrl } from "@/utils/imageUrl";

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
        "Queen Bed": <Bed className="w-4 h-4" />,
    };

    return (
        <div
            className={`relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:z-10 ${
                isAvailable ? "cursor-pointer" : "opacity-60"
            }`}
            onClick={() => isAvailable && onSelectRoom(room)}
        >
            <div className="flex flex-col md:flex-row">
                <div className="md:w-72 md:min-w-[288px] h-56 md:h-auto md:min-h-[280px] flex-shrink-0 relative">
                    <img
                        src={`/storage/${room.image_path || room.images?.[0]}`}
                        alt={
                            room.room_type?.name ||
                            room.roomType?.name ||
                            room.name ||
                            "Room"
                        }
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 p-6 flex flex-col min-h-[280px]">
                    <div className="flex flex-col lg:flex-row gap-6 h-full">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                                    {room.room_type?.name ||
                                        room.roomType?.name ||
                                        room.name ||
                                        "Room"}
                                </h3>
                                {!isAvailable && (
                                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                                        Unavailable
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4 flex-shrink-0" />
                                    <span className="whitespace-nowrap">
                                        {room.capacity_adults} Adults
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4 opacity-70 flex-shrink-0" />
                                    <span className="whitespace-nowrap">
                                        {room.capacity_children} Children
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {room.amenities
                                    ?.slice(0, 4)
                                    .map((amenity, idx) => (
                                        <div
                                            key={idx}
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

                            <p className="text-sm text-gray-600 line-clamp-2">
                                {room.room_type?.description ||
                                    room.roomType?.description ||
                                    room.description ||
                                    ""}
                            </p>
                        </div>

                        <div className="lg:w-52 lg:min-w-[208px] flex-shrink-0 flex flex-col justify-between lg:border-l lg:border-gray-200 lg:pl-6">
                            <div className="mb-4">
                                <div className="flex items-baseline justify-end mb-1">
                                    <span className="text-3xl font-bold text-gray-900">
                                        ₱{room.price}
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
                                            ₱
                                            {(room.price * totalNights).toFixed(
                                                2
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button
                                className={`w-full font-semibold py-3 px-4 rounded-lg transition text-sm ${
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
export default RoomCard;
