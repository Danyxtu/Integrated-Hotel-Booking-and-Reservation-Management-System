import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const PricingAndRates = () => {
    return (
        <AdminLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold">Pricing & Rates</h1>
                <p className="mt-2 text-gray-600">Manage your room pricing and rates.</p>
            </div>
        </AdminLayout>
    );
};

export default PricingAndRates;
