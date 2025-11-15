import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useState, useEffect } from "react";
import MyMap from "@/Components/MyMap";
import BreadcrumbIcon from "@/Components/BreadCrumbs";
import { MapPinned, MapPinX } from "lucide-react";

export default function CreateHotel({ auth }) {
    // --- State for map toggle and coordinates ---
    const [mapVisible, setMapVisible] = useState(false);
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

    // --- Inertia form setup ---
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        address: "",
        city: "",
        country: "",
        cover_image_url: "",
        latitude: "",
        longitude: "",
        email: "",
        phone: "",
        website: "",
    });

    // --- Fetch address from coordinates (reverse geocoding) ---
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
            const data = await res.json();

            setData("address", data.address?.road || "");
            setData("city", data.address?.city || data.address?.town || "");
            setData("country", data.address?.country || "");
            setData("latitude", lat);
            setData("longitude", lng);
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
        }
    };

    // --- Form submission ---
    const submit = (e) => {
        e.preventDefault();
        post(route("admin.hotels.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <nav className="flex items-center text-sm font-medium">
                        <Link
                            href={route("admin.hotels.index")}
                            className="text-gray-500 hover:underline"
                        >
                            Hotels
                        </Link>
                        <BreadcrumbIcon />
                        <span className="text-amber-600">Add New Hotel</span>
                    </nav>
                    <h2 className="mt-2 text-2xl font-bold leading-tight text-amber-900 dark:text-white">
                        Add New Hotel
                    </h2>
                </div>
            }
        >
            <Head title="Create New Hotel" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-lg">
                        <form onSubmit={submit} className="p-6 md:p-8">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Hotel Details
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Fill in the basic information for the new hotel
                                property.
                            </p>

                            <div className="space-y-6">
                                {/* Hotel Name */}
                                <div>
                                    <InputLabel
                                        htmlFor="name"
                                        value="Hotel Name"
                                    />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <InputLabel
                                        htmlFor="description"
                                        value="Description"
                                    />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-amber-500 dark:focus:border-amber-600 focus:ring-amber-500 dark:focus:ring-amber-600 rounded-md shadow-sm"
                                        rows="4"
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        required
                                    ></textarea>
                                    <InputError
                                        message={errors.description}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <InputLabel
                                            htmlFor="email"
                                            value="Email"
                                        />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="phone"
                                            value="Phone"
                                        />
                                        <TextInput
                                            id="phone"
                                            type="text"
                                            name="phone"
                                            value={data.phone}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.phone}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="website"
                                            value="Website"
                                        />
                                        <TextInput
                                            id="website"
                                            type="url"
                                            name="website"
                                            value={data.website}
                                            className="mt-1 block w-full"
                                            placeholder="https://example.com"
                                            onChange={(e) =>
                                                setData(
                                                    "website",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.website}
                                            className="mt-2"
                                        />
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

                                {mapVisible && (
                                    <div className="mb-6">
                                        <MyMap
                                            onLocationSelect={setCoordinates}
                                        />
                                    </div>
                                )}

                                {/* Address Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel
                                            htmlFor="address"
                                            value="Street Address"
                                        />
                                        <TextInput
                                            id="address"
                                            type="text"
                                            name="address"
                                            value={data.address}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.address}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="city"
                                            value="City"
                                        />
                                        <TextInput
                                            id="city"
                                            type="text"
                                            name="city"
                                            value={data.city}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("city", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.city}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="country"
                                        value="Country"
                                    />
                                    <TextInput
                                        id="country"
                                        type="text"
                                        name="country"
                                        value={data.country}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("country", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.country}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Coordinates Display */}
                                {coordinates.lat && coordinates.lng && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        <p>
                                            📍 Latitude:{" "}
                                            {coordinates.lat.toFixed(6)}
                                        </p>
                                        <p>
                                            📍 Longitude:{" "}
                                            {coordinates.lng.toFixed(6)}
                                        </p>
                                    </div>
                                )}

                                {/* Cover Image URL */}
                                <div>
                                    <InputLabel
                                        htmlFor="cover_image_url"
                                        value="Cover Image URL"
                                    />
                                    <TextInput
                                        id="cover_image_url"
                                        type="url"
                                        name="cover_image_url"
                                        value={data.cover_image_url}
                                        className="mt-1 block w-full"
                                        placeholder="https://images.unsplash.com/..."
                                        onChange={(e) =>
                                            setData(
                                                "cover_image_url",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        Paste a URL to a photo. File uploads
                                        will be added later.
                                    </p>
                                    <InputError
                                        message={errors.cover_image_url}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Link
                                    href={route("admin.hotels.index")}
                                    className="mr-4"
                                >
                                    <SecondaryButton>Cancel</SecondaryButton>
                                </Link>

                                <PrimaryButton disabled={processing}>
                                    {processing
                                        ? "Creating..."
                                        : "Create Hotel"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
