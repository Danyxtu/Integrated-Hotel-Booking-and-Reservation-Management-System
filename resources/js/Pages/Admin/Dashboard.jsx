import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({ auth, stats, recentBookings }) {
    // Admin-specific stats, passed from our new controller
    const adminStats = [
        {
            label: "Total Revenue",
            value: `$${parseFloat(stats.totalRevenue).toLocaleString()}`,
            icon: "💰",
            color: "bg-green-100 text-green-600",
        },
        {
            label: "Total Bookings",
            value: stats.totalBookings,
            icon: "🏨",
            color: "bg-amber-100 text-amber-600",
        },
        {
            label: "Total Hotels",
            value: stats.totalHotels,
            icon: "🏢",
            color: "bg-blue-100 text-blue-600",
        },
        {
            label: "Total Rooms",
            value: stats.totalRooms,
            icon: "🚪",
            color: "bg-purple-100 text-purple-600",
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold leading-tight text-amber-900 dark:text-white">
                        Admin Dashboard
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route("admin.hotels.create")}
                            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium"
                        >
                            + New Hotel
                        </Link>
                        <Link
                            // href={route("search")}
                            className="px-4 py-2 bg-white text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition font-medium"
                        >
                            Search Bookings
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-8 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats Grid - Using Admin Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {adminStats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}
                                    >
                                        {stat.icon}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Main Content - Recent Bookings Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <svg
                                    className="w-6 h-6 text-amber-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Recent Bookings (All Users)
                            </h3>
                        </div>

                        <div className="p-0 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Customer
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Hotel & Room
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Dates
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3"
                                        >
                                            <span className="sr-only">
                                                Edit
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {recentBookings.map((booking) => (
                                        <tr
                                            key={booking.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {booking.user.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {booking.user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {
                                                        booking.room.room_type
                                                            .hotel.name
                                                    }
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {
                                                        booking.room.room_type
                                                            .name
                                                    }{" "}
                                                    (Room{" "}
                                                    {booking.room.room_number})
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                <div>
                                                    Check-in:{" "}
                                                    {new Date(
                                                        booking.check_in_date
                                                    ).toLocaleDateString()}
                                                </div>
                                                <div>
                                                    Check-out:{" "}
                                                    {new Date(
                                                        booking.check_out_date
                                                    ).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        booking.status ===
                                                        "confirmed"
                                                            ? "bg-green-100 text-green-800"
                                                            : booking.status ===
                                                              "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a
                                                    href="#"
                                                    className="text-amber-600 hover:text-amber-900"
                                                >
                                                    View Details
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
