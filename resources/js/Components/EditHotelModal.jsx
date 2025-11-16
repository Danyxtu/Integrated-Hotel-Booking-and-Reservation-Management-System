import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { router, useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import MyMap from "@/Components/MyMap";
import { MapPinned, MapPinX } from "lucide-react";

const EditHotelModal = ({ open, setOpenEdit, selectedHotel }) => {
    if (!selectedHotel) return null; // prevent crash on first render

    const [mapVisible, setMapVisible] = useState(false);

    const [coordinates, setCoordinates] = useState({
        lat: selectedHotel?.latitude || null,
        lng: selectedHotel?.longitude || null,
    });

    const { data, setData, put, processing, errors } = useForm({
        name: selectedHotel?.name || "",
        description: selectedHotel?.description || "",
        address: selectedHotel?.address || "",
        city: selectedHotel?.city || "",
        country: selectedHotel?.country || "",
        cover_image_url: selectedHotel?.cover_image_url || "",
        latitude: selectedHotel?.latitude || "",
        longitude: selectedHotel?.longitude || "",
        email: selectedHotel?.email || "",
        phone: selectedHotel?.phone || "",
        website: selectedHotel?.website || "",
    });

    // Reverse geocode whenever new coordinates are selected
    useEffect(() => {
        if (coordinates.lat && coordinates.lng) {
            fetchAddress(coordinates.lat, coordinates.lng);
        }
    }, [coordinates]);

    const fetchAddress = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            const result = await res.json();

            setData("address", result.address?.road || "");
            setData("city", result.address?.city || result.address?.town || "");
            setData("country", result.address?.country || "");
            setData("latitude", lat);
            setData("longitude", lng);
        } catch (error) {
            console.error("Reverse geocoding error:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("admin.hotels.update", selectedHotel.id), {
            onSuccess: () => {
                toast.success("Hotel updated successfully.");
                setOpenEdit(false);
            },
            onError: () => toast.error("Fix the errors and try again."),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpenEdit}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Hotel</DialogTitle>
                    <DialogDescription>
                        Update the hotel information below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hotel Name */}
                    <div>
                        <label className="font-medium text-sm">
                            Hotel Name
                        </label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        {errors.name && (
                            <p className="text-red-600 text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="font-medium text-sm">
                            Description
                        </label>
                        <Textarea
                            value={data.description}
                            rows={4}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            required
                        />
                        {errors.description && (
                            <p className="text-red-600 text-sm">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="font-medium text-sm">Email</label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="font-medium text-sm">Phone</label>
                            <Input
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                            />
                            {errors.phone && (
                                <p className="text-red-600 text-sm">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="font-medium text-sm">
                                Website
                            </label>
                            <Input
                                type="url"
                                value={data.website}
                                onChange={(e) =>
                                    setData("website", e.target.value)
                                }
                            />
                            {errors.website && (
                                <p className="text-red-600 text-sm">
                                    {errors.website}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Map Toggle */}
                    <div
                        className="text-blue-600 flex justify-end pr-3 hover:cursor-pointer"
                        onClick={() => setMapVisible(!mapVisible)}
                    >
                        {mapVisible ? (
                            <MapPinX size={28} />
                        ) : (
                            <MapPinned size={28} />
                        )}
                    </div>

                    {mapVisible && <MyMap onLocationSelect={setCoordinates} />}

                    {/* Address Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium text-sm">
                                Street Address
                            </label>
                            <Input
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                required
                            />
                            {errors.address && (
                                <p className="text-red-600 text-sm">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="font-medium text-sm">City</label>
                            <Input
                                value={data.city}
                                onChange={(e) =>
                                    setData("city", e.target.value)
                                }
                                required
                            />
                            {errors.city && (
                                <p className="text-red-600 text-sm">
                                    {errors.city}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Country */}
                    <div>
                        <label className="font-medium text-sm">Country</label>
                        <Input
                            value={data.country}
                            onChange={(e) => setData("country", e.target.value)}
                            required
                        />
                        {errors.country && (
                            <p className="text-red-600 text-sm">
                                {errors.country}
                            </p>
                        )}
                    </div>

                    {/* Cover Image URL */}
                    <div>
                        <label className="font-medium text-sm">
                            Cover Image URL
                        </label>
                        <Input
                            type="url"
                            value={data.cover_image_url}
                            onChange={(e) =>
                                setData("cover_image_url", e.target.value)
                            }
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Paste a valid image URL.
                        </p>
                        {errors.cover_image_url && (
                            <p className="text-red-600 text-sm">
                                {errors.cover_image_url}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenEdit(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditHotelModal;
