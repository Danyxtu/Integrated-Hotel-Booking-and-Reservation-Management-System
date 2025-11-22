import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import axios from "axios";

const CreateBookingModal = ({ show, onClose }) => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const [selectedRoom, setSelectedRoom] = useState(null);

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

    useEffect(() => {
        if (show) {
            axios.get(route("admin.room_types.index")).then((response) => {
                setRoomTypes(response.data.room_types);
            });
        }
    }, [show]);

    const handleCheckAvailability = () => {
        axios
            .post(route("admin.bookings.walkin.check"), {
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
                room_type: selectedRoomType,
                check_in_date: data.check_in_date,
                check_out_date: data.check_out_date,
            })
            .then((response) => {
                setAvailableRooms(response.data);
                if (response.data.length > 0) {
                    const room = response.data[0];
                    setSelectedRoom(room);
                    setData("room_id", room.id);
                    const price = calculatePrice(
                        room,
                        data.check_in_date,
                        data.check_out_date
                    );
                    setData("total_price", price);
                } else {
                    alert(
                        "No available rooms for the selected dates and room type."
                    );
                }
            })
            .catch((error) => {
                console.error(error);
                alert(error.response.data.message);
            });
    };

    const calculatePrice = (room, checkIn, checkOut) => {
        if (!room || !checkIn || !checkOut) return 0;
        const oneDay = 24 * 60 * 60 * 1000;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const diffDays = Math.round(
            Math.abs((checkInDate - checkOutDate) / oneDay)
        );
        const roomType = roomTypes.find((rt) => rt.id === room.room_type_id);
        return diffDays * (roomType ? roomType.price : 0);
    };

    useEffect(() => {
        if (selectedRoom) {
            const price = calculatePrice(
                selectedRoom,
                data.check_in_date,
                data.check_out_date
            );
            setData("total_price", price);
        }
    }, [data.check_in_date, data.check_out_date, selectedRoom]);

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
        <Modal show={show} onClose={onClose} maxWidth="xl">
            <form onSubmit={submit} className="p-6 space-y-4">
                <h2 className="text-lg font-medium text-gray-900">
                    Create Booking
                </h2>

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

                <div>
                    <InputLabel htmlFor="room_type" value="Room Type" />
                    <select
                        id="room_type"
                        value={selectedRoomType}
                        onChange={(e) => setSelectedRoomType(e.target.value)}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        required
                    >
                        <option value="">Select Room Type</option>
                        {roomTypes.map((rt) => (
                            <option key={rt.id} value={rt.id}>
                                {rt.name}
                            </option>
                        ))}
                    </select>
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

                <div className="mt-6">
                    <PrimaryButton
                        type="button"
                        onClick={handleCheckAvailability}
                    >
                        Check Availability
                    </PrimaryButton>
                </div>

                {availableRooms.length > 0 && (
                    <>
                        <div>
                            <InputLabel
                                htmlFor="room_id"
                                value="Available Rooms"
                            />
                            <select
                                id="room_id"
                                value={data.room_id}
                                onChange={(e) => {
                                    const room = availableRooms.find(
                                        (r) => r.id === parseInt(e.target.value)
                                    );
                                    setSelectedRoom(room);
                                    setData("room_id", e.target.value);
                                }}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Select Room</option>
                                {availableRooms.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.room_number}
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
                            <InputLabel
                                htmlFor="total_price"
                                value="Total Price"
                            />
                            <TextInput
                                id="total_price"
                                type="number"
                                value={data.total_price}
                                readOnly
                                className="mt-1 block w-full bg-gray-100"
                            />
                        </div>
                    </>
                )}

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
