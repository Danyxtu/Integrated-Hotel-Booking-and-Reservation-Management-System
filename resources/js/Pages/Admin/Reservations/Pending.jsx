import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { User, Calendar, Hotel, DollarSign, CheckCircle2, XCircle, Clock } from "lucide-react";

// Mock data for pending bookings
const mockPendingBookings = [
    {
        id: "BK003",
        guestName: "Peter Jones",
        checkInDate: "2025-11-22",
        checkOutDate: "2025-11-26",
        roomType: "Family Room",
        total: 980.0,
        status: "Pending",
    },
    {
        id: "BK008",
        guestName: "Sarah Miller",
        checkInDate: "2025-12-10",
        checkOutDate: "2025-12-15",
        roomType: "Family Room",
        total: 1200.0,
        status: "Pending",
    },
    {
        id: "BK020",
        guestName: "Bruce Wayne",
        checkInDate: "2025-12-01",
        checkOutDate: "2025-12-03",
        roomType: "Deluxe Suite",
        total: 750.0,
        status: "Pending",
    },
    {
        id: "BK021",
        guestName: "Clark Kent",
        checkInDate: "2025-12-05",
        checkOutDate: "2025-12-08",
        roomType: "Standard Room",
        total: 600.0,
        status: "Pending",
    },
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
    Cancelled: {
        icon: XCircle,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        label: "Cancelled",
    },
};

const Pending = () => {
    const [pendingBookings, setPendingBookings] = useState(mockPendingBookings);

    const handleConfirm = (bookingId) => {
        setPendingBookings((prevBookings) =>
            prevBookings.filter((booking) => booking.id !== bookingId)
        );
        console.log(`Booking ${bookingId} confirmed.`);
        // In a real application, you would send an API request to update the booking status.
    };

    const handleCancel = (bookingId) => {
        setPendingBookings((prevBookings) =>
            prevBookings.filter((booking) => booking.id !== bookingId)
        );
        console.log(`Booking ${bookingId} cancelled.`);
        // In a real application, you would send an API request to update the booking status.
    };

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
                            Pending Bookings
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Review and manage new booking requests.
                        </p>
                    </div>
                </div>

                {/* Table of Pending Bookings */}
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
                            {pendingBookings.length > 0 ? (
                                pendingBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-mono text-blue-600">
                                            {booking.id}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">
                                            {booking.guestName}
                                        </td>
                                        <td className="px-6 py-4">
                                            {booking.checkInDate} &rarr;{" "}
                                            {booking.checkOutDate}
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
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleConfirm(booking.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5"/>
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(booking.id)}
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                                                >
                                                    <XCircle className="w-3.5 h-3.5"/>
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Calendar className="w-10 h-10 text-gray-400 mb-2"/>
                                            <p className="font-semibold">No pending bookings to assess.</p>
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

export default Pending;
