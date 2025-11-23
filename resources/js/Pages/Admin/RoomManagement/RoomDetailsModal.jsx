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
import { Users, Baby, DollarSign, BedDouble } from "lucide-react";

const RoomDetailsModal = ({ room, show, onClose }) => {
    const [isOpen, setIsOpen] = useState(show);

    useEffect(() => {
        setIsOpen(show);
    }, [show]);

    if (!room) {
        return null;
    }

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "Available":
                return "success";
            case "Occupied":
                return "destructive";
            case "Cleaning":
                return "warning";
            case "Maintenance":
                return "secondary";
            default:
                return "secondary";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Room Details - Room {room.room_number}</DialogTitle>
                    <DialogDescription>
                        Comprehensive details for Room {room.room_number}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Room Information */}
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-4 text-lg">Room Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="room-number-display" className="flex items-center gap-1"><BedDouble className="w-4 h-4"/> Room Number</Label>
                                <p id="room-number-display" className="font-medium text-sm">{room.room_number}</p>
                            </div>
                            <div>
                                <Label htmlFor="room-status" className="flex items-center gap-1">Status</Label>
                                <Badge variant={getStatusVariant(room.status)} className="capitalize">
                                    {room.status}
                                </Badge>
                            </div>
                            <div>
                                <Label htmlFor="room-type-name" className="flex items-center gap-1">Room Type</Label>
                                <p id="room-type-name" className="font-medium text-sm">{room.room_type?.name}</p>
                            </div>
                            <div>
                                <Label htmlFor="room-price" className="flex items-center gap-1"><DollarSign className="w-4 h-4"/> Price</Label>
                                <p id="room-price" className="font-medium text-sm">${parseFloat(room.room_type?.price).toFixed(2)} / night</p>
                            </div>
                            <div>
                                <Label htmlFor="room-capacity-adults" className="flex items-center gap-1"><Users className="w-4 h-4"/> Adults Capacity</Label>
                                <p id="room-capacity-adults" className="font-medium text-sm">{room.room_type?.capacity_adults}</p>
                            </div>
                            <div>
                                <Label htmlFor="room-capacity-children" className="flex items-center gap-1"><Baby className="w-4 h-4"/> Children Capacity</Label>
                                <p id="room-capacity-children" className="font-medium text-sm">{room.room_type?.capacity_children}</p>
                            </div>
                        </div>
                    </div>

                    {/* Room Type Details (Optional - if more detailed than above) */}
                    {room.room_type && (
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-4 text-lg">Room Type Description & Amenities</h3>
                            <div>
                                <Label htmlFor="room-type-description">Description</Label>
                                <p id="room-type-description" className="font-medium text-sm">{room.room_type?.description || 'N/A'}</p>
                            </div>
                            <div className="mt-4">
                                <Label htmlFor="room-type-amenities">Amenities</Label>
                                <p id="room-type-amenities" className="font-medium text-sm">{room.room_type?.amenities || 'N/A'}</p>
                            </div>
                            {room.room_type?.image_path && (
                                <div className="mt-4">
                                    <Label htmlFor="room-type-image">Image</Label>
                                    <img src={`/storage/${room.room_type.image_path}`} alt={room.room_type.name} className="mt-2 w-full h-48 object-cover rounded-lg"/>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Current Booking Information (if applicable) */}
                    {room.current_booking && (
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-4 text-lg">Current Booking</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="current-booking-id">Booking ID</Label>
                                    <p id="current-booking-id" className="font-medium text-sm">{room.current_booking.booking_number}</p>
                                </div>
                                <div>
                                    <Label htmlFor="current-booking-guest">Guest</Label>
                                    <p id="current-booking-guest" className="font-medium text-sm">
                                        {room.current_booking.customer?.first_name} {room.current_booking.customer?.last_name}
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="current-check-in">Check-in</Label>
                                    <p id="current-check-in" className="font-medium text-sm">
                                        {new Date(room.current_booking.check_in_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="current-check-out">Check-out</Label>
                                    <p id="current-check-out" className="font-medium text-sm">
                                        {new Date(room.current_booking.check_out_date).toLocaleDateString()}
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

export default RoomDetailsModal;
