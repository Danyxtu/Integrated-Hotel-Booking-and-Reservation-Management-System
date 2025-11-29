import React, { useState } from "react";
import { usePage, useForm } from "@inertiajs/react";
import { differenceInDays } from "date-fns";
import {
    X,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Banknote,
    CheckCircle,
} from "lucide-react";
import Modal from "@/Components/Modal";
import { getImageUrl } from "@/utils/imageUrl";

const RoomDetailModal = ({ room, onClose, filters, isAvailable }) => {
    const { auth } = usePage().props;
    const { startDate, endDate } = filters;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [step, setStep] = useState(1); // 1: Details, 2: Payment

    let totalNights = 0;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start < end) totalNights = differenceInDays(end, start);
    }
    console.log(auth.user.first_name);
    console.log(auth.user.last_name);
    // Initialize form
    const { data, setData, post, processing, errors } = useForm({
        first_name: auth?.user?.first_name || "",
        last_name: auth?.user?.last_name || "",
        email: auth?.user?.email || "",
        phone: auth?.user?.phone || "0000000000",
        room_id: room.id,
        check_in_date: startDate,
        check_out_date: endDate,
        total_price: (room.price || 0) * totalNights,
        payment_method: "", // User will select this in step 2
    });

    const images = room.image_path
        ? [`/storage/public/${room.image_path}`]
        : room.images && room.images.length > 0
        ? room.images.map((img) => `/storage/public/${img}`)
        : ["https://via.placeholder.com/600x400"];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) => (prev - 1 + images.length) % images.length
        );
    };

    const handlePaymentSelect = (method) => {
        setData("payment_method", method);
    };

    const handleConfirmBooking = () => {
        if (!data.payment_method) {
            alert("Please select a payment method.");
            return;
        }

        post(route("bookings.public.store"), {
            onSuccess: () => {
                onClose();
            },
            onError: (err) => {
                console.error("Booking failed", err);
                alert("Failed to book room. Please check your details.");
            },
        });
    };

    return (
        <Modal show={true} onClose={onClose} maxWidth="5xl">
            <div className="relative max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {step === 1 ? "Room Details" : "Select Payment Method"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="p-6">
                    {step === 1 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Image Carousel */}
                            <div>
                                <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-4">
                                    <img
                                        src={images[currentImageIndex]}
                                        alt="Room"
                                        className="w-full h-96 object-cover"
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Room Details */}
                            <div className="flex flex-col">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        {room.room_type?.name || room.name}
                                    </h3>
                                    <p className="text-gray-700 mb-6">
                                        {room.room_type?.description ||
                                            room.description}
                                    </p>

                                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                        <h4 className="font-bold text-gray-900 mb-3">
                                            Booking Summary
                                        </h4>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Check-in:</span>{" "}
                                            <span className="font-semibold">
                                                {startDate}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Check-out:</span>{" "}
                                            <span className="font-semibold">
                                                {endDate}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Nights:</span>{" "}
                                            <span className="font-semibold">
                                                {totalNights}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                            <span>Total:</span>{" "}
                                            <span className="text-blue-600">
                                                ₱{data.total_price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition shadow-lg"
                                    >
                                        Proceed to Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="max-w-2xl mx-auto">
                            <div className="mb-8 space-y-4">
                                <div
                                    onClick={() =>
                                        handlePaymentSelect("pay_now")
                                    }
                                    className={`p-6 rounded-xl border-2 cursor-pointer transition flex items-center gap-4 ${
                                        data.payment_method === "pay_now"
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-200 hover:border-blue-300"
                                    }`}
                                >
                                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">
                                            Pay Online Now
                                        </h4>
                                        secret_key{" "}
                                        <p className="text-sm text-gray-600">
                                            Secure payment via Credit Card,
                                            GCash, or PayMaya.
                                        </p>
                                    </div>
                                    {data.payment_method === "pay_now" && (
                                        <CheckCircle className="w-6 h-6 text-blue-600 ml-auto" />
                                    )}
                                </div>

                                <div
                                    onClick={() =>
                                        handlePaymentSelect("pay_later")
                                    }
                                    className={`p-6 rounded-xl border-2 cursor-pointer transition flex items-center gap-4 ${
                                        data.payment_method === "pay_later"
                                            ? "border-green-600 bg-green-50"
                                            : "border-gray-200 hover:border-green-300"
                                    }`}
                                >
                                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                                        <Banknote className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">
                                            Pay Upon Arrival
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Reserve your room now and pay at the
                                            hotel front desk.
                                        </p>
                                    </div>
                                    {data.payment_method === "pay_later" && (
                                        <CheckCircle className="w-6 h-6 text-green-600 ml-auto" />
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-1/3 bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-200 transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleConfirmBooking}
                                    disabled={
                                        processing || !data.payment_method
                                    }
                                    className="w-2/3 bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing
                                        ? "Processing..."
                                        : "Confirm & Book"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default RoomDetailModal;
