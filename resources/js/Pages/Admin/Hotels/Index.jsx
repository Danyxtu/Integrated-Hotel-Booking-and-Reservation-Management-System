import Pagination from "@/Components/Pagination";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// (BreadcrumbIcon component remains the same)
const BreadcrumbIcon = () => (
    <svg
        className="w-5 h-5 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
        />
    </svg>
);

export default function Index({ auth, hotels }) {
    console.log("Hotels data:", hotels);

    const handleDelete = (hotel) => {
        if (
            confirm(
                `Are you sure you want to delete the hotel "${hotel.name}"? This action cannot be undone.`
            )
        ) {
            router.delete(route("admin.hotels.destroy", hotel.id), {
                preserveScroll: true,
            });
        }
    };

    return (
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
                            + Create New Hotel
                        </button>
                    </Link>
                </div>
            }
        >
            <Head title="Manage Hotels" />

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
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3"
                                        >
                                            <span className="sr-only">
                                                Actions
                                            </span>
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
                                                onClick={() =>
                                                    router.visit(
                                                        route(
                                                            "admin.hotels.show",
                                                            hotel.id
                                                        )
                                                    )
                                                }
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
                                                    {/* {hotel.room_types_count} */}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                    {/* {hotel.rooms_count} */}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                    <Link
                                                        // href={route(
                                                        //     "admin.hotels.edit",
                                                        //     hotel.id
                                                        // )}
                                                        className="text-amber-600 hover:text-amber-800"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(hotel)
                                                        }
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
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

                        {/* --- DEFENSIVE CHECK --- */}
                        {/* Use optional chaining here. If hotels or hotels.links is undefined, */}
                        {/* it will pass `undefined` to Pagination, which our new check handles. */}
                        <Pagination links={hotels?.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
