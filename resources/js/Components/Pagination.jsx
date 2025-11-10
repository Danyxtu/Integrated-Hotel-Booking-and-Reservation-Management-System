import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (links.length <= 3) return null; // Don't render if only 3 links (prev, current, next)

    return (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
                <Link
                    href={links[0].url}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                        !links[0].url ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!links[0].url}
                >
                    Previous
                </Link>
                <Link
                    href={links[links.length - 1].url}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                        !links[links.length - 1].url
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                    disabled={!links[links.length - 1].url}
                >
                    Next
                </Link>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                    >
                        {links.map((link, index) => (
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
                                    ${
                                        !link.url
                                            ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-900"
                                            : ""
                                    }
                                `}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                as="button" // Use 'as="button"' for better accessibility
                                disabled={!link.url}
                            />
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}
