import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import React from "react";
import { format, differenceInDays } from "date-fns";

const Reservations = () => {
    const { reservations } = usePage().props;

    const getPaymentStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "refunded":
                return "bg-red-100 text-red-800";
            case "pay_at_hotel": // Assuming 'pay_at_hotel' is a valid status from the backend
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const renderReservationCard = (reservation) => {
        const checkInDate = new Date(reservation.check_in_date);
        const checkOutDate = new Date(reservation.check_out_date);
        const totalNights = differenceInDays(checkOutDate, checkInDate);

        // Dummy data for price breakdown - assume these are passed from backend or calculated
        const basePricePerNight = reservation.room?.price || 100; // Placeholder if not available
        const taxesAndFees = (basePricePerNight * totalNights * 0.15).toFixed(
            2
        ); // 15% tax/fee
        const totalAmount = (
            basePricePerNight * totalNights +
            parseFloat(taxesAndFees)
        ).toFixed(2);

        return (
            <div
                key={reservation.id}
                className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 mb-6"
            >
                {/* Booking Reference & Status */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Booking Reference:{" "}
                        {reservation.booking_reference ||
                            `BK-${reservation.id}`}
                    </h3>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBadge(
                            reservation.payment_status || "pending"
                        )}`}
                    >
                        Payment:{" "}
                        {reservation.payment_status
                            ? reservation.payment_status.replace(/_/g, " ")
                            : "Pending"}
                    </span>
                </div>

                {/* Dates & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4 mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Check-in Date</p>
                        <p className="font-medium text-gray-800">
                            {format(checkInDate, "MMM d, yyyy")} (After 2:00 PM)
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Check-out Date</p>
                        <p className="font-medium text-gray-800">
                            {format(checkOutDate, "MMM d, yyyy")} (Before 11:00
                            AM)
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Nights</p>
                        <p className="font-medium text-gray-800">
                            {totalNights} Nights
                        </p>
                    </div>
                </div>

                {/* Room Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4 mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Hotel</p>
                        <p className="font-medium text-gray-800">
                            {reservation.room?.hotel?.name || "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Room Type</p>
                        <p className="font-medium text-gray-800">
                            {reservation.room?.room_type?.name || "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Room Number</p>
                        <p className="font-medium text-gray-800">
                            {reservation.room?.room_number ||
                                "Assigned at Check-in"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">
                            Bed Configuration
                        </p>
                        <p className="font-medium text-gray-800">
                            {reservation.room?.bed_configuration ||
                                "1 King Bed"}
                        </p>{" "}
                        {/* Placeholder */}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-medium text-gray-800">
                            {reservation.num_adults} Adults,{" "}
                            {reservation.num_children || 0} Children
                        </p>
                    </div>
                </div>

                {/* Financial Transparency */}
                <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-500">Price Breakdown</p>
                    <div className="flex justify-between text-gray-700">
                        <span>
                            Base Price ({basePricePerNight} x {totalNights}{" "}
                            nights)
                        </span>
                        <span>
                            ₱{(basePricePerNight * totalNights).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>Taxes & Fees</span>
                        <span>₱{taxesAndFees}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2 mt-2">
                        <span>Total Amount</span>
                        <span>₱{totalAmount}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    {/* Add action buttons here, e.g., "Cancel Reservation" (if status allows) */}
                    {/* <Link
                        href={route("customer.reservations.show", reservation.id)}
                        className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                    >
                        View Details
                    </Link> */}
                </div>
            </div>
        );
    };

    return (
        <CustomerLayout>
            <Head title="Your Reservations" />
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
                Your Reservations
            </h1>

            {reservations && reservations.length > 0 ? (
                <div className="space-y-6">
                    {reservations.map(renderReservationCard)}
                </div>
            ) : (
                <div className="text-center p-10 bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100">
                    <p className="text-xl text-gray-600 mb-4">
                        You currently have no reservations.
                    </p>
                    <Link
                        href={route("customer.rooms")} // Assuming a route to browse rooms
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Browse Rooms
                    </Link>
                </div>
            )}
        </CustomerLayout>
    );
};

export default Reservations;
