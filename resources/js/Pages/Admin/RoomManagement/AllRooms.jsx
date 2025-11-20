import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { BedDouble, Bath, Wifi, Tv, Wind, DollarSign, Filter, Search, PlusCircle, Edit, MoreVertical, ToggleLeft } from "lucide-react";

// Mock data for rooms
const mockRooms = [
    { id: '101', roomType: 'Standard', status: 'Available', bedType: 'Queen', rate: 150, amenities: ['Wifi', 'TV'], imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop' },
    { id: '102', roomType: 'Standard', status: 'Occupied', bedType: 'Queen', rate: 150, amenities: ['Wifi', 'TV'], imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16433d?q=80&w=2070&auto=format&fit=crop' },
    { id: '103', roomType: 'Standard', status: 'Cleaning', bedType: 'Twin', rate: 140, amenities: ['Wifi', 'TV'], imageUrl: 'https://images.unsplash.com/photo-1560185893-a55de8537e49?q=80&w=1974&auto=format&fit=crop' },
    { id: '201', roomType: 'Deluxe', status: 'Available', bedType: 'King', rate: 250, amenities: ['Wifi', 'TV', 'AC'], imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop' },
    { id: '202', roomType: 'Deluxe', status: 'Maintenance', bedType: 'King', rate: 250, amenities: ['Wifi', 'TV', 'AC'], imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop' },
    { id: '301', roomType: 'Suite', status: 'Available', bedType: 'King', rate: 400, amenities: ['Wifi', 'TV', 'AC', 'Bath'], imageUrl: 'https://images.unsplash.com/photo-1568495248636-6412b975d7b3?q=80&w=2070&auto=format&fit=crop' },
    { id: '302', roomType: 'Suite', status: 'Occupied', bedType: 'King', rate: 400, amenities: ['Wifi', 'TV', 'AC', 'Bath'], imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop' },
    { id: '401', roomType: 'Family', status: 'Available', bedType: 'Twin + Queen', rate: 350, amenities: ['Wifi', 'TV', 'AC'], imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop' },
];

const roomTypes = ['All', 'Standard', 'Deluxe', 'Suite', 'Family'];
const roomStatuses = ['All', 'Available', 'Occupied', 'Cleaning', 'Maintenance'];

const statusStyles = {
    Available: "bg-green-100 text-green-800",
    Occupied: "bg-red-100 text-red-800",
    Cleaning: "bg-blue-100 text-blue-800",
    Maintenance: "bg-yellow-100 text-yellow-800",
};

const AllRooms = () => {
    const [filters, setFilters] = useState({ type: 'All', status: 'All' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const filteredRooms = mockRooms.filter(room => {
        const typeMatch = filters.type === 'All' || room.roomType === filters.type;
        const statusMatch = filters.status === 'All' || room.status === filters.status;
        const searchMatch = room.id.toLowerCase().includes(searchTerm.toLowerCase());
        return typeMatch && statusMatch && searchMatch;
    });

    const amenityIcons = {
        Wifi: <Wifi className="w-4 h-4 text-gray-600" />,
        TV: <Tv className="w-4 h-4 text-gray-600" />,
        AC: <Wind className="w-4 h-4 text-gray-600" />,
        Bath: <Bath className="w-4 h-4 text-gray-600" />,
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">All Rooms</h1>
                        <p className="text-gray-500 mt-1">Manage all rooms in the hotel property.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
                        <PlusCircle className="w-4 h-4" />
                        Add New Room
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-200/80">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Room Type</label>
                                <select onChange={(e) => handleFilterChange('type', e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    {roomTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">Room Status</label>
                                <select onChange={(e) => handleFilterChange('status', e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    {roomStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="md:col-span-1">
                             <label className="text-sm font-semibold text-gray-600 mb-1 block">Search Room</label>
                             <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Enter room number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRooms.map(room => (
                        <div key={room.id} className="bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-hidden flex flex-col">
                            <div className="relative">
                                <img src={room.imageUrl} alt={room.roomType} className="h-48 w-full object-cover"/>
                                <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[room.status]}`}>
                                    {room.status}
                                </span>
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold text-gray-800">Room {room.id}</h3>
                                <p className="text-sm text-gray-500">{room.roomType}</p>
                                
                                <div className="mt-4 flex-grow">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-semibold text-gray-700">Bed Type</span>
                                        <span className="text-gray-600">{room.bedType}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="font-semibold text-gray-700">Amenities</span>
                                        <div className="flex items-center gap-2">
                                            {room.amenities.map(amenity => amenityIcons[amenity])}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <p className="text-lg font-bold text-blue-600">${room.rate}<span className="text-sm font-normal text-gray-500">/night</span></p>
                                    <div className="flex items-center gap-2">
                                         <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition"><Edit className="w-4 h-4"/></button>
                                         <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition"><ToggleLeft className="w-4 h-4"/></button>
                                         <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition"><MoreVertical className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {filteredRooms.length === 0 && (
                     <div className="text-center py-10 bg-white rounded-2xl shadow-md border border-gray-200/80">
                        <p className="text-gray-500">No rooms found matching your criteria.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AllRooms;