import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    FileDown,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowRightCircle,
    CircleOff,
    Ban,
    Eye,
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

const Pending = ({ pendingBookings }) => {
    const [activeCategory, setActiveCategory] = useState("pending"); // 'pending' or 'confirmed'

    const stillPending = pendingBookings.filter(
        (b) => b.status_label === "Pending"
    );
    const confirmedBookings = pendingBookings.filter(
        (b) => b.status_label === "Confirmed"
    );

    const currentBookings =
        activeCategory === "pending" ? stillPending : confirmedBookings;

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

    const handleUpdateStatus = (bookingId, status) => {
        if (
            confirm(`Are you sure you want to mark this booking as ${status}?`)
        ) {
            router.put(
                route("admin.bookings.updateStatus", { booking: bookingId }),
                {
                    status: status,
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
                            Pending Reservations
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage and view pending and confirmed guest
                            bookings.
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
                        onClick={() => setActiveCategory("pending")}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                            activeCategory === "pending"
                                ? "bg-blue-600 text-white shadow"
                                : "bg-white text-gray-600 hover:bg-gray-100 border"
                        }`}
                    >
                        Still Pending
                    </button>
                    <button
                        onClick={() => setActiveCategory("confirmed")}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                            activeCategory === "confirmed"
                                ? "bg-blue-600 text-white shadow"
                                : "bg-white text-gray-600 hover:bg-gray-100 border"
                        }`}
                    >
                        Confirmed
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
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentBookings.map((booking) => (
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
                                        ₱
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
                                            "Pending" ? (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                booking.id,
                                                                "Confirmed"
                                                            )
                                                        }
                                                        className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition shadow-sm"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                booking.id,
                                                                "Cancelled"
                                                            )
                                                        }
                                                        className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-gray-500 text-sm">
                                                    No actions
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

export default Pending;
