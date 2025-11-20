import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const EmailTemplates = () => {
    return (
        <AdminLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold">Email Templates</h1>
                <p className="mt-2 text-gray-600">Customize your email templates.</p>
            </div>
        </AdminLayout>
    );
};

export default EmailTemplates;
