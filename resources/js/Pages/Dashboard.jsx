import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    // Sample data - in real app, this would come from props/API
    const upcomingBookings = [
        {
            id: 1,
            hotel: 'Grand Plaza Hotel',
            location: 'Paris, France',
            checkIn: '2024-12-15',
            checkOut: '2024-12-18',
            nights: 3,
            guests: 2,
            status: 'confirmed',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
        },
        {
            id: 2,
            hotel: 'Sakura Boutique Inn',
            location: 'Tokyo, Japan',
            checkIn: '2024-12-28',
            checkOut: '2025-01-02',
            nights: 5,
            guests: 1,
            status: 'pending',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400'
        }
    ];

    const recentBookings = [
        {
            id: 3,
            hotel: 'Beachside Resort',
            location: 'Bali, Indonesia',
            checkIn: '2024-10-10',
            checkOut: '2024-10-15',
            amount: '$850',
            status: 'completed'
        },
        {
            id: 4,
            hotel: 'City Center Hotel',
            location: 'New York, USA',
            checkIn: '2024-09-05',
            checkOut: '2024-09-08',
            amount: '$1,200',
            status: 'completed'
        }
    ];

    const stats = [
        { label: 'Total Bookings', value: '12', icon: '🏨', color: 'bg-amber-100 text-amber-600' },
        { label: 'Reward Points', value: '2,450', icon: '⭐', color: 'bg-blue-100 text-blue-600' },
        { label: 'Saved Amount', value: '$3,200', icon: '💰', color: 'bg-green-100 text-green-600' },
        { label: 'Countries Visited', value: '8', icon: '🌍', color: 'bg-purple-100 text-purple-600' }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold leading-tight text-amber-900 dark:text-white">
                        My Dashboard
                    </h2>
                    <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium">
                        + New Booking
                    </button>
                </div>
            }
        >
            <Head title="Dashboard - LuxStay" />

            <div className="py-8 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
                                <p className="text-amber-100">Ready to plan your next adventure?</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-6 py-3 bg-white text-amber-600 rounded-lg hover:bg-amber-50 transition font-semibold shadow-lg">
                                    Browse Hotels
                                </button>
                                <button className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition font-semibold">
                                    View Rewards
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                                        {stat.icon}
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Upcoming Bookings - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Upcoming Bookings
                                        </h3>
                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                            {upcomingBookings.length} Active
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    {upcomingBookings.map((booking) => (
                                        <div key={booking.id} className="group bg-gradient-to-br from-gray-50 to-amber-50/30 dark:from-gray-700 dark:to-gray-600 rounded-xl p-5 border border-amber-100 dark:border-gray-600 hover:shadow-lg transition-all">
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    <img 
                                                        src={booking.image} 
                                                        alt={booking.hotel}
                                                        className="w-24 h-24 rounded-lg object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                                                {booking.hotel}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                {booking.location}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            booking.status === 'confirmed' 
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        }`}>
                                                            {booking.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                                                        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                                                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span className="font-medium">{booking.nights}N</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                                                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            <span className="font-medium">{booking.guests}G</span>
                                                        </div>
                                                        <div className="text-amber-700 dark:text-amber-400 font-semibold">
                                                            {booking.checkIn}
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex gap-2">
                                                        <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium">
                                                            View Details
                                                        </button>
                                                        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition text-sm font-medium">
                                                            Modify
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Bookings */}
                            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Recent Bookings
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {recentBookings.map((booking) => (
                                            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">{booking.hotel}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{booking.location} • {booking.checkIn}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900 dark:text-white">{booking.amount}</p>
                                                    <button className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 font-medium">
                                                        View Receipt
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Takes 1 column */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-300 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Search Hotels
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                        </svg>
                                        My Rewards
                                    </button>
                                    <button className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Account Settings
                                    </button>
                                </div>
                            </div>

                            {/* Special Offers */}
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl">🎁</span>
                                    <h3 className="text-lg font-bold">Special Offer</h3>
                                </div>
                                <p className="text-sm text-purple-100 mb-4">
                                    Book 3 nights or more and get 25% off your next booking!
                                </p>
                                <button className="w-full px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition font-semibold">
                                    Learn More
                                </button>
                            </div>

                            {/* Support */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    Need Help?
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Our support team is available 24/7 to assist you.
                                </p>
                                <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}