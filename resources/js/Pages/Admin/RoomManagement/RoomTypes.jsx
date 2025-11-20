import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { PlusCircle, Edit, Trash2, Users, DollarSign, BedDouble, Wifi, Tv, Wind, Bath } from "lucide-react";

// Mock data for room types
const mockRoomTypes = [
    {
        id: "standard",
        name: "Standard Room",
        description: "Cozy room with all basic amenities, perfect for solo travelers or couples.",
        price: 150.00,
        capacity: 2,
        amenities: ["Wifi", "TV"],
        imageUrl: "https://images.unsplash.com/photo-1596386461350-326ccf8838e8?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: "deluxe",
        name: "Deluxe Suite",
        description: "Spacious suite with enhanced comfort, a sitting area, and premium amenities.",
        price: 250.00,
        capacity: 3,
        amenities: ["Wifi", "TV", "AC", "Minibar"],
        imageUrl: "https://images.unsplash.com/photo-1590490360155-ad303d36b810?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: "suite",
        name: "Executive Suite",
        description: "Luxurious suite with separate living and sleeping areas, ideal for business or extended stays.",
        price: 400.00,
        capacity: 4,
        amenities: ["Wifi", "TV", "AC", "Minibar", "Bath Tub"],
        imageUrl: "https://images.unsplash.com/photo-1563290472-a0832320b9e8?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: "family",
        name: "Family Room",
        description: "Large room designed for families, with multiple beds and extra space.",
        price: 300.00,
        capacity: 5,
        amenities: ["Wifi", "TV", "AC"],
        imageUrl: "https://images.unsplash.com/photo-1596178060671-87803bde0ad4?q=80&w=2070&auto=format&fit=crop",
    },
];

const amenityIcons = {
    Wifi: <Wifi className="w-4 h-4 text-gray-600" title="Wi-Fi" />,
    TV: <Tv className="w-4 h-4 text-gray-600" title="Television" />,
    AC: <Wind className="w-4 h-4 text-gray-600" title="Air Conditioning" />,
    Minibar: <img src="https://api.iconify.design/game-icons/mini-bar.svg?color=%234b5563" className="w-4 h-4" title="Mini-bar" />, // Using Iconify for a specific icon
    "Bath Tub": <Bath className="w-4 h-4 text-gray-600" title="Bath Tub" />,
};


const RoomTypes = () => {
    const [roomTypes, setRoomTypes] = useState(mockRoomTypes);

    const handleEdit = (id) => {
        console.log(`Edit room type: ${id}`);
        // In a real app, this would open a form to edit the room type
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this room type?")) {
            setRoomTypes(prev => prev.filter(type => type.id !== id));
            console.log(`Delete room type: ${id}`);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Room Types</h1>
                        <p className="text-gray-500 mt-1">Manage all available room categories and their details.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
                        <PlusCircle className="w-4 h-4" />
                        Add New Room Type
                    </button>
                </div>

                {/* Room Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {roomTypes.length > 0 ? (
                        roomTypes.map(type => (
                            <div key={type.id} className="bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-hidden flex flex-col">
                                <div className="relative">
                                    <img src={type.imageUrl} alt={type.name} className="h-48 w-full object-cover"/>
                                </div>
                                <div className="p-4 flex-grow flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-800">{type.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1 flex-grow">{type.description}</p>
                                    
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center text-sm text-gray-700">
                                            <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
                                            <span className="font-semibold">${type.price.toFixed(2)}</span> / night
                                        </div>
                                        <div className="flex items-center text-sm text-gray-700">
                                            <Users className="w-4 h-4 text-gray-500 mr-2" />
                                            <span className="font-semibold">{type.capacity}</span> guests
                                        </div>
                                        <div className="flex items-center text-sm text-gray-700">
                                            <BedDouble className="w-4 h-4 text-gray-500 mr-2" />
                                            Amenities:
                                            <div className="ml-2 flex gap-2">
                                                {type.amenities.map(amenity => amenityIcons[amenity] || null)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(type.id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                                            title="Edit Room Type"
                                        >
                                            <Edit className="w-4 h-4"/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(type.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                                            title="Delete Room Type"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="lg:col-span-4 text-center py-10 bg-white rounded-2xl shadow-md border border-gray-200/80">
                            <p className="text-gray-500">No room types found.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default RoomTypes;