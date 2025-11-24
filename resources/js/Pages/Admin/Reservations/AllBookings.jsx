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
import CreateBookingModal from "@/Components/CreateBookingModal";
import { useInstantTransition, useScroll } from "framer-motion";
import BookingDetails from "./BookingDetails";

const statusFilters = ["All", "Pending", "Confirmed", "Cancelled", "No Show"];

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

// const handleModal = () = {} // todo

const AllBookings = ({ bookings, rooms }) => {
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("newest"); // newest or oldest
    const [dateFilter, setDateFilter] = useState("");
    const [isCreateBookingModalOpen, setCreateBookingModalOpen] =
        useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    console.log(bookings);

    // Map status to a proper label
    const mappedBookings = bookings.map((b) => ({
        ...b,
        status_label: b.status,
    }));

    // Filter bookings by status, search query, and date
    let filteredBookings = mappedBookings.filter((b) => {
        const matchesStatus =
            activeFilter === "All" || b.status_label === activeFilter;
        const matchesSearch =
            b.booking_number
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            b.customer?.first_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            b.customer?.last_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesDate = dateFilter
            ? new Date(b.check_in_date).toISOString().split("T")[0] ===
              dateFilter
            : true;
        return matchesStatus && matchesSearch && matchesDate;
    });

    // Sort bookings by newest/oldest based on check_in_date
    filteredBookings.sort((a, b) => {
        const dateA = new Date(a.check_in_date);
        const dateB = new Date(b.check_in_date);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

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

    return (
        <>
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
                            <button
                                onClick={() => setCreateBookingModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
                            >
                                <PlusCircle className="w-4 h-4" />
                                New Booking
                            </button>
                        </div>
                    </div>

                    {/* Filters, Search, Sort, Date */}
                    <div className="flex flex-wrap justify-between items-center gap-3">
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

                        <div className="flex items-center gap-2">
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by guest or ID..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>

                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="px-3 py-2 border pr-7 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                            </select>

                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
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
                                    <th className="px-6 py-4 text-right">
                                        Total
                                    </th>
                                    <th className="px-6 py-4 text-center">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-center">
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
                                            {getStatusChip(booking.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        setSelectedBooking(
                                                            booking
                                                        )
                                                    }
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition"
                                                >
                                                    <Eye className="w-4 h-4" />
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
            <CreateBookingModal
                show={isCreateBookingModalOpen}
                onClose={() => setCreateBookingModalOpen(false)}
                rooms={rooms} // Pass rooms prop here
            />
            <BookingDetails
                booking={selectedBooking}
                show={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
            />
        </>
    );
};

export default AllBookings;
