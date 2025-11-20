import React, { useState } from "react";
import {
    Calendar,
    Hotel,
    Clock,
    DollarSign,
    TrendingUp,
    User,
    CheckCircle,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import StatCard from "@/Components/StatCard";
import PrimaryButton from "@/Components/PrimaryButton";
import CreateBookingModal from "@/Components/CreateBookingModal";

const iconComponents = {
    Calendar,
    Hotel,
    Clock,
    DollarSign,
    TrendingUp,
    User,
    CheckCircle,
};

const AdminDashboard = ({
    stats,
    recentBookings,
    pendingActions,
    customers,
    rooms,
}) => {
    const [isCreateBookingModalOpen, setCreateBookingModalOpen] =
        useState(false);

    const statsWithComponents = stats.map((stat) => ({
        ...stat,
        icon: iconComponents[stat.icon],
    }));

    return (
        <>
            <div className="space-y-8">
                {/* 1. Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsWithComponents.map((stat) => (
                        <StatCard key={stat.name} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 2. Pending Actions (Left Column) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-600" />
                            Pending Hotel Actions
                        </h3>
                        <div className="space-y-4">
                            {pendingActions.map((action) => (
                                <div
                                    key={action.id}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition"
                                >
                                    <div
                                        className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                                    >
                                        {action.type.slice(0, 1)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">
                                            {action.type}: {action.description}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Priority: {action.time}
                                        </p>
                                    </div>
                                    <Link
                                        href={action.route}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                                    >
                                        View
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Quick Booking / New Reservation (Right Column) */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 p-6 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-600" />
                            New Reservation
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Process a walk-in or phone booking quickly.
                        </p>
                        <div className="flex-grow"></div>
                        <PrimaryButton
                            onClick={() => setCreateBookingModalOpen(true)}
                        >
                            Create Booking
                        </PrimaryButton>
                    </div>
                </div>

                {/* 4. Recent Activity (Full Width) */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Recent Booking Activity
                    </h3>
                    <div className="space-y-4">
                        {recentBookings.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {item.guest
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">
                                        New booking from {item.guest}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {item.details}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <CreateBookingModal
                show={isCreateBookingModalOpen}
                onClose={() => setCreateBookingModalOpen(false)}
                customers={customers}
                rooms={rooms}
            />
        </>
    );
};

AdminDashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;

export default AdminDashboard;
