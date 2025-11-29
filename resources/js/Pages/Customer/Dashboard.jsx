import CustomerLayout from "@/Layouts/CustomerLayout";
import React from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import StatCard from "@/Components/StatCard";
import { BedDouble, CalendarCheck, CreditCard } from "lucide-react";

const Dashboard = ({
    totalBookings,
    upcomingStaysCount,
    pendingPayments,
    upcomingReservations,
    recentActivity,
}) => {
    const { auth } = usePage().props;
    const user = auth.user || {};

    const stats = [
        {
            name: "Total Bookings",
            value: totalBookings ?? 0,
            icon: CalendarCheck,
            color: "blue",
            trend: "",
        },
        {
            name: "Upcoming Stays",
            value: upcomingStaysCount ?? 0,
            icon: BedDouble,
            color: "green",
            trend: "",
        },
        {
            name: "Pending Payments",
            value: `$${
                typeof pendingPayments === "number"
                    ? pendingPayments.toFixed(2)
                    : "0.00"
            }`,
            icon: CreditCard,
            color: "red",
            trend: "",
        },
    ];

    return (
        <CustomerLayout>
            <Head title="Customer Dashboard" />
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Welcome, {user.name || "Guest"}!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        name={stat.name}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        trend={stat.trend}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        Upcoming Reservations
                    </h2>
                    {upcomingReservations && upcomingReservations.length > 0 ? (
                        <ul className="mt-4 space-y-3">
                            {upcomingReservations.map((reservation) => (
                                <li
                                    key={reservation.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {reservation.room_type_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Check-in:{" "}
                                            {reservation.check_in_date}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Check-out:{" "}
                                            {reservation.check_out_date}
                                        </p>
                                    </div>
                                    {/* <Link href={`/customer/reservations/${reservation.id}`} className="text-blue-600 hover:underline text-sm">View Details</Link> */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">
                            You have no upcoming reservations.
                        </p>
                    )}
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        Recent Activity
                    </h2>
                    {recentActivity && recentActivity.length > 0 ? (
                        <ul className="mt-4 space-y-3">
                            {recentActivity.map((activity) => (
                                <li
                                    key={activity.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <p className="text-sm">
                                        {activity.description}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {activity.date}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">
                            No recent activity to display.
                        </p>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Dashboard;
