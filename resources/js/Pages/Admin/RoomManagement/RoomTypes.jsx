import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { PlusCircle, Edit, Trash2, Users, DollarSign, BedDouble, Wifi, Tv, Wind, Bath } from "lucide-react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";

// New component for adding room types
const CreateRoomTypeModal = ({ show, onClose }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.room_types.store"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="xl">
            <form onSubmit={submit} className="p-6 space-y-4">
                <h2 className="text-lg font-medium text-gray-900">
                    Add New Room Type
                </h2>

                <div>
                    <InputLabel htmlFor="name" value="Room Type Name" />
                    <TextInput
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <InputLabel htmlFor="description" value="Description" />
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        rows="3"
                    ></textarea>
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Add Room Type
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};


const RoomTypes = ({ roomTypes }) => {
    const [isAddRoomTypeModalOpen, setAddRoomTypeModalOpen] = useState(false);

    const handleEdit = (id) => {
        console.log(`Edit room type: ${id}`);
        // In a real app, this would open a form to edit the room type
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this room type?")) {
            // For now, just logging. Will need Inertia delete call.
            console.log(`Delete room type: ${id}`);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Room Types</h1>
                        <p className="text-gray-500 mt-1">Manage all available room categories and their details.</p>
                    </div>
                    <button
                        onClick={() => setAddRoomTypeModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
                        <PlusCircle className="w-4 h-4" />
                        Add New Room Type
                    </button>
                </div>

                {/* Room Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {roomTypes.length > 0 ? (
                        roomTypes.map(type => (
                            <div key={type.id} className="bg-white rounded-2xl shadow-md border border-gray-200/80 overflow-hidden flex flex-col">
                                <div className="relative">
                                    {/* <img src={type.imageUrl} alt={type.name} className="h-48 w-full object-cover"/> */}
                                    {/* Using a placeholder image or removing it, as imageUrl is not from DB */}
                                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                </div>
                                <div className="p-4 flex-grow flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-800">{type.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1 flex-grow">{type.description}</p>
                                    
                                    {/* Removed price, capacity, amenities display */}
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(type.id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                                            title="Edit Room Type"
                                        >
                                            <Edit className="w-4 h-4"/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(type.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                                            title="Delete Room Type"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="lg:col-span-4 text-center py-10 bg-white rounded-2xl shadow-md border border-gray-200/80">
                            <p className="text-gray-500">No room types found.</p>
                        </div>
                    )}
                </div>
            </div>
            <CreateRoomTypeModal
                show={isAddRoomTypeModalOpen}
                onClose={() => setAddRoomTypeModalOpen(false)}
            />
        </AdminLayout>
    );
};

export default RoomTypes;