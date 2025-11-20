import React from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

const CreateBookingModal = ({ show, onClose, customers, rooms }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        customer_id: "",
        room_id: "",
        check_in_date: "",
        check_out_date: "",
        total_price: "",
        status: "pending",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.bookings.store"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6 space-y-4">
                <h2 className="text-lg font-medium text-gray-900">
                    Create New Booking
                </h2>

                <div>
                    <InputLabel htmlFor="customer_id" value="Customer" />
                    <select
                        id="customer_id"
                        value={data.customer_id}
                        onChange={(e) => setData("customer_id", e.target.value)}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        required
                    >
                        <option value="">Select Customer</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    {errors.customer_id && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.customer_id}
                        </p>
                    )}
                </div>

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
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                    {errors.room_id && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.room_id}
                        </p>
                    )}
                </div>

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
