import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome - Luxury Hotel Bookings" />
            <div className="bg-gradient-to-b from-amber-50 to-white text-gray-800 dark:from-gray-900 dark:to-gray-800 dark:text-white">
                {/* Hero Section with Background */}
                <div className="relative min-h-screen">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-20 dark:opacity-10"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200')",
                        }}
                    />

                    <div className="relative flex min-h-screen flex-col selection:bg-amber-600 selection:text-white">
                        <div className="relative w-full max-w-7xl mx-auto px-6">
                            {/* Header */}
                            <header className="flex items-center justify-between py-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 3L2 9v11a1 1 0 001 1h18a1 1 0 001-1V9l-10-6zm8 16H4v-8.5l8-4.8 8 4.8V19zm-8-7a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-400">
                                            LuxStay
                                        </h1>
                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                            Premium Hotels
                                        </p>
                                    </div>
                                </div>

                                <nav className="flex gap-2">
                                    {auth.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="rounded-lg px-6 py-2.5 bg-amber-600 text-white font-medium transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        >
                                            My Bookings
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route("login")}
                                                className="rounded-lg px-6 py-2.5 text-amber-900 font-medium transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-amber-400 dark:hover:bg-gray-800"
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                href={route("register")}
                                                className="rounded-lg px-6 py-2.5 bg-amber-600 text-white font-medium transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </header>

                            {/* Hero Content */}
                            <div className="flex flex-col items-center justify-center text-center py-20">
                                <h2 className="text-5xl md:text-7xl font-bold text-amber-900 dark:text-white mb-6">
                                    Your Perfect Stay
                                    <br />
                                    Awaits
                                </h2>
                                <p className="text-xl md:text-2xl text-amber-800 dark:text-gray-300 mb-12 max-w-2xl">
                                    Discover luxury accommodations worldwide.
                                    Book directly and save up to 30% on your
                                    next adventure.
                                </p>

                                {/* Search Box */}
                                <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Destination
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Where are you going?"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Check-in
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Check-out
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <button className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300">
                                        Search Hotels
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <main className="py-20 bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h3 className="text-4xl font-bold text-amber-900 dark:text-white mb-4">
                                Why Book With Us
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Experience the difference of premium hotel
                                booking
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="group bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="text-2xl font-bold text-amber-900 dark:text-white mb-4">
                                    Best Price Guarantee
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Find a lower price? We'll match it and give
                                    you an additional 10% off your booking. No
                                    hidden fees, ever.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="text-2xl font-bold text-amber-900 dark:text-white mb-4">
                                    Secure Booking
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Your data is protected with bank-level
                                    encryption. Book with confidence knowing
                                    your information is safe.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="text-2xl font-bold text-amber-900 dark:text-white mb-4">
                                    24/7 Support
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Our dedicated team is always ready to help
                                    you. Get assistance anytime, anywhere during
                                    your journey.
                                </p>
                            </div>
                        </div>

                        {/* Popular Destinations */}
                        <div className="mt-24">
                            <div className="text-center mb-16">
                                <h3 className="text-4xl font-bold text-amber-900 dark:text-white mb-4">
                                    Popular Destinations
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    Explore our most booked locations
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    {
                                        name: "Paris",
                                        hotels: "156 Hotels",
                                        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
                                    },
                                    {
                                        name: "Tokyo",
                                        hotels: "203 Hotels",
                                        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
                                    },
                                    {
                                        name: "New York",
                                        hotels: "312 Hotels",
                                        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400",
                                    },
                                    {
                                        name: "Bali",
                                        hotels: "128 Hotels",
                                        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
                                    },
                                ].map((dest, i) => (
                                    <div
                                        key={i}
                                        className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                    >
                                        <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700">
                                            <img
                                                src={dest.image}
                                                alt={dest.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                            <h4 className="text-2xl font-bold mb-1">
                                                {dest.name}
                                            </h4>
                                            <p className="text-amber-300">
                                                {dest.hotels}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-12 bg-amber-900 dark:bg-gray-900 text-white text-center">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 3L2 9v11a1 1 0 001 1h18a1 1 0 001-1V9l-10-6zm8 16H4v-8.5l8-4.8 8 4.8V19zm-8-7a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold">LuxStay</span>
                        </div>
                        <p className="4text-amber-200 mb-4">
                            Premium hotel bookings worldwide • Est. 2025
                        </p>
                        <p className="text-sm text-amber-300/70">
                            Powered by Laravel v{laravelVersion} (PHP v
                            {phpVersion})
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
