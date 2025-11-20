import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const GeneralSettings = () => {
    return (
        <AdminLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold">General Settings</h1>
                <p className="mt-2 text-gray-600">Manage general application settings here.</p>
            </div>
        </AdminLayout>
    );
};

export default GeneralSettings;
