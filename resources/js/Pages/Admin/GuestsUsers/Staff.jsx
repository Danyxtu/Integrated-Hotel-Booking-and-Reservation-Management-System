import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Search, PlusCircle, Eye, Edit, Trash2, FileText, UserCog, ShieldCheck } from "lucide-react";

// Mock data for staff
const mockStaff = [
    { id: 'S001', name: 'Admin User', email: 'admin@gmail.com', phone: '+1-202-555-0104', role: 'Admin', lastLogin: '2025-11-20 09:00 AM', status: 'Active' },
    { id: 'S002', name: 'Manager Mike', email: 'manager.mike@example.com', phone: '+1-315-555-0125', role: 'Manager', lastLogin: '2025-11-20 08:45 AM', status: 'Active' },
    { id: 'S003', name: 'Receptionist Rachel', email: 'rachel.r@example.com', phone: '+1-415-555-0189', role: 'Front Desk', lastLogin: '2025-11-19 11:30 PM', status: 'Active' },
    { id: 'S004', name: 'Housekeeper Harry', email: 'harry.h@example.com', phone: '+1-650-555-0143', role: 'Housekeeping', lastLogin: '2025-11-19 07:00 AM', status: 'Inactive' },
];

const staffRoles = ['All', 'Admin', 'Manager', 'Front Desk', 'Housekeeping'];

const roleStyles = {
    Admin: 'bg-red-100 text-red-800',
    Manager: 'bg-purple-100 text-purple-800',
    'Front Desk': 'bg-blue-100 text-blue-800',
    Housekeeping: 'bg-green-100 text-green-800',
};

const Staff = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    const filteredStaff = mockStaff.filter(staff => {
        const roleMatch = roleFilter === 'All' || staff.role === roleFilter;
        const searchMatch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            staff.email.toLowerCase().includes(searchTerm.toLowerCase());
        return roleMatch && searchMatch;
    });

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Staff Members</h1>
                        <p className="text-gray-500 mt-1">Manage staff accounts, roles, and permissions.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
                        <PlusCircle className="w-4 h-4" />
                        Add New Staff
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {staffRoles.map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                                    roleFilter === role
                                        ? "bg-blue-600 text-white shadow"
                                        : "bg-white text-gray-600 hover:bg-gray-100 border"
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
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
                </div>

                {/* Staff Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200/80">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">Name</th>
                                <th scope="col" className="px-6 py-4">Contact</th>
                                <th scope="col" className="px-6 py-4">Role</th>
                                <th scope="col" className="px-6 py-4">Last Login</th>
                                <th scope="col" className="px-6 py-4 text-center">Status</th>
                                <th scope="col" className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredStaff.length > 0 ? (
                                filteredStaff.map((staff) => (
                                    <tr key={staff.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-semibold text-gray-800">{staff.name}</td>
                                        <td className="px-6 py-4">
                                            <div>{staff.email}</div>
                                            <div className="text-xs text-gray-500">{staff.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleStyles[staff.role]}`}>
                                                {staff.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{staff.lastLogin}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                staff.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {staff.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition" title="Manage Permissions">
                                                    <UserCog className="w-4 h-4"/>
                                                </button>
                                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition" title="Edit Staff">
                                                    <Edit className="w-4 h-4"/>
                                                </button>
                                                <button className="p-2 text-red-500 hover:bg-red-50 rounded-md transition" title="Delete Staff">
                                                    <Trash2 className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="w-10 h-10 text-gray-400 mb-2"/>
                                            <p className="font-semibold">No staff members found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Staff;