import React from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { useForm } from "@inertiajs/react";

const AddRoomTypeModal = ({ hotelId, onClose, onSuccess }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        price_per_night: "",
        capacity_adults: "",
        capacity_children: "",
        hotel_id: hotelId || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("MODAL: handleSubmit triggered.");

        if (!hotelId) {
            console.error("MODAL: Hotel ID missing. Halting submission.");
            return;
        }
        console.log("MODAL: Hotel ID found:", hotelId);

        try {
            const targetRoute = route("admin.hotels.room_types.store", {
                id: hotelId,
            });
            console.log("MODAL: Target route calculated:", targetRoute);
            console.log("MODAL: Form data:", data);

            console.log("MODAL: Calling post()...");
            post(targetRoute, data, {
                onSuccess: (page) => {
                    // console.log("MODAL: post() onSuccess fired.");
                    // reset();

                    console.log("MODAL: Attempting to call onClose()...");
                    onClose?.(); // This should trigger the parent's log

                    console.log("MODAL: Attempting to call onSuccess()...");
                    onSuccess?.();
                },

                onError: (err) => {
                    console.error("MODAL: post() onError fired:", err);
                },

                onFinish: () => {
                    console.log("MODAL: post() onFinish fired (cleanup).");
                },
            });
            console.log("MODAL: post() call has been initiated.");
        } catch (error) {
            console.error("MODAL: A SYNCHRONOUS ERROR OCCURRED!", error);
            console.error(
                "This likely means the route() helper failed or 'post' itself threw an error."
            );
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-xl p-8 border-t-4 border-blue-600 dark:border-blue-500">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🏨</span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Add New Room Type
                    </h2>
                </div>

                <form className="space-y-6">
                    <div>
                        <InputLabel htmlFor="name" value="Room Type Name" />
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
