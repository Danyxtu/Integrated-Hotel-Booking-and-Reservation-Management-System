import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { CreditCard, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/utils/imageUrl";

const PublicBookingModal = ({
    show,
    onClose,
    rooms = [],
    checkIn,
    checkOut,
    adults,
    children,
    auth,
}) => {
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [serverRooms, setServerRooms] = useState(null);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: auth?.user?.name?.split(" ")?.[0] || "",
        last_name: auth?.user?.name?.split(" ")?.slice(1).join(" ") || "",
        email: auth?.user?.email || "",
        phone: "",
        room_id: "",
        check_in_date: checkIn || "",
        check_out_date: checkOut || "",
        total_price: 0,
        status: "Pending",
        payment_method: "pay_later",
    });

    useEffect(() => {
        // Keep dates in sync when modal opens
        if (show) {
            setData("check_in_date", checkIn || "");
            setData("check_out_date", checkOut || "");
            if (
                (checkIn || data.check_in_date) &&
                (checkOut || data.check_out_date)
            ) {
                fetchAvailability(
                    checkIn || data.check_in_date,
                    checkOut || data.check_out_date
                );
            }
        }
    }, [show, checkIn, checkOut]);

    const fetchAvailability = async (start_date, end_date) => {
        setLoadingAvailability(true);
        try {
            const response = await axios.post(
                route("bookings.checkAvailability"),
                {
                    start_date,
                    end_date,
                }
            );

            // response.data should be an array of Room models with roomType relation
            const mapped = response.data.map((r) => {
                const roomType = r.room_type || r.roomType || {};
                return {
                    id: r.id, // actual room id
                    room_id: r.id,
                    name: roomType.name || r.name || `Room ${r.id}`,
                    price: roomType.price || r.price || 0,
                    image_path:
                        roomType.image_url ||
                        roomType.image_path ||
                        r.image_path ||
                        "https://via.placeholder.com/600x400",
                    features:
                        roomType.amenities && roomType.amenities.split
                            ? roomType.amenities.split(",")
                            : [],
                    rating: roomType.rating || 4.5,
                };
            });

            setServerRooms(mapped);
        } catch (err) {
            console.error("Availability check failed", err);
            setServerRooms([]);
        } finally {
            setLoadingAvailability(false);
        }
    };

    useEffect(() => {
        if (!show) {
            setStep(1);
            setSelectedRoom(null);
            reset("room_id", "total_price");
        }
    }, [show]);

    const nights = useMemo(() => {
        if (!data.check_in_date || !data.check_out_date) return 0;
        const oneDay = 24 * 60 * 60 * 1000;
        const start = new Date(data.check_in_date);
        const end = new Date(data.check_out_date);
        const diff = Math.round(Math.abs((end - start) / oneDay));
        return diff > 0 ? diff : 1;
    }, [data.check_in_date, data.check_out_date]);

    const availableRooms = useMemo(() => {
        // Basic client-side availability filter: prefer rooms that declare capacity fields
        if (!rooms || rooms.length === 0) return [];
        return rooms.filter((r) => {
            if (adults && r.max_adults !== undefined) {
                if (adults > r.max_adults) return false;
            }
            if (children && r.max_children !== undefined) {
                if (children > r.max_children) return false;
            }
            return true;
        });
    }, [rooms, adults, children]);

    const selectRoom = (room) => {
        setSelectedRoom(room);
        setData("room_id", room.id);
        const price = (room.price || 0) * nights;
        setData("total_price", price);
        setStep(2); // View room details
    };

    const displayedRooms = useMemo(() => {
        if (serverRooms !== null) return serverRooms;
        return availableRooms.length ? availableRooms : rooms;
    }, [serverRooms, availableRooms, rooms]);

    const handleGuestNext = () => {
        // Basic validation
        if (!data.first_name || !data.email) {
            alert("Please provide at least your first name and email.");
            return;
        }
        setStep(4); // Payment choice
    };

    const handlePaymentChoice = (method) => {
        setPaymentMethod(method);

        if (method === "gcash") {
            submitBooking(null, "gcash");
            return;
        }

        if (method === "pay_later") {
            submitBooking(null, "pay_later");
        }
    };

    const submitBooking = (e, method = null) => {
        if (e) e.preventDefault();

        const chosenMethod = method || paymentMethod;
        if (!chosenMethod) {
            alert("Please select a payment method.");
            return;
        }

        const bookingData = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            room_id: data.room_id,
            check_in_date: data.check_in_date,
            check_out_date: data.check_out_date,
            total_price: data.total_price,
            status: "Pending",
        };
        setData("payment_method", chosenMethod);

        post(route("bookings.public.store"), {
            data: bookingData,
            onSuccess: () => {
                if (chosenMethod === "pay_later") {
                    toast({
                        title: "Reservation Email Sent",
                        description: `We emailed the booking details to ${bookingData.email}.`,
                    });

                    setTimeout(() => {
                        onClose();
                        setStep(1);
                        setSelectedRoom(null);
                        setPaymentMethod(null);
                    }, 2000);
                }
            },
            onError: (err) => {
                console.error("Booking submission failed:", err);
                alert("Failed to create booking. Please check your details.");
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Book a Room — Step {step} of 4
                </h2>

                {step === 1 && (
                    <div>
                        <p className="text-sm text-gray-600 mb-4">
                            Select from available rooms based on your search.
                            Availability is subject to confirmation.
                        </p>
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-600">
                                Showing available rooms
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        fetchAvailability(
                                            data.check_in_date || checkIn,
                                            data.check_out_date || checkOut
                                        )
                                    }
                                    className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded"
                                >
                                    {loadingAvailability
                                        ? "Checking..."
                                        : "Refresh availability"}
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 max-h-72 overflow-auto">
                            {(!displayedRooms ||
                                displayedRooms.length === 0) && (
                                <div className="p-4 bg-gray-50 rounded">
                                    No rooms match your preferences or no
                                    availability found.
                                </div>
                            )}
                            {(displayedRooms || []).map((room) => (
                                <div
                                    key={room.id}
                                    className="p-4 border rounded flex items-center gap-4 hover:border-blue-200 transition"
                                >
                                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                            src={
                                                `/storage/public/${room.image_path}` ||
                                                room.image_url ||
                                                room.room_type?.image_url ||
                                                "https://via.placeholder.com/120x120?text=LuxStay"
                                            }
                                            alt={room.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/120x120?text=LuxStay";
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div className="font-semibold">
                                            {room.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            ${room.price} / night
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {room.features
                                                ?.slice?.(0, 2)
                                                ?.join(", ")}
                                        </div>
                                    </div>
                                    <div>
                                        <PrimaryButton
                                            onClick={() => selectRoom(room)}
                                        >
                                            Select
                                        </PrimaryButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: View Room Details */}
                {step === 2 && selectedRoom && (
                    <div className="space-y-4">
                        <div className="bg-gray-100 rounded-lg overflow-hidden h-80">
                            <img
                                src={
                                    `/storage/public/${selectedRoom.image_path}` ||
                                    selectedRoom.image_url ||
                                    selectedRoom.room_type?.image_url ||
                                    `https://via.placeholder.com/600x400?text=${selectedRoom.name}`
                                }
                                alt={selectedRoom.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src =
                                        "https://via.placeholder.com/600x400?text=" +
                                        selectedRoom.name;
                                }}
                            />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <h3 className="text-2xl font-bold">
                                    {selectedRoom.name}
                                </h3>
                                <p className="text-lg text-blue-600 font-semibold">
                                    ₱{selectedRoom.price} / night
                                </p>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">
                                    Booking Details
                                </h4>
                                <p className="text-sm text-gray-700">
                                    Check-in:{" "}
                                    <strong>{data.check_in_date}</strong>
                                </p>
                                <p className="text-sm text-gray-700">
                                    Check-out:{" "}
                                    <strong>{data.check_out_date}</strong>
                                </p>
                                <p className="text-sm text-gray-700">
                                    Duration: <strong>{nights} night(s)</strong>
                                </p>
                                <p className="text-sm text-gray-700">
                                    Guests:{" "}
                                    <strong>
                                        {adults} adult(s), {children} child(ren)
                                    </strong>
                                </p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">
                                    Price Summary
                                </h4>
                                <div className="flex justify-between mb-2">
                                    <span>
                                        ₱{selectedRoom.price} × {nights}{" "}
                                        night(s)
                                    </span>
                                    <span>
                                        ₱
                                        {(selectedRoom.price * nights).toFixed(
                                            2
                                        )}
                                    </span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                    <span>Total:</span>
                                    <span className="text-green-600">
                                        ₱{data.total_price}
                                    </span>
                                </div>
                            </div>

                            {selectedRoom.features &&
                                selectedRoom.features.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            Amenities
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedRoom.features.map(
                                                (feature, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="text-sm text-gray-600"
                                                    >
                                                        ✓ {feature.trim()}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>

                        <div className="flex gap-2 pt-4">
                            <SecondaryButton onClick={() => setStep(1)}>
                                Back to Select Room
                            </SecondaryButton>
                            <PrimaryButton onClick={() => setStep(3)}>
                                Continue to Guest Info
                            </PrimaryButton>
                        </div>
                    </div>
                )}

                {/* Step 3: Guest Information */}
                {step === 3 && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleGuestNext();
                        }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="first_name"
                                    value="First name"
                                />
                                <TextInput
                                    id="first_name"
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
                                    }
                                    required
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="last_name"
                                    value="Last name"
                                />
                                <TextInput
                                    id="last_name"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="phone" value="Phone" />
                                <TextInput
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    required
                                    className="mt-1 block w-full"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <SecondaryButton onClick={() => setStep(2)}>
                                Back
                            </SecondaryButton>
                            <PrimaryButton type="submit">
                                Continue to Payment
                            </PrimaryButton>
                        </div>
                    </form>
                )}

                {/* Step 4: Payment Method Selection */}
                {step === 4 && (
                    <div>
                        <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">
                                Order Summary
                            </h4>
                            <p className="text-sm text-gray-700">
                                Room: <strong>{selectedRoom?.name}</strong>
                            </p>
                            <p className="text-sm text-gray-700">
                                Duration: <strong>{nights} night(s)</strong>
                            </p>
                            <p className="text-xl font-bold text-blue-600 mt-2">
                                Total: ₱{data.total_price}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border-2 border-green-300 rounded-lg bg-green-50 cursor-pointer hover:border-green-500 transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <CreditCard className="w-6 h-6 text-green-600" />
                                    <h4 className="font-semibold">
                                        GCash Payment
                                    </h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Pay now using GCash. Secure and instant
                                    payment processing.
                                </p>
                                <PrimaryButton
                                    onClick={() => submitBooking(null, "gcash")}
                                    className="w-full"
                                >
                                    Pay Now with GCash
                                </PrimaryButton>
                            </div>

                            <div className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:border-gray-500 transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <Clock className="w-6 h-6 text-gray-600" />
                                    <h4 className="font-semibold">Pay Later</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Reserve now and pay at the hotel or later
                                    online.
                                </p>
                                <SecondaryButton
                                    onClick={() =>
                                        submitBooking(null, "pay_later")
                                    }
                                    className="w-full"
                                >
                                    Reserve Now
                                </SecondaryButton>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between">
                            <SecondaryButton onClick={() => setStep(3)}>
                                Back to Guest Info
                            </SecondaryButton>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default PublicBookingModal;
