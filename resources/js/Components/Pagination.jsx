import React from "react";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Pagination({ links }) {
    // --- DEFENSIVE CHECK ---
    if (!Array.isArray(links) || links.length <= 3) {
        return null;
    }

    const firstLink = links[0];
    const lastLink = links[links.length - 1];

    return (
        <AuthenticatedLayout>
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6">
                {/* Mobile */}
                <div className="flex-1 flex justify-between sm:hidden">
                    {firstLink.url ? (
                        <Link
                            href={firstLink.url}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            as="button"
                        >
                            Previous
                        </Link>
                    ) : (
                        <span className="relative inline-flex items-center px-4 py-2 border bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed rounded-md">
                            Previous
                        </span>
                    )}

                    {lastLink.url ? (
                        <Link
                            href={lastLink.url}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            as="button"
                        >
                            Next
                        </Link>
                    ) : (
                        <span className="ml-3 relative inline-flex items-center px-4 py-2 border bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed rounded-md">
                            Next
                        </span>
                    )}
                </div>

                {/* Desktop */}
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                        >
                            {links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                        ${
                                            link.active
                                                ? "z-10 bg-amber-50 border-amber-500 text-amber-600"
                                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                                        }
                                        ${index === 0 ? "rounded-l-md" : ""}
                                        ${
                                            index === links.length - 1
                                                ? "rounded-r-md"
                                                : ""
                                        }
                                    `}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        as="button"
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className={`relative inline-flex items-center px-4 py-2 border bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed
                                        ${index === 0 ? "rounded-l-md" : ""}
                                        ${
                                            index === links.length - 1
                                                ? "rounded-r-md"
                                                : ""
                                        }
                                    `}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )
                            )}
                        </nav>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
