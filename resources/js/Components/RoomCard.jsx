import React from "react";

const RoomCard = ({ room, roomTypes }) => {
    const displayData = (data, fallback = "N/A") => data || fallback;
    return (
        <div
            key={room.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
            <p className="text-lg font-bold text-gray-800">
                Room {displayData(room.room_number)}
            </p>
            <p className="text-sm text-gray-600">
                {roomTypes.find((rt) => rt.id === room.room_type_id)?.name ||
                    "Unknown Type"}
            </p>
            <span
                className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                    room.status === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                }`}
            >
                {displayData(room.status)}
            </span>
        </div>
    );
};

export default RoomCard;
