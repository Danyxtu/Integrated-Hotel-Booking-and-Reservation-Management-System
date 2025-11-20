import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Search, PlusCircle, Eye, Edit, Trash2, FileText } from "lucide-react";

// Mock data for guests
const mockGuests = [
    { id: 'G001', name: 'John Doe', email: 'john.doe@example.com', phone: '+1-202-555-0104', totalBookings: 3, lastVisit: '2025-11-20' },
    { id: 'G002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1-315-555-0125', totalBookings: 1, lastVisit: '2025-11-21' },
    { id: 'G003', name: 'Peter Jones', email: 'peter.jones@example.com', phone: '+1-415-555-0189', totalBookings: 5, lastVisit: '2025-11-22' },
    { id: 'G004', name: 'Mary Johnson', email: 'mary.johnson@example.com', phone: '+1-650-555-0143', totalBookings: 2, lastVisit: '2025-11-18' },
    { id: 'G005', name: 'David Williams', email: 'david.williams@example.com', phone: '+1-818-555-0199', totalBookings: 1, lastVisit: '2025-12-01' },
    { id: 'G006', name: 'Emily Brown', email: 'emily.brown@example.com', phone: '+1-917-555-0133', totalBookings: 0, lastVisit: null },
];

const Guests = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGuests = mockGuests.filter(guest =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.phone.includes(searchTerm)
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">All Guests</h1>
                        <p className="text-gray-500 mt-1">Manage guest information and view their booking history.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
                            <PlusCircle className="w-4 h-4" />
                            Add New Guest
                        </button>
                    </div>
                </div>

                {/* Guests Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200/80">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">Guest ID</th>
                                <th scope="col" className="px-6 py-4">Name</th>
                                <th scope="col" className="px-6 py-4">Contact</th>
                                <th scope="col" className="px-6 py-4 text-center">Total Bookings</th>
                                <th scope="col" className="px-6 py-4">Last Visit</th>
                                <th scope="col" className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredGuests.length > 0 ? (
                                filteredGuests.map((guest) => (
                                    <tr key={guest.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-mono text-blue-600">{guest.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{guest.name}</td>
                                        <td className="px-6 py-4">
                                            <div>{guest.email}</div>
                                            <div className="text-xs text-gray-500">{guest.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">{guest.totalBookings}</td>
                                        <td className="px-6 py-4">{guest.lastVisit || 'N/A'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition" title="View Guest Details">
                                                    <Eye className="w-4 h-4"/>
                                                </button>
                                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition" title="Edit Guest">
                                                    <Edit className="w-4 h-4"/>
                                                </button>
                                                <button className="p-2 text-red-500 hover:bg-red-50 rounded-md transition" title="Delete Guest">
                                                    <Trash2 className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="w-10 h-10 text-gray-400 mb-2"/>
                                            <p className="font-semibold">No guests found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Guests;