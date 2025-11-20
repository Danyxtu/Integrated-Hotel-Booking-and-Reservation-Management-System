import React, { useState } from "react";
import {
    Calendar,
    Users,
    MapPin,
    Search,
    Star,
    Wifi,
    Coffee,
    Dumbbell,
    Utensils,
    Sparkles,
    Clock,
    Award,
} from "lucide-react";
import { Link } from "@inertiajs/react";

export default function HotelBooking({ laravelVersion }) {
    console.log(laravelVersion);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(2);
    const [isScrolled, setIsScrolled] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const features = [
        {
            icon: Wifi,
            label: "Free WiFi",
            desc: "High-speed internet throughout",
        },
        {
            icon: Utensils,
            label: "Fine Dining",
            desc: "5-star restaurant & bar",
        },
        { icon: Dumbbell, label: "Fitness Center", desc: "24/7 gym access" },
        {
            icon: Coffee,
            label: "Room Service",
            desc: "Available round the clock",
        },
    ];

    const rooms = [
        {
            name: "Deluxe Suite",
            price: 299,
            image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
            features: ["King Bed", "Ocean View", "45m²"],
            rating: 4.9,
        },
        {
            name: "Executive Room",
            price: 199,
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
            features: ["Queen Bed", "City View", "35m²"],
            rating: 4.8,
        },
        {
            name: "Presidential Suite",
            price: 599,
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
            features: ["2 Bedrooms", "Panoramic View", "85m²"],
            rating: 5.0,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <header
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                    isScrolled
                        ? "bg-white/95 backdrop-blur-md shadow-lg"
                        : "bg-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    LuxeStay
                                </h1>
                                <p className="text-xs text-gray-500">
                                    Premium Hospitality
                                </p>
                            </div>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <a
                                href="#rooms"
                                className="text-gray-700 hover:text-blue-600 transition font-medium"
                            >
                                Rooms
                            </a>
                            <a
                                href="#amenities"
                                className="text-gray-700 hover:text-blue-600 transition font-medium"
                            >
                                Amenities
                            </a>
                            <a
                                href="#contact"
                                className="text-gray-700 hover:text-blue-600 transition font-medium"
                            >
                                Contact
                            </a>
                            <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition transform">
                                Book Now
                            </button>
                            <Link href={route("login")}>Login Here</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent"></div>
                <div className="max-w-7xl mx-auto relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-fade-in">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-semibold">
                                <Award className="w-4 h-4" />
                                Award-Winning Hotel 2024
                            </div>
                            <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                                Experience
                                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Luxury Redefined
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Discover unparalleled comfort and elegance in
                                the heart of paradise. Your perfect getaway
                                starts here.
                            </p>

                            {/* Search Box */}
                            <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-gray-100">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                            Check-in
                                        </label>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) =>
                                                setCheckIn(e.target.value)
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                            Check-out
                                        </label>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) =>
                                                setCheckOut(e.target.value)
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-blue-600" />
                                        Guests
                                    </label>
                                    <select
                                        value={guests}
                                        onChange={(e) =>
                                            setGuests(Number(e.target.value))
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map((num) => (
                                            <option key={num} value={num}>
                                                {num}{" "}
                                                {num === 1 ? "Guest" : "Guests"}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition transform flex items-center justify-center gap-2">
                                    <Search className="w-5 h-5" />
                                    Search Available Rooms
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                            <img
                                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=1000&fit=crop"
                                alt="Luxury Hotel"
                                className="relative rounded-3xl shadow-2xl w-full h-[600px] object-cover"
                            />
                            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Starting from
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            $199
                                            <span className="text-lg text-gray-500">
                                                /night
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 px-4 py-2 bg-yellow-50 rounded-full">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold text-gray-900">
                                            4.9
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="amenities" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold mb-4">
                            World-Class Amenities
                        </h3>
                        <p className="text-xl text-gray-600">
                            Everything you need for a perfect stay
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-blue-200 hover:shadow-xl transition duration-300"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition transform">
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h4 className="text-xl font-bold mb-2 text-gray-900">
                                    {feature.label}
                                </h4>
                                <p className="text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rooms */}
            <section id="rooms" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold mb-4">
                            Our Signature Rooms
                        </h3>
                        <p className="text-xl text-gray-600">
                            Handpicked accommodations for every traveler
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map((room, idx) => (
                            <div
                                key={idx}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100"
                            >
                                <div className="relative overflow-hidden h-64">
                                    <img
                                        src={room.image}
                                        alt={room.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold text-sm">
                                            {room.rating}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h4 className="text-2xl font-bold mb-3 text-gray-900">
                                        {room.name}
                                    </h4>
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        {room.features.map((feat, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                            >
                                                {feat}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                From
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                ${room.price}
                                                <span className="text-lg text-gray-500">
                                                    /night
                                                </span>
                                            </p>
                                        </div>
                                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition transform">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <Clock className="w-16 h-16 mx-auto mb-6" />
                    <h3 className="text-4xl font-bold mb-6">
                        Ready for Your Dream Vacation?
                    </h3>
                    <p className="text-xl mb-8 text-blue-100">
                        Book now and save up to 30% on early reservations
                    </p>
                    <button className="px-12 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition transform">
                        Reserve Your Stay
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer
                id="contact"
                className="bg-gray-900 text-gray-300 py-12 px-6"
            >
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            LuxStay
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>
                            123 Paradise Avenue, Tropical Island, TI 12345
                        </span>
                    </div>
                    <p className="text-gray-500">
                        © 2025 LuxStay. Experience luxury redefined | Made with
                        Laravel Version: {laravelVersion}
                    </p>
                </div>
            </footer>
        </div>
    );
}
