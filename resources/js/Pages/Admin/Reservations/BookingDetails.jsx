import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const BookingDetails = ({ booking, show, onClose }) => {
    const [isOpen, setIsOpen] = useState(show);

    useEffect(() => {
        setIsOpen(show);
    }, [show]);

    if (!booking) {
        return null;
    }

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "Confirmed":
                return "success";
            case "Pending":
                return "warning";
            case "Cancelled":
                return "destructive";
            default:
                return "secondary";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Booking # {booking.booking_number}</DialogTitle>
                    <DialogDescription>
                        Details for the booking reservation.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Customer Details */}
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-4 text-lg">Customer Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="customer-name">Name</Label>
                                <p id="customer-name" className="font-medium text-sm">
                                    {booking.customer?.first_name}{" "}
                                    {booking.customer?.last_name}
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="customer-email">Email</Label>
                                <p id="customer-email" className="font-medium text-sm">
                                    {booking.customer?.email}
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="customer-phone">Phone</Label>
                                <p id="customer-phone" className="font-medium text-sm">
                                    {booking.customer?.phone}
                                </p>
                            </div>
                             <div>
                                <Label htmlFor="customer-type">Customer Type</Label>
                                <p id="customer-type" className="font-medium text-sm capitalize">
                                    {booking.customer?.type?.replace('_', ' ')}
                                </p>
                            </div>
                        </div>
                    </div>

                                         {/* Booking Details */}
                                        <div className="p-4 border rounded-lg">
                                             <h3 className="font-semibold mb-4 text-lg">Reservation Details</h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                 <div>
                                                    <Label htmlFor="room-number">Room</Label>
                                                    <p id="room-number" className="font-medium text-sm">
                                                        {booking.room?.room_number}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label htmlFor="check-in">Check-in Date</Label>
                                                    <p id="check-in" className="font-medium text-sm">
                                                        {new Date(booking.check_in_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label htmlFor="check-out">Check-out Date</Label>
                                                    <p id="check-out" className="font-medium text-sm">
                                                        {new Date(booking.check_out_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label htmlFor="total-price">Total Price</Label>
                                                    <p id="total-price" className="font-medium text-sm">
                                                        ${parseFloat(booking.total_price).toFixed(2)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label htmlFor="status">Status</Label>
                                                    <div>
                                                         <Badge variant={getStatusVariant(booking.status)} className="capitalize">
                                                            {booking.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                 <div>
                                                    <Label htmlFor="booking-source">Booking Source</Label>
                                                    <p id="booking-source" className="font-medium text-sm capitalize">
                                                        {booking.booking_source}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                    
                                        {/* Payment Details */}
                                        {booking.payment && (
                                            <div className="p-4 border rounded-lg">
                                                <h3 className="font-semibold mb-4 text-lg">Payment Information</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="payment-status">Payment Status</Label>
                                                        <Badge variant={getStatusVariant(booking.payment.status)} className="capitalize">
                                                            {booking.payment.status}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="payment-method">Payment Method</Label>
                                                        <p id="payment-method" className="font-medium text-sm capitalize">
                                                            {booking.payment.method}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="amount-paid">Amount Paid</Label>
                                                        <p id="amount-paid" className="font-medium text-sm">
                                                            ${parseFloat(booking.payment.amount).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="transaction-id">Transaction ID</Label>
                                                        <p id="transaction-id" className="font-medium text-sm">
                                                            {booking.payment.transaction_id || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BookingDetails;