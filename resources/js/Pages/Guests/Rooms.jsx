import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Calendar, Users, Search, Star, Hotel, Baby, X } from "lucide-react"; // Import X icon for closing modal
import Modal from "@/Components/Modal.jsx"; // Assuming this path for Modal component
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from "@/Components/InputLabel.jsx";
import InputError from "@/Components/InputError.jsx";
import { useForm } from "@inertiajs/react";

export default function Rooms({
    auth,
    rooms,
    roomTypes,
    searchParams,
    laravelVersion,
    phpVersion,
}) {
    const { props } = usePage();
    const user = props.auth.user;

    const initialCheckIn = searchParams?.start_date || "";
    const initialCheckOut = searchParams?.end_date || "";
    const initialAdults = searchParams?.adults || 1;
    const initialChildren = searchParams?.children || 0;
    const initialSelectedRoomType = searchParams?.room_type_id || "";

    const [checkIn, setCheckIn] = useState(initialCheckIn);
    const [checkOut, setCheckOut] = useState(initialCheckOut);
    const [adults, setAdults] = useState(initialAdults);
    const [children, setChildren] = useState(initialChildren);
    const [selectedRoomType, setSelectedRoomType] = useState(
        initialSelectedRoomType
    );

    const [showingBookingModal, setShowingBookingModal] = useState(false);
    const [roomToBook, setRoomToBook] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        room_id: "",
        check_in_date: checkIn,
        check_out_date: checkOut,
        total_price: 0,
    });

    const handleSearch = () => {
        router.get(
            route("customer.rooms"),
            {
                start_date: checkIn,
                end_date: checkOut,
                adults: adults,
                children: children,
                room_type_id: selectedRoomType,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleBookNow = (room) => {
        setRoomToBook(room);
        setData({
            ...data,
            room_id: room.room_id, // Use the actual room_id from the filtered rooms
            check_in_date: checkIn,
            check_out_date: checkOut,
            total_price:
                room.price * calculateNumberOfNights(checkIn, checkOut),
            // Pre-fill user details if logged in
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            email: user?.email || "",
            phone: user?.phone || "",
        });
        setShowingBookingModal(true);
    };

    const closeBookingModal = () => {
        setShowingBookingModal(false);
        setRoomToBook(null);
        reset();
    };

    const calculateNumberOfNights = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff > 0 ? daysDiff : 0;
    };

    useEffect(() => {
        if (roomToBook && checkIn && checkOut) {
            const nights = calculateNumberOfNights(checkIn, checkOut);
            setData("total_price", roomToBook.price * nights);
        }
    }, [checkIn, checkOut, roomToBook]);

    const submitBooking = (e) => {
        e.preventDefault();
        console.log("Submitting booking:", data);
        post(route("bookings.public.store"), {
            onSuccess: () => {
                alert("Booking successful!");
                closeBookingModal();
            },
            onError: (err) => {
                console.error("Booking error:", err);
                alert("Booking failed. Please check the form.");
            },
        });
    };

    return (
        <CustomerLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Available Rooms
                </h2>
            }
        >
            <Head title="Available Rooms" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold mb-6">
                            Find Your Perfect Room
                        </h3>

                        {/* Search and Filter Form */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Check-in Date
                                    </label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        onChange={(e) => {
                                            const newCheckIn = e.target.value;
                                            setCheckIn(newCheckIn);
                                            // Clear checkout if it's before the new checkin
                                            if (
                                                checkOut &&
                                                newCheckIn > checkOut
                                            ) {
                                                setCheckOut("");
                                            }
                                        }}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Check-out Date
                                    </label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        min={
                                            checkIn ||
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        disabled={!checkIn}
                                        onChange={(e) =>
                                            setCheckOut(e.target.value)
                                        }
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />
                                    {!checkIn && (
                                        <p className="text-gray-500 text-xs mt-1">
                                            Please select check-in date first
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Adults
                                    </label>
                                    <select
                                        value={adults}
                                        onChange={(e) =>
                                            setAdults(Number(e.target.value))
                                        }
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Children
                                    </label>
                                    <select
                                        value={children}
                                        onChange={(e) =>
                                            setChildren(Number(e.target.value))
                                        }
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    >
                                        {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Room Type
                                    </label>
                                    <select
                                        value={selectedRoomType}
                                        onChange={(e) =>
                                            setSelectedRoomType(e.target.value)
                                        }
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    >
                                        <option value="">All Room Types</option>
                                        {roomTypes.map((type) => (
                                            <option
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleSearch}
                                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <Search className="w-4 h-4 mr-2" />{" "}
                                        Search Rooms
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Rooms Listing */}
                        {rooms.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {rooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <img
                                            src={`/storage/${room.image_path}`}
                                            alt={room.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                                {room.name}
                                            </h4>
                                            <p className="text-gray-600 text-sm mb-3">
                                                {room.description}
                                            </p>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center text-yellow-500">
                                                    <Star className="w-4 h-4 mr-1" />
                                                    <span>{room.rating}</span>
                                                </div>
                                                <p className="text-lg font-bold text-gray-900">
                                                    ₱{room.price}
                                                    <span className="text-sm text-gray-500">
                                                        /night
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {room.features &&
                                                    room.features.map(
                                                        (feature, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                                                            >
                                                                {feature}
                                                            </span>
                                                        )
                                                    )}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleBookNow(room)
                                                }
                                                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-600 text-lg">
                                No rooms found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <Modal show={showingBookingModal} onClose={closeBookingModal}>
                <form onSubmit={submitBooking} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Book Room: {roomToBook?.name}
                    </h2>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="check_in_date"
                            value="Check-in Date"
                        />
                        <TextInput
                            id="check_in_date"
                            type="date"
                            name="check_in_date"
                            value={data.check_in_date}
                            className="mt-1 block w-full"
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                                const newCheckIn = e.target.value;
                                setData("check_in_date", newCheckIn);
                                // Clear checkout if it's before the new checkin
                                if (
                                    data.check_out_date &&
                                    newCheckIn > data.check_out_date
                                ) {
                                    setData("check_out_date", "");
                                }
                            }}
                            required
                        />
                        <InputError
                            message={errors.check_in_date}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="check_out_date"
                            value="Check-out Date"
                        />
                        <TextInput
                            id="check_out_date"
                            type="date"
                            name="check_out_date"
                            value={data.check_out_date}
                            className="mt-1 block w-full"
                            min={
                                data.check_in_date ||
                                new Date().toISOString().split("T")[0]
                            }
                            disabled={!data.check_in_date}
                            onChange={(e) =>
                                setData("check_out_date", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.check_out_date}
                            className="mt-2"
                        />
                        {!data.check_in_date && (
                            <p className="text-gray-500 text-xs mt-1">
                                Please select check-in date first
                            </p>
                        )}
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="first_name" value="First Name" />
                        <TextInput
                            id="first_name"
                            name="first_name"
                            value={data.first_name}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.first_name}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="last_name" value="Last Name" />
                        <TextInput
                            id="last_name"
                            name="last_name"
                            value={data.last_name}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.last_name}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="phone" value="Phone" />
                        <TextInput
                            id="phone"
                            name="phone"
                            value={data.phone}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("phone", e.target.value)}
                            required
                        />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="total_price" value="Total Price" />
                        <TextInput
                            id="total_price"
                            type="text"
                            name="total_price"
                            value={`$${data.total_price.toFixed(2)}`}
                            className="mt-1 block w-full bg-gray-100"
                            readOnly
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <DangerButton onClick={closeBookingModal}>
                            Cancel
                        </DangerButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Confirm Booking
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </CustomerLayout>
    );
}
