import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { PlusCircle, Edit, Trash2, ShieldCheck, ShieldAlert, Shield } from "lucide-react";

// Mock data for roles and permissions
const mockRoles = [
    {
        id: 'admin',
        name: 'Administrator',
        description: 'Has full access to all system features and settings.',
        permissions: [
            'Manage Bookings', 'Manage Rooms', 'Manage Payments', 'Manage Guests',
            'Manage Staff', 'Manage Settings', 'View Reports', 'Override System'
        ]
    },
    {
        id: 'manager',
        name: 'Manager',
        description: 'Can manage daily operations, bookings, and staff.',
        permissions: [
            'Manage Bookings', 'Manage Rooms', 'Manage Guests',
            'Manage Staff', 'View Reports'
        ]
    },
    {
        id: 'front_desk',
        name: 'Front Desk Staff',
        description: 'Handles guest check-ins, check-outs, and new reservations.',
        permissions: [
            'Manage Bookings', 'View Availability', 'Process Payments'
        ]
    },
    {
        id: 'housekeeping',
        name: 'Housekeeping',
        description: 'Manages room status (cleaning, maintenance).',
        permissions: [
            'Update Room Status', 'View Room Assignments'
        ]
    }
];

const RoleIcons = {
    Administrator: <ShieldCheck className="w-8 h-8 text-red-500"/>,
    Manager: <ShieldAlert className="w-8 h-8 text-purple-500"/>,
    'Front Desk Staff': <Shield className="w-8 h-8 text-blue-500"/>,
    Housekeeping: <Shield className="w-8 h-8 text-green-500"/>,
};


const Roles = () => {
    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Roles & Permissions</h1>
                        <p className="text-gray-500 mt-1">Define user roles and manage their system access permissions.</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
                        <PlusCircle className="w-4 h-4" />
                        Add New Role
                    </button>
                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockRoles.map(role => (
                        <div key={role.id} className="bg-white rounded-2xl shadow-md border border-gray-200/80 p-6 flex flex-col">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{role.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1 flex-grow">{role.description}</p>
                                </div>
                                {RoleIcons[role.name] || <Shield className="w-8 h-8 text-gray-500"/>}
                            </div>
                            
                            <div className="mt-6 flex-grow">
                                <h4 className="font-semibold text-gray-700 mb-2">Permissions:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.map(perm => (
                                        <span key={perm} className="px-2.5 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                                            {perm}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end items-center gap-2">
                                <button
                                    title="Edit Role & Permissions"
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                                >
                                    <Edit className="w-4 h-4"/>
                                </button>
                                <button
                                    title="Delete Role"
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                                >
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Roles;