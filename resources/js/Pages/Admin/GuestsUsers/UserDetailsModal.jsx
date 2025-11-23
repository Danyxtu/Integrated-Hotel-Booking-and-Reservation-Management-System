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
import { User, Mail, Phone, CalendarDays, Wallet } from "lucide-react";

const UserDetailsModal = ({ user, show, onClose }) => {
    const [isOpen, setIsOpen] = useState(show);

    useEffect(() => {
        setIsOpen(show);
    }, [show]);

    if (!user) {
        return null;
    }

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case "admin":
                return "destructive";
            case "user":
                return "default";
            default:
                return "secondary";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>User Details - {user.first_name} {user.last_name}</DialogTitle>
                    <DialogDescription>
                        Comprehensive details for {user.first_name} {user.last_name}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Basic User Information */}
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-4 text-lg">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="user-name" className="flex items-center gap-1"><User className="w-4 h-4"/> Full Name</Label>
                                <p id="user-name" className="font-medium text-sm">{user.first_name} {user.last_name}</p>
                            </div>
                            <div>
                                <Label htmlFor="user-email" className="flex items-center gap-1"><Mail className="w-4 h-4"/> Email</Label>
                                <p id="user-email" className="font-medium text-sm">{user.email}</p>
                            </div>
                            {user.phone && (
                                <div>
                                    <Label htmlFor="user-phone" className="flex items-center gap-1"><Phone className="w-4 h-4"/> Phone</Label>
                                    <p id="user-phone" className="font-medium text-sm">{user.phone}</p>
                                </div>
                            )}
                            <div>
                                <Label htmlFor="user-role" className="flex items-center gap-1">Role</Label>
                                <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                                    {user.role}
                                </Badge>
                            </div>
                            {user.created_at && (
                                <div>
                                    <Label htmlFor="user-joined" className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/> Joined</Label>
                                    <p id="user-joined" className="font-medium text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Customer Specific Information (if applicable) */}
                    {user.role === 'user' && user.customer && (
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-4 text-lg">Customer Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="customer-type">Customer Type</Label>
                                    <p id="customer-type" className="font-medium text-sm capitalize">
                                        {user.customer.type?.replace('_', ' ') || 'N/A'}
                                    </p>
                                </div>
                                {user.customer.total_bookings !== undefined && (
                                    <div>
                                        <Label htmlFor="customer-total-bookings">Total Bookings</Label>
                                        <p id="customer-total-bookings" className="font-medium text-sm">
                                            {user.customer.total_bookings}
                                        </p>
                                    </div>
                                )}
                                {user.customer.total_spent !== undefined && (
                                    <div>
                                        <Label htmlFor="customer-total-spent" className="flex items-center gap-1"><Wallet className="w-4 h-4"/> Total Spent</Label>
                                        <p id="customer-total-spent" className="font-medium text-sm">
                                            ${parseFloat(user.customer.total_spent).toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Admin Specific Information (if applicable) - could add permissions here */}
                    {user.role === 'admin' && (
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-4 text-lg">Admin Privileges</h3>
                            <p className="font-medium text-sm text-gray-700">Full administrative access to the system.</p>
                            {/* You could add specific permissions here if they were part of the user object */}
                        </div>
                    )}

                    {/* Associated Bookings (if available for customer) */}
                    {user.bookings && user.bookings.length > 0 && (
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-4 text-lg">Recent Bookings</h3>
                            <div className="space-y-3">
                                {user.bookings.map(booking => (
                                    <div key={booking.id} className="border-b pb-2 last:border-b-0">
                                        <p className="font-semibold text-sm">Booking # {booking.booking_number}</p>
                                        <p className="text-xs text-gray-600">Check-in: {new Date(booking.check_in_date).toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-600">Check-out: {new Date(booking.check_out_date).toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-600">Total: ${parseFloat(booking.total_price).toFixed(2)}</p>
                                        <Badge className="capitalize text-xs mt-1">{booking.status}</Badge>
                                    </div>
                                ))}
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

export default UserDetailsModal;
