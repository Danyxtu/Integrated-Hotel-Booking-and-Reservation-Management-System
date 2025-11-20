import React from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

const CreateBookingModal = ({ show, onClose, rooms }) => {
    // Add a guard clause for rooms
    if (!Array.isArray(rooms)) {
        console.error("CreateBookingModal received invalid rooms prop:", rooms);
        return null; // Or render a fallback UI
    }

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        phone: "",
        room_id: "",
        check_in_date: "",
        check_out_date: "",
        total_price: "",
        status: "Pending",
    });

    const submit = (e) => {
        e.preventDefault();
        // Post to the backend; backend will create customer and booking
        post(route("admin.bookings.store"), {
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
                    Create Booking
                </h2>

                {/* Walk-in Customer Info */}
                <div className="flex justify-between gap-2">
                    <div className="w-1/2">
                        <InputLabel htmlFor="first_name" value="First Name" />
                        <TextInput
                            id="first_name"
                            type="text"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            className="mt-1 block w-full"
                            required
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.first_name}
                            </p>
                        )}
                    </div>

                    <div className="w-1/2">
                        <InputLabel htmlFor="last_name" value="Last Name" />
                        <TextInput
                            id="last_name"
                            type="text"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            className="mt-1 block w-full"
                            required
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.last_name}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Phone Number" />
                    <TextInput
                        id="phone"
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* Room Selection */}
                <div>
                    <InputLabel htmlFor="room_id" value="Room" />
                    <select
                        id="room_id"
                        value={data.room_id}
                        onChange={(e) => setData("room_id", e.target.value)}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        required
                    >
                        <option value="">Select Room</option>
                        {rooms.map((r) => (
                            // Conditional rendering for valid room objects
                            r && r.id && r.room_type?.name ? (
                                <option key={r.id} value={r.id}>
                                    {r.room_type.name} - {r.room_number}
                                </option>
                            ) : null
                        ))}
                    </select>
                    {errors.room_id && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.room_id}
                        </p>
                    )}
                </div>

                {/* Booking Dates */}
                <div>
                    <InputLabel htmlFor="check_in_date" value="Check-in Date" />
                    <TextInput
                        id="check_in_date"
                        type="date"
                        value={data.check_in_date}
                        onChange={(e) =>
                            setData("check_in_date", e.target.value)
                        }
                        className="mt-1 block w-full"
                        required
                    />
                    {errors.check_in_date && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.check_in_date}
                        </p>
                    )}
                </div>

                <div>
                    <InputLabel
                        htmlFor="check_out_date"
                        value="Check-out Date"
                    />
                    <TextInput
                        id="check_out_date"
                        type="date"
                        value={data.check_out_date}
                        onChange={(e) =>
                            setData("check_out_date", e.target.value)
                        }
                        className="mt-1 block w-full"
                        required
                    />
                    {errors.check_out_date && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.check_out_date}
                        </p>
                    )}
                </div>

                <div>
                    <InputLabel htmlFor="total_price" value="Total Price" />
                    <TextInput
                        id="total_price"
                        type="number"
                        value={data.total_price}
                        onChange={(e) => setData("total_price", e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />
                    {errors.total_price && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.total_price}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Create Booking
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default CreateBookingModal;
