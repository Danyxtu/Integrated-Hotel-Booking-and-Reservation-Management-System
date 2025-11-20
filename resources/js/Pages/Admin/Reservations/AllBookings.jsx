import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Search,
    FileDown,
    PlusCircle,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowRightCircle,
    CircleOff,
    Ban,
    Eye,
    FilePen,
    Trash2,
} from "lucide-react";

const mockBookings = [
    {
        id: "BK001",
        guest: "John Doe",
        checkIn: "2025-11-20",
        checkOut: "2025-11-25",
        roomType: "Deluxe Suite",
        total: 1250.0,
        status: "Confirmed",
    },
    {
        id: "BK002",
        guest: "Jane Smith",
        checkIn: "2025-11-21",
        checkOut: "2025-11-23",
        roomType: "Standard Room",
        total: 450.0,
        status: "CheckedIn",
    },
    {
        id: "BK003",
        guest: "Peter Jones",
        checkIn: "2025-11-22",
        checkOut: "2025-11-26",
        roomType: "Family Room",
        total: 980.0,
        status: "Pending",
    },
    {
        id: "BK004",
        guest: "Mary Johnson",
        checkIn: "2025-11-18",
        checkOut: "2025-11-20",
        roomType: "Standard Room",
        total: 400.0,
        status: "CheckedOut",
    },
    {
        id: "BK005",
        guest: "David Williams",
        checkIn: "2025-12-01",
        checkOut: "2025-12-05",
        roomType: "Honeymoon Suite",
        total: 2500.0,
        status: "Confirmed",
    },
    {
        id: "BK006",
        guest: "Emily Brown",
        checkIn: "2025-11-28",
        checkOut: "2025-11-30",
        roomType: "Standard Room",
        total: 500.0,
        status: "Cancelled",
    },
    {
        id: "BK007",
        guest: "Michael Davis",
        checkIn: "2025-11-15",
        checkOut: "2025-11-17",
        roomType: "Deluxe Suite",
        total: 1100.0,
        status: "NoShow",
    },
    {
        id: "BK008",
        guest: "Sarah Miller",
        checkIn: "2025-12-10",
        checkOut: "2025-12-15",
        roomType: "Family Room",
        total: 1200.0,
        status: "Pending",
    },
];

const statusFilters = [
    "All",
    "Pending",
    "Confirmed",
    "CheckedIn",
    "CheckedOut",
    "Cancelled",
    "NoShow",
];

const statusStyles = {
    Pending: {
        icon: Clock,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        label: "Pending",
    },
    Confirmed: {
        icon: CheckCircle2,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        label: "Confirmed",
    },
    CheckedIn: {
        icon: ArrowRightCircle,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        label: "Checked In",
    },
    CheckedOut: {
        icon: CheckCircle2,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        label: "Checked Out",
    },
    Cancelled: {
        icon: XCircle,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        label: "Cancelled",
    },
    NoShow: {
        icon: Ban,
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        label: "No Show",
    },
    Expired: {
        icon: CircleOff,
        bgColor: "bg-pink-100",
        textColor: "text-pink-800",
        label: "Expired",
    },
};

const AllBookings = () => {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredBookings =
        activeFilter === "All"
            ? mockBookings
            : mockBookings.filter((b) => b.status === activeFilter);

    const getStatusChip = (status) => {
        const { icon: Icon, bgColor, textColor, label } = statusStyles[status];
        return (
            <span
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${bgColor} ${textColor}`}
            >
                <Icon className="w-3.5 h-3.5" />
                {label}
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
                            All Bookings
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage and view all guest reservations.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">
                            <FileDown className="w-4 h-4" />
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
                            <PlusCircle className="w-4 h-4" />
                            New Booking
                        </button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {statusFilters.map((filter) => (
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

                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by guest or ID..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200/80">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">
                                    Booking ID
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Guest
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Dates
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Room Type
                                </th>
                                <th scope="col" className="px-6 py-4 text-right">
                                    Total
                                </th>
                                <th scope="col" className="px-6 py-4 text-center">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-4 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredBookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4 font-mono text-blue-600">
                                        {booking.id}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                        {booking.guest}
                                    </td>
                                    <td className="px-6 py-4">
                                        {booking.checkIn} &rarr;{" "}
                                        {booking.checkOut}
                                    </td>
                                    <td className="px-6 py-4">
                                        {booking.roomType}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-right">
                                        ${booking.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 flex justify-center">
                                        {getStatusChip(booking.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center items-center gap-2">
                                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition">
                                                <Eye className="w-4 h-4"/>
                                            </button>
                                             <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition">
                                                <FilePen className="w-4 h-4"/>
                                            </button>
                                             <button className="p-2 text-red-500 hover:bg-red-50 rounded-md transition">
                                                <Trash2 className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AllBookings;