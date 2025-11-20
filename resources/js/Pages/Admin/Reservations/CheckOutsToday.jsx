import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    FileDown,
    CheckCircle2,
    ArrowRightCircle,
    Clock,
    XCircle,
    Ban,
    CircleOff,
} from "lucide-react";
import { router } from "@inertiajs/react"; // Import router for Inertia calls

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
    "Checked In": {
        icon: ArrowRightCircle,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        label: "Checked In",
    },
    "Checked Out": {
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
    "No Show": {
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

const CheckOutsToday = ({ checkouts }) => {
    const [activeCategory, setActiveCategory] = useState("today"); // 'today' or 'recent'

    const today = new Date().toISOString().split('T')[0];

    const todaysCheckouts = checkouts.filter(
        (b) => new Date(b.check_out_date).toISOString().split('T')[0] === today
    );

    const recentCheckouts = checkouts.filter(
        (b) => b.status_label === "Checked Out"
    );

    const currentCheckouts = activeCategory === "today" ? todaysCheckouts : recentCheckouts;

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
    };

    const getStatusChip = (status) => {
        const style = statusStyles[status];
        if (!style) return null;
        const { icon: Icon, bgColor, textColor, label } = style;
        return (
            <span
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${bgColor} ${textColor}`}
            >
                <Icon className="w-3.5 h-3.5" />
                {label}
            </span>
        );
    };

    const handleCheckOut = (bookingId) => {
        if (
            confirm(
                "Are you sure you want to mark this booking as Checked Out?"
            )
        ) {
            router.put(
                route("admin.bookings.updateStatus", { booking: bookingId }),
                {
                    status: "Checked Out",
                }
            );
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Check-outs
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage and view guest check-outs.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">
                            <FileDown className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveCategory("today")}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                            activeCategory === "today"
                                ? "bg-blue-600 text-white shadow"
                                : "bg-white text-gray-600 hover:bg-gray-100 border"
                        }`}
                    >
                        Today's Checkouts
                    </button>
                    <button
                        onClick={() => setActiveCategory("recent")}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                            activeCategory === "recent"
                                ? "bg-blue-600 text-white shadow"
                                : "bg-white text-gray-600 hover:bg-gray-100 border"
                        }`}
                    >
                        Recent Checkouts
                    </button>
                </div>


                {/* Bookings Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200/80">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Booking ID</th>
                                <th className="px-6 py-4">Guest</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Room Type</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4 text-center">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentCheckouts.map((booking) => (
                                <tr
                                    key={booking.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4 font-mono text-blue-600">
                                        {booking.booking_number}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                        {booking.customer?.first_name}{" "}
                                        {booking.customer?.last_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatDate(booking.check_in_date)}{" "}
                                        &rarr;{" "}
                                        {formatDate(booking.check_out_date)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {booking.room?.room_type?.name}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-right">
                                        $
                                        {parseFloat(
                                            booking.total_price
                                        ).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 flex justify-center">
                                        {getStatusChip(booking.status_label)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center items-center gap-2">
                                            {booking.status_label ===
                                            "Checked In" ? (
                                                <button
                                                    onClick={() =>
                                                        handleCheckOut(
                                                            booking.id
                                                        )
                                                    }
                                                    className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition shadow-sm"
                                                >
                                                    Check Out
                                                </button>
                                            ) : (
                                                <span className="text-gray-500 text-sm">
                                                    Completed
                                                </span>
                                            )}
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

export default CheckOutsToday;
