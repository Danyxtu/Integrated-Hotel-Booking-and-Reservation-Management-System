import Pagination from "@/Components/Pagination";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { toast } from "sonner";
import { useState } from "react";
import Delete from "../../../Components/Delete";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

export default function Index({ auth, hotels }) {
    const [toastVisibilty, setToastVisibility] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [open, setOpen] = useState(false);
    const displayData = (data, fallback = "—") => data || fallback;

    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <>
            <AuthenticatedLayout
                user={auth}
                header={
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="mt-2 text-2xl font-bold leading-tight text-amber-900 dark:text-white">
                                Hotel Inventory
                            </h2>
                        </div>
                        <Link href={route("admin.hotels.create")}>
                            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium shadow-md">
                                + New Hotel
                            </button>
                        </Link>
                    </div>
                }
            >
                <Head title="Manage Hotels" />
                {toastVisibilty && (
                    <Toast
                        message="Hotel deleted successfully."
                        onClose={() => setToastVisibility(false)}
                    />
                )}

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        {/* (Table header remains the same) */}
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Hotel Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Location
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Room Types
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Total Rooms
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {/* --- DEFENSIVE CHECK --- */}
                                        {/* Check if hotels.data is an array and has items */}
                                        {hotels?.data?.length > 0 ? (
                                            hotels.data.map((hotel) => (
                                                <tr
                                                    key={hotel.id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 hover:cursor-pointer"
                                                    onClick={() => {
                                                        router.visit(
                                                            route(
                                                                "admin.hotels.show",
                                                                hotel.id
                                                            )
                                                        );
                                                        console.log(
                                                            "this is being clicked"
                                                        );
                                                    }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {hotel.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                                            {hotel.city},{" "}
                                                            {hotel.country}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {displayData(
                                                            hotel.room_types_count
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {displayData(
                                                            hotel.rooms_count
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            // --- ELSE ---
                                            // Render a fallback row if no hotels are found
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-300"
                                                >
                                                    No hotels found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={hotels?.links} />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            {open && (
                <Delete
                    open={open}
                    setOpen={setOpen}
                    selectedHotel={selectedHotel}
                />
            )}
        </>
    );
}
