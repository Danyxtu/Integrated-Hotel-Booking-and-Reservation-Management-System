import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { CheckCircle2, Clock, ArrowRightCircle, XCircle, Ban, CalendarDays } from "lucide-react";

// Helper to format dates to 'YYYY-MM-DD'
const formatDate = (date) => date.toISOString().split('T')[0];

// Generate dates for mock data
const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date();
twoDaysAgo.setDate(today.getDate() - 2);
const fiveDaysAgo = new Date();
fiveDaysAgo.setDate(today.getDate() - 5);


// Mock data for check-in history
const mockCheckInHistory = [
    // Today
    {
        id: "BK009",
        guestName: "Alice Wonderland",
        roomNumber: "101",
        roomType: "Standard Room",
        checkInDate: formatDate(today),
        checkOutDate: "2025-11-22",
        status: "CheckedIn",
    },
    {
        id: "BK010",
        guestName: "Bob The Builder",
        roomNumber: "205",
        roomType: "Deluxe Suite",
        checkInDate: formatDate(today),
        checkOutDate: "2025-11-24",
        status: "CheckedIn",
    },
    // Yesterday
    {
        id: "BK014",
        guestName: "Frank Sinatra",
        roomNumber: "308",
        roomType: "Deluxe Suite",
        checkInDate: formatDate(yesterday),
        checkOutDate: "2025-11-21",
        status: "CheckedIn",
    },
    {
        id: "BK015",
        guestName: "Grace Kelly",
        roomNumber: "112",
        roomType: "Standard Room",
        checkInDate: formatDate(yesterday),
        checkOutDate: "2025-11-20",
        status: "CheckedIn",
    },
    // Previous
    {
        id: "BK016",
        guestName: "Harry Potter",
        roomNumber: "501",
        roomType: "Honeymoon Suite",
        checkInDate: formatDate(twoDaysAgo),
        checkOutDate: "2025-11-21",
        status: "CheckedIn",
    },
    {
        id: "BK017",
        guestName: "Indiana Jones",
        roomNumber: "210",
        roomType: "Family Room",
        checkInDate: formatDate(fiveDaysAgo),
        checkOutDate: "2025-11-18",
        status: "CheckedIn",
    },
];

const statusStyles = {
    CheckedIn: {
        icon: ArrowRightCircle,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        label: "Checked In",
    },
    // Other statuses can be added here if needed
};

const filterOptions = ["Today", "Yesterday", "Previous"];

const CheckInsToday = () => {
    const [activeFilter, setActiveFilter] = useState("Today");

    const getFilteredCheckIns = () => {
        const todayStr = formatDate(new Date());
        const yesterdayStr = formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));

        switch (activeFilter) {
            case "Today":
                return mockCheckInHistory.filter(c => c.checkInDate === todayStr);
            case "Yesterday":
                return mockCheckInHistory.filter(c => c.checkInDate === yesterdayStr);
            case "Previous":
                return mockCheckInHistory.filter(c => c.checkInDate < yesterdayStr);
            default:
                return [];
        }
    };

    const filteredCheckIns = getFilteredCheckIns();

    const getStatusChip = (status) => {
        const style = statusStyles[status] || {};
        const Icon = style.icon;
        return (
            <span
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${style.bgColor || 'bg-gray-100'} ${style.textColor || 'text-gray-800'}`}
            >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {style.label || status}
            </span>
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Check-in History
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Viewing guests who checked-in on {activeFilter === 'Previous' ? 'previous days' : activeFilter}.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {filterOptions.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                                    activeFilter === filter
                                        ? "bg-blue-600 text-white shadow"
                                        : "bg-white text-gray-600 hover:bg-gray-100 border"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>


                {/* Table of Check-ins */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200/80">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">
                                    Booking ID
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Guest Name
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Room
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Check-in Date
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Expected Check-out
                                </th>
                                <th scope="col" className="px-6 py-4 text-center">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCheckIns.length > 0 ? (
                                filteredCheckIns.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-mono text-blue-600">
                                            {booking.id}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">
                                            {booking.guestName}
                                        </td>
                                        <td className="px-6 py-4">
                                            {booking.roomNumber} - {booking.roomType}
                                        </td>
                                        <td className="px-6 py-4">
                                            {booking.checkInDate}
                                        </td>
                                        <td className="px-6 py-4">
                                            {booking.checkOutDate}
                                        </td>
                                        <td className="px-6 py-4 flex justify-center">
                                            {getStatusChip(booking.status)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <CalendarDays className="w-10 h-10 text-gray-400 mb-2"/>
                                            <p className="font-semibold">No check-ins found for this period.</p>
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

export default CheckInsToday;