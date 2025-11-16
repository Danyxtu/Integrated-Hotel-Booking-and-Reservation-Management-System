import React, { useEffect, useMemo } from "react";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";
import InputError from "./InputError";
import { useForm } from "@inertiajs/react";

const AddRoomModal = ({ hotel, onClose }) => {
    const { data, setData, post, processing, errors, reset, wasSuccessful } =
        useForm({
            room_type_id: hotel.room_types[0]?.id || "",
            room_number: "",
        });

    const roomCounts = useMemo(() => {
        return (hotel.rooms || []).reduce((acc, room) => {
            acc[room.room_type_id] = (acc[room.room_type_id] || 0) + 1;
            return acc;
        }, {});
    }, [hotel.rooms]);

    const selectedRoomTypeName =
        hotel.room_types.find((rt) => rt.id == data.room_type_id)?.name ||
        "Unknown";

    useEffect(() => {
        if (wasSuccessful) reset("room_number");
    }, [wasSuccessful, reset]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.hotels.rooms.store", { hotel: hotel.id }), {
            preserveScroll: true,
            onError: (err) => console.error("AddRoomModal error:", err),
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-xl p-8 border-t-4 border-green-600 dark:border-green-500">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🔑</span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Add New Room
                    </h2>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <InputLabel htmlFor="room_type_id" value="Room Type" />
                        <select
                            id="room_type_id"
                            value={data.room_type_id}
                            onChange={(e) =>
                                setData("room_type_id", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                            required
                        >
                            {hotel.room_types.length > 0 ? (
                                hotel.room_types.map((rt) => (
                                    <option key={rt.id} value={rt.id}>
                                        {rt.name}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>
                                    Please add a Room Type first
                                </option>
                            )}
                        </select>
                        <InputError message={errors.room_type_id} />
                        {data.room_type_id && (
                            <p className="text-sm text-gray-500 mt-2">
                                You currently have{" "}
                                <strong>
                                    {roomCounts[data.room_type_id] || 0}
                                </strong>{" "}
                                rooms of the "
                                <strong>{selectedRoomTypeName}</strong>" type.
                            </p>
                        )}
                    </div>

                    <div>
                        <InputLabel htmlFor="room_number" value="Room Number" />
                        <TextInput
                            id="room_number"
                            value={data.room_number}
                            onChange={(e) =>
                                setData("room_number", e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.room_number} />
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <SecondaryButton type="button" onClick={onClose}>
                            Close
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? "Adding..." : "Add Room"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoomModal;
