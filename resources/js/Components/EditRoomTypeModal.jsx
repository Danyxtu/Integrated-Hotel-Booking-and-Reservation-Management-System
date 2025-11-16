import React, { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EditRoomTypeModal = ({ open, setOpen, roomType }) => {
    const { data, setData, patch, processing, errors, wasSuccessful } = useForm(
        {
            name: roomType.name,
            description: roomType.description,
            price_per_night: roomType.price_per_night,
            capacity_adults: roomType.capacity_adults,
            capacity_children: roomType.capacity_children,
        }
    );

    useEffect(() => {
        if (wasSuccessful) {
            setOpen(false);
        }
    }, [wasSuccessful]);

    const handleSubmit = (e) => {
        e.preventDefault();

        patch(route("admin.room_types.update", roomType.id), {
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Room Type</DialogTitle>
                    <DialogDescription>
                        Update the details of this room type.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <Label>Name</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Description</Label>
                        <textarea
                            className="w-full border rounded p-2"
                            rows={3}
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Price per Night</Label>
                        <Input
                            type="number"
                            value={data.price_per_night}
                            onChange={(e) =>
                                setData("price_per_night", e.target.value)
                            }
                        />
                        {errors.price_per_night && (
                            <p className="text-red-500 text-sm">
                                {errors.price_per_night}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Adults</Label>
                            <Input
                                type="number"
                                value={data.capacity_adults}
                                onChange={(e) =>
                                    setData("capacity_adults", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label>Children</Label>
                            <Input
                                type="number"
                                value={data.capacity_children}
                                onChange={(e) =>
                                    setData("capacity_children", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
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

export default EditRoomTypeModal;
