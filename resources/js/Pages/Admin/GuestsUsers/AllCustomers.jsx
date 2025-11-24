import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Search, PlusCircle, Eye, Edit, Trash2, FileText } from "lucide-react";
import UserDetailsModal from "./UserDetailsModal"; // Import the UserDetailsModal

const AllCustomers = ({ customers }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All"); // 'All', 'Guest', 'Users'
    const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.first_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            customer.last_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone?.includes(searchTerm); // Added optional chaining for phone

        const matchesFilter =
            activeFilter === "All" ||
            (activeFilter === "Guest" && customer.user_id === null) ||
            (activeFilter === "Users" && customer.user_id !== null);

        return matchesSearch && matchesFilter;
    });

    const handleViewDetails = (customer) => {
        // Here, we assume the 'customer' object passed to AllCustomers also contains
        // the full user object if user_id is present.
        // Or, we might need to fetch the full user object if the customer data is partial.
        // For now, let's assume 'customer' can be directly passed as 'user' to UserDetailsModal
        // as the modal is designed to handle a 'user' prop that might include customer details.
        setSelectedUser({
            ...customer,
            role: customer.user_id ? "user" : "guest",
        }); // Assign a role for modal logic
        setIsUserDetailsModalOpen(true);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            All Customers
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage customer information and their linked
                            accounts.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    </div>
                </div>

                {/* Filtering system */}
                <div className="flex items-center gap-2">
                    {["All", "Guest", "Users"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                                activeFilter === filter
                                    ? "bg-blue-600 text-white shadow"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border"
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200/80">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Contact
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Account Type
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-center"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 font-mono text-blue-600">
                                            {customer.id}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">
                                            {customer.first_name}{" "}
                                            {customer.last_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{customer.email || "N/A"}</div>
                                            <div className="text-xs text-gray-500">
                                                {customer.phone || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {customer.user_id ? (
                                                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    User Account
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Guest
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleViewDetails(
                                                            customer
                                                        )
                                                    }
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition"
                                                    title="Edit Customer"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition"
                                                    title="Delete Customer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-10 text-center text-gray-500"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="w-10 h-10 text-gray-400 mb-2" />
                                            <p className="font-semibold">
                                                No customers found.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    show={isUserDetailsModalOpen}
                    onClose={() => setIsUserDetailsModalOpen(false)}
                />
            )}
        </AdminLayout>
    );
};

export default AllCustomers;
