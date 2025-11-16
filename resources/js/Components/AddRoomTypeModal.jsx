import React, { useEffect } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { useForm } from "@inertiajs/react";

const AddRoomTypeModal = ({ hotelId, onClose, onSuccess, lookups }) => {
    const { data, setData, post, processing, errors, reset, wasSuccessful } =
        useForm({
            name: "",
            lookup_id: "",
            description: "",
            price_per_night: "",
            capacity_adults: "",
            capacity_children: "",
            hotel_id: hotelId || "",
        });

    useEffect(() => {
        if (wasSuccessful) {
            reset();
            onClose?.();
            onSuccess?.();
        }
    }, [wasSuccessful, reset, onClose, onSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hotelId) {
            console.error("MODAL: Hotel ID missing. Halting submission.");
            return;
        }

        const targetRoute = route("admin.hotels.room_types.store", {
            hotel: hotelId,
        });

        post(targetRoute, {
            onError: (err) => {
                console.error("MODAL: post() onError fired:", err);
            },
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-xl p-8 border-t-4 border-blue-600 dark:border-blue-500">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Add New Room Type
                    </h2>
                </div>

                <form className="space-y-6">
                    <div>
                        <InputLabel
                            htmlFor="lookup_id"
                            value="Room Type Preset"
                        />

                        <select
                            id="lookup_id"
                            value={data.lookup_id}
                            onChange={(e) => {
                                const value = e.target.value;
                                setData("lookup_id", value);

                                if (value === "custom") {
                                    setData({
                                        ...data,
                                        lookup_id: null,
                                        name: "",
                                        description: "",
                                        price_per_night: "",
                                        capacity_adults: "",
                                        capacity_children: "",
                                    });
                                    return;
                                }

                                const selected = lookups.find(
                                    (l) => l.id == value
                                );
                                if (selected) {
                                    setData({
                                        ...data,
                                        lookup_id: selected.id,
                                        name: selected.name,
                                        description:
                                            selected.default_description,
                                        price_per_night: selected.default_price,
                                        capacity_adults:
                                            selected.default_capacity_adults,
                                        capacity_children:
                                            selected.default_capacity_children,
                                    });
                                }
                            }}
                            className="w-full border rounded p-2"
                        >
                            <option value="">— Select Preset —</option>

                            {lookups.map((lookup) => (
                                <option key={lookup.id} value={lookup.id}>
                                    {lookup.name}
                                </option>
                            ))}

                            <option value="custom" className="font-bold">
                                + Custom Room Type
                            </option>
                        </select>

                        <InputError message={errors.lookup_id} />
                    </div>

                    <div>
                        <InputLabel htmlFor="name" value="Room Type" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows={3}
                            // disabled={!isCustom}
                            className="w-full border rounded p-2"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="price_per_night"
                            value="Price per Night"
                        />
                        <TextInput
                            id="price_per_night"
                            type="number"
                            min="0"
                            value={data.price_per_night}
                            // disabled={!isCustom}
                            onChange={(e) =>
                                setData("price_per_night", e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.price_per_night} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="capacity_adults"
                                value="Adults"
                            />
                            <TextInput
                                id="capacity_adults"
                                type="number"
                                min="1"
                                value={data.capacity_adults}
                                // disabled={!isCustom}
                                onChange={(e) =>
                                    setData("capacity_adults", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.capacity_adults} />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="capacity_children"
                                value="Children"
                            />
                            <TextInput
                                id="capacity_children"
                                type="number"
                                min="0"
                                value={data.capacity_children}
                                // disabled={!isCustom}
                                onChange={(e) =>
                                    setData("capacity_children", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.capacity_children} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <SecondaryButton onClick={onClose}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                        >
                            {processing ? "Adding..." : "Add Room Type"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoomTypeModal;
