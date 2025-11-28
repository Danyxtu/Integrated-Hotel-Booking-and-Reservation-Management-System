import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { PlusCircle, Edit, Trash2, Users, Baby } from "lucide-react";
import { useForm, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import ImageWithFallback from "@/Components/ImageWithFallback"; // Import the new component
import { getImageUrl } from "@/utils/imageUrl";

const RoomTypeDetailsModal = ({ roomType, open, onOpenChange }) => {
    if (!roomType) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{roomType.name}</DialogTitle>
                    <DialogDescription>
                        Complete details for the room type.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="w-full h-64 rounded-lg overflow-hidden">
                        <ImageWithFallback
                            src={getImageUrl(roomType.image_path, roomType.image_url)}
                            alt={roomType.name}
                            className="w-full h-full object-cover"
                            fallbackComponent={
                                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            }
                        />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-semibold text-gray-500">
                                Description
                            </Label>
                            <p className="mt-1 text-gray-800">
                                {roomType.description}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm font-semibold text-gray-500">
                                Amenities
                            </Label>
                            <p className="mt-1 text-gray-800">
                                {roomType.amenities || "No amenities listed."}
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                            <div>
                                <Label className="text-sm font-semibold text-gray-500">
                                    Price
                                </Label>
                                <p className="mt-1 text-lg font-bold text-gray-800">
                                    ${parseFloat(roomType.price).toFixed(2)}{" "}
                                    <span className="text-sm font-normal">
                                        / night
                                    </span>
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-semibold text-gray-500 flex items-center">
                                    <Users className="w-4 h-4 mr-1" /> Adults
                                </Label>
                                <p className="mt-1 text-lg font-bold text-gray-800">
                                    {roomType.capacity_adults}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-semibold text-gray-500 flex items-center">
                                    <Baby className="w-4 h-4 mr-1" /> Children
                                </Label>
                                <p className="mt-1 text-lg font-bold text-gray-800">
                                    {roomType.capacity_children}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const CreateRoomTypeDialog = ({ open, onOpenChange }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        price: "",
        capacity_adults: "",
        capacity_children: "",
        amenities: "",
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.room_types.store"), {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Room Type</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new room type.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacity_adults" className="text-right">
                            Adults
                        </Label>
                        <Input
                            id="capacity_adults"
                            type="number"
                            value={data.capacity_adults}
                            onChange={(e) =>
                                setData("capacity_adults", e.target.value)
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                            htmlFor="capacity_children"
                            className="text-right"
                        >
                            Children
                        </Label>
                        <Input
                            id="capacity_children"
                            type="number"
                            value={data.capacity_children}
                            onChange={(e) =>
                                setData("capacity_children", e.target.value)
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amenities" className="text-right">
                            Amenities
                        </Label>
                        <Input
                            id="amenities"
                            value={data.amenities}
                            onChange={(e) =>
                                setData("amenities", e.target.value)
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">
                            Image
                        </Label>
                        <Input
                            id="image"
                            type="file"
                            onChange={(e) =>
                                setData("image", e.target.files[0])
                            }
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Add Room Type
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const EditRoomTypeDialog = ({ roomType, open, onOpenChange }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: "PUT",
        name: roomType?.name || "",
        description: roomType?.description || "",
        price: roomType?.price || "",
        capacity_adults: roomType?.capacity_adults || "",
        capacity_children: roomType?.capacity_children || "",
        amenities: roomType?.amenities || "",
        image: null,
    });

    useEffect(() => {
        if (roomType) {
            setData({
                _method: "PUT",
                name: roomType.name,
                description: roomType.description,
                price: roomType.price,
                capacity_adults: roomType.capacity_adults,
                capacity_children: roomType.capacity_children,
                amenities: roomType.amenities,
                image: null,
            });
        }
    }, [roomType]);

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.room_types.update", { roomType: roomType.id }), {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Room Type</DialogTitle>
                    <DialogDescription>
                        Make changes to the room type here. Click save when
                        you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacity_adults" className="text-right">
                            Adults
                        </Label>
                        <Input
                            id="capacity_adults"
                            type="number"
                            value={data.capacity_adults}
                            onChange={(e) =>
                                setData("capacity_adults", e.target.value)
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                            htmlFor="capacity_children"
                            className="text-right"
                        >
                            Children
                        </Label>
                        <Input
                            id="capacity_children"
                            type="number"
                            value={data.capacity_children}
                            onChange={(e) =>
                                setData("capacity_children", e.target.value)
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amenities" className="text-right">
                            Amenities
                        </Label>
                        <Input
                            id="amenities"
                            value={data.amenities}
                            onChange={(e) =>
                                setData("amenities", e.target.value)
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">
                            Image
                        </Label>
                        <Input
                            id="image"
                            type="file"
                            onChange={(e) =>
                                setData("image", e.target.files[0])
                            }
                            className="col-span-3"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const DeleteRoomTypeAlert = ({ roomType, open, onOpenChange, onConfirm }) => {
    const [password, setPassword] = useState("");

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the room type.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                    <Label htmlFor="password">
                        Please enter your password to confirm:
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm(password)}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const RoomTypes = ({ roomTypes, flash, errors }) => {
    const [isAddRoomTypeModalOpen, setAddRoomTypeModalOpen] = useState(false);
    const [isEditRoomTypeDialogOpen, setEditRoomTypeDialogOpen] =
        useState(false);
    const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        if (flash?.success) {
            toast({
                title: "Success",
                description: flash.success,
            });
        }
        if (flash?.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: flash.error,
            });
        }
        if (errors?.password) {
            toast({
                variant: "destructive",
                title: "Error",
                description: errors.password,
            });
        }
    }, [flash, errors]);

    const handleViewDetails = (roomType) => {
        setSelectedRoomType(roomType);
        setDetailsModalOpen(true);
    };

    const handleEdit = (roomType) => {
        setSelectedRoomType(roomType);
        setEditRoomTypeDialogOpen(true);
    };

    const handleDelete = (roomType) => {
        setSelectedRoomType(roomType);
        setDeleteAlertOpen(true);
    };

    const confirmDelete = (password) => {
        router.delete(
            route("admin.room_types.destroy", {
                roomType: selectedRoomType.id,
            }),
            {
                data: { password },
                onSuccess: () => setDeleteAlertOpen(false),
            }
        );
    };

    return (
        <AdminLayout>
            <Toaster />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Room Types
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage all available room categories and their
                            details.
                        </p>
                    </div>
                    <Button onClick={() => setAddRoomTypeModalOpen(true)}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add New Room Type
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {roomTypes.map((type) => (
                        <div
                            key={type.id}
                            className="bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-hidden flex flex-col"
                        >
                            <div
                                className="relative cursor-pointer"
                                onClick={() => handleViewDetails(type)}
                            >
                                <ImageWithFallback
                                    src={type.image_url}
                                    alt={type.name}
                                    className="h-48 w-full object-cover"
                                />
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <div
                                    className="cursor-pointer flex-grow"
                                    onClick={() => handleViewDetails(type)}
                                >
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {type.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 flex-grow">
                                        {type.description}
                                    </p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleEdit(type)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(type)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CreateRoomTypeDialog
                open={isAddRoomTypeModalOpen}
                onOpenChange={setAddRoomTypeModalOpen}
            />

            {selectedRoomType && (
                <RoomTypeDetailsModal
                    roomType={selectedRoomType}
                    open={isDetailsModalOpen}
                    onOpenChange={setDetailsModalOpen}
                />
            )}

            {selectedRoomType && (
                <EditRoomTypeDialog
                    roomType={selectedRoomType}
                    open={isEditRoomTypeDialogOpen}
                    onOpenChange={setEditRoomTypeDialogOpen}
                />
            )}

            {selectedRoomType && (
                <DeleteRoomTypeAlert
                    roomType={selectedRoomType}
                    open={isDeleteAlertOpen}
                    onOpenChange={setDeleteAlertOpen}
                    onConfirm={confirmDelete}
                />
            )}
        </AdminLayout>
    );
};

export default RoomTypes;
