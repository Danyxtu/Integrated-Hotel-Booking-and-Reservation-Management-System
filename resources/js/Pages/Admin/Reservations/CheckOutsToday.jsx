import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { User, Hotel, Calendar, LogOut, CheckCircle2, ArrowRightCircle } from "lucide-react";

// Helper to format dates to 'YYYY-MM-DD'
const formatDate = (date) => date.toISOString().split('T')[0];

// Mock data for bookings checking out today
const mockCheckOutsToday = [
    {
        id: "BK002",
        guestName: "Jane Smith",
        roomNumber: "205",
        roomType: "Standard Room",
        checkInDate: "2025-11-18",
        checkOutDate: formatDate(new Date()),
        status: "CheckedIn",
    },
    {
        id: "BK004",
        guestName: "Mary Johnson",
        roomNumber: "105",
        roomType: "Standard Room",
        checkInDate: "2025-11-18",
        checkOutDate: formatDate(new Date()),
        status: "CheckedOut", // Already checked out
    },
    {
        id: "BK018",
        guestName: "James Bond",
        roomNumber: "707",
        roomType: "Honeymoon Suite",
        checkInDate: "2025-11-15",
        checkOutDate: formatDate(new Date()),
        status: "CheckedIn",
    },
    {
        id: "BK019",
        guestName: "Natasha Romanoff",
        roomNumber: "303",
        roomType: "Deluxe Suite",
        checkInDate: "2025-11-17",
        checkOutDate: formatDate(new Date()),
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
    CheckedOut: {
        icon: CheckCircle2,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        label: "Checked Out",
    },
};

const CheckOutsToday = () => {
    const [checkOuts, setCheckOuts] = useState(mockCheckOutsToday);

    const handleCheckOut = (bookingId) => {
        setCheckOuts((prevCheckOuts) =>
            prevCheckOuts.map((booking) =>
                booking.id === bookingId
                    ? { ...booking, status: "CheckedOut" }
                    : booking
            )
        );
        console.log(`Booking ${bookingId} checked out.`);
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
                            Check-outs Today
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Guests scheduled to check out on {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
                        </p>
                    </div>
                </div>

                {/* Table of Check-outs */}
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
                                    Check-out Date
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
                            {checkOuts.length > 0 ? (
                                checkOuts.map((booking) => (
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
                                        <td className="px-6 py-4 font-semibold">
                                            {booking.checkOutDate}
                                        </td>
                                        <td className="px-6 py-4 flex justify-center">
                                            {getStatusChip(booking.status)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {booking.status === "CheckedIn" ? (
                                                <button
                                                    onClick={() => handleCheckOut(booking.id)}
                                                    className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                                                >
                                                    <LogOut className="w-3.5 h-3.5"/>
                                                    Check Out
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Calendar className="w-10 h-10 text-gray-400 mb-2"/>
                                            <p className="font-semibold">No check-outs scheduled for today.</p>
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

export default CheckOutsToday;
