import CustomerLayout from "@/Layouts/CustomerLayout";
import React from "react";
import { Head, usePage } from "@inertiajs/react";
import StatCard from "@/Components/StatCard";
import { BedDouble, CalendarCheck, CreditCard } from "lucide-react";

const Dashboard = () => {
    const { auth } = usePage().props;
    const user = auth.user;

    // Dummy data for stat cards - this would typically come from the backend
    const stats = [
        {
            name: "Total Bookings",
            value: "12",
            icon: CalendarCheck,
            color: "blue",
            trend: "+5% last month",
        },
        {
            name: "Upcoming Stays",
            value: "2",
            icon: BedDouble,
            color: "green",
            trend: "-2% last month",
        },
        {
            name: "Pending Payments",
            value: "$350",
            icon: CreditCard,
            color: "red",
            trend: "+10% last month",
        },
    ];

    return (
        <CustomerLayout>
            <Head title="Customer Dashboard" />
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Welcome, {user.name}!
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
                    <p className="text-gray-600">You have no upcoming reservations.</p>
                    {/* Placeholder for a list of upcoming reservations */}
                    <ul className="mt-4 space-y-3">
                        {/* Example Reservation Item */}
                        {/* <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-semibold">Hotel Grand - Room 101</p>
                                <p className="text-sm text-gray-500">Check-in: Dec 1, 2025</p>
                            </div>
                            <Link href="#" className="text-blue-600 hover:underline text-sm">View Details</Link>
                        </li> */}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        Recent Activity
                    </h2>
                    <p className="text-gray-600">No recent activity to display.</p>
                    {/* Placeholder for recent activities */}
                    <ul className="mt-4 space-y-3">
                        {/* Example Activity Item */}
                        {/* <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm">Booked Room 205 at Hotel A</p>
                            <p className="text-sm text-gray-500">2 days ago</p>
                        </li> */}
                    </ul>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Dashboard;
