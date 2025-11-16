import { Users, Baby, Pencil, Trash2 } from "lucide-react";
import EditRoomTypeModal from "./EditRoomTypeModal";
import DeleteModal from "./Delete";
import { useState } from "react";

const RoomTypeCard = ({ roomTypes }) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const displayData = (data, fallback = "N/A") => data || fallback;
    return (
        <>
            <div className="bg-white border-2 border-gray-100 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-200">
                {/* Header */}
                <div className="border-b-2 border-blue-100 pb-3 mb-4">
                    <h4 className="text-xl font-bold text-gray-800 mb-1">
                        {displayData(roomTypes.name)}
                    </h4>
                    <p className="text-sm text-gray-500 italic">
                        {displayData(
                            roomTypes.description,
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
                        ₱{displayData(roomTypes.price_per_night)}
                    </p>
                </div>

                {/* Capacity Info */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
                        <span className="text-sm font-semibold text-blue-900 flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            Adults
                        </span>
                        <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                            {displayData(roomTypes.capacity_adults)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between bg-purple-50 rounded-lg p-2">
                        <span className="text-sm font-semibold text-purple-900 flex items-center gap-1.5">
                            <Baby className="w-4 h-4" />
                            Children
                        </span>
                        <span className="text-sm font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                            {displayData(roomTypes.capacity_children)}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                        onClick={() => setOpenEdit(true)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        <Pencil className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setSelectedRoomType(roomTypes);
                            setOpenDelete(true);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
            <EditRoomTypeModal
                open={openEdit}
                setOpen={setOpenEdit}
                roomType={roomTypes}
            />
            <DeleteModal
                open={openDelete}
                setOpen={setOpenDelete}
                resource={selectedRoomType}
                getDeleteRoute={(roomType) =>
                    route("admin.room_types.destroy", roomType.id)
                }
                successMessage="Room type deleted successfully."
            />
        </>
    );
};

export default RoomTypeCard;
