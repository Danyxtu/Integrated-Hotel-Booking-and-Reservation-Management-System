import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Search, PlusCircle, Edit, Trash2, FileText, UserMinus, Eye } from "lucide-react";
import { useForm, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import UserDetailsModal from "./UserDetailsModal"; // Import the UserDetailsModal


// New component for adding admin
const CreateAdminModal = ({ show, onClose }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.users.storeAdmin"), {
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
                    Add New Admin
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
                        <InputError message={errors.first_name} className="mt-2" />
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
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Add Admin
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};


const Admins = ({ admins, loggedInUserId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddAdminModalOpen, setAddAdminModalOpen] = useState(false);
    const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const filteredAdmins = admins.filter(admin =>
        admin.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (adminId) => {
        if (confirm("Are you sure you want to delete this admin account?")) {
            router.delete(route('admin.users.delete', adminId));
        }
    };

    const handleViewDetails = (admin) => {
        setSelectedUser({ ...admin, role: 'admin' }); // Assign role for modal logic
        setIsUserDetailsModalOpen(true);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Admin Accounts</h1>
                        <p className="text-gray-500 mt-1">Manage administrative user accounts.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                        <button
                            onClick={() => setAddAdminModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
                            <PlusCircle className="w-4 h-4" />
                            Add New Admin
                        </button>
                    </div>
                </div>

                {/* Admins Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200/80">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">ID</th>
                                <th scope="col" className="px-6 py-4">Name</th>
                                <th scope="col" className="px-6 py-4">Email</th>
                                <th scope="col" className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAdmins.length > 0 ? (
                                filteredAdmins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-mono text-blue-600">{admin.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{admin.first_name} {admin.last_name}</td>
                                        <td className="px-6 py-4">{admin.email}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(admin)}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4"/>
                                                </button>
                                                {/* Edit button placeholder */}
                                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition" title="Edit Admin">
                                                    <Edit className="w-4 h-4"/>
                                                </button>
                                                {/* Delete button with restrictions */}
                                                <button
                                                    onClick={() => handleDelete(admin.id)}
                                                    disabled={admins.length === 1 || admin.id === loggedInUserId}
                                                    className={`p-2 rounded-md transition ${
                                                        admins.length === 1 || admin.id === loggedInUserId
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-red-500 hover:bg-red-50'
                                                    }`}
                                                    title={
                                                        admins.length === 1
                                                            ? 'Cannot delete the last admin'
                                                            : admin.id === loggedInUserId
                                                            ? 'Cannot delete your own account'
                                                            : 'Delete Admin'
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <UserMinus className="w-10 h-10 text-gray-400 mb-2"/>
                                            <p className="font-semibold">No admin accounts found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <CreateAdminModal
                show={isAddAdminModalOpen}
                onClose={() => setAddAdminModalOpen(false)}
            />
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

export default Admins;