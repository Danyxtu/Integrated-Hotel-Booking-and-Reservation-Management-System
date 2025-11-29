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
import { DollarSign, CreditCard, CalendarDays } from "lucide-react";

const PaymentDetailsModal = ({ payment, show, onClose }) => {
    const [isOpen, setIsOpen] = useState(show);

    useEffect(() => {
        setIsOpen(show);
    }, [show]);

    if (!payment) {
        return null;
    }

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "completed":
                return "success";
            case "pending":
                return "warning";
            case "failed":
                return "destructive";
            case "refunded":
                return "secondary";
            default:
                return "secondary";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Payment Details - #
                        {payment.transaction_id || payment.id}
                    </DialogTitle>
                    <DialogDescription>
                        Comprehensive details for this payment transaction.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Payment Information */}
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-4 text-lg">
                            Payment Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="transaction-id">
                                    Transaction ID
                                </Label>
                                <p
                                    id="transaction-id"
                                    className="font-medium text-sm"
                                >
                                    {payment.transaction_id || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="payment-status">Status</Label>
                                <Badge
                                    variant={getStatusVariant(payment.status)}
                                    className="capitalize"
                                >
                                    {payment.status}
                                </Badge>
                            </div>
                            <div>
                                <Label
                                    htmlFor="amount-paid"
                                    className="flex items-center gap-1"
                                >
                                    <DollarSign className="w-4 h-4" /> Amount
                                    Paid
                                </Label>
                                <p
                                    id="amount-paid"
                                    className="font-medium text-sm"
                                >
                                    ₱{parseFloat(payment.amount).toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <Label
                                    htmlFor="payment-method"
                                    className="flex items-center gap-1"
                                >
                                    <CreditCard className="w-4 h-4" /> Method
                                </Label>
                                <p
                                    id="payment-method"
                                    className="font-medium text-sm capitalize"
                                >
                                    {payment.method}
                                </p>
                            </div>
                            <div>
                                <Label
                                    htmlFor="payment-date"
                                    className="flex items-center gap-1"
                                >
                                    <CalendarDays className="w-4 h-4" /> Payment
                                    Date
                                </Label>
                                <p
                                    id="payment-date"
                                    className="font-medium text-sm"
                                >
                                    {new Date(
                                        payment.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            {payment.refund_reason && (
                                <div>
                                    <Label htmlFor="refund-reason">
                                        Refund Reason
                                    </Label>
                                    <p
                                        id="refund-reason"
                                        className="font-medium text-sm"
                                    >
                                        {payment.refund_reason}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Associated Booking Information */}
                    {payment.booking && (
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-4 text-lg">
                                Associated Booking
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="booking-number">
                                        Booking Number
                                    </Label>
                                    <p
                                        id="booking-number"
                                        className="font-medium text-sm"
                                    >
                                        {payment.booking.booking_number}
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="booking-guest">Guest</Label>
                                    <p
                                        id="booking-guest"
                                        className="font-medium text-sm"
                                    >
                                        {payment.booking.customer?.first_name}{" "}
                                        {payment.booking.customer?.last_name}
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="booking-check-in">
                                        Check-in
                                    </Label>
                                    <p
                                        id="booking-check-in"
                                        className="font-medium text-sm"
                                    >
                                        {new Date(
                                            payment.booking.check_in_date
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="booking-check-out">
                                        Check-out
                                    </Label>
                                    <p
                                        id="booking-check-out"
                                        className="font-medium text-sm"
                                    >
                                        {new Date(
                                            payment.booking.check_out_date
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Associated Customer Information (if not already via booking) */}
                    {payment.customer &&
                        !payment.booking && ( // Only show if not linked via booking
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold mb-4 text-lg">
                                    Customer Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="customer-name">
                                            Name
                                        </Label>
                                        <p
                                            id="customer-name"
                                            className="font-medium text-sm"
                                        >
                                            {payment.customer.first_name}{" "}
                                            {payment.customer.last_name}
                                        </p>
                                    </div>
                                    <div>
                                        <Label htmlFor="customer-email">
                                            Email
                                        </Label>
                                        <p
                                            id="customer-email"
                                            className="font-medium text-sm"
                                        >
                                            {payment.customer.email}
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

export default PaymentDetailsModal;
