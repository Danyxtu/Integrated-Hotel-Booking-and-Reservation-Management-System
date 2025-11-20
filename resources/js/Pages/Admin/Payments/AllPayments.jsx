import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Search, DollarSign, CreditCard, Banknote, Clock, CheckCircle2, XCircle, FileText, RotateCcw, Eye, ShieldCheck } from "lucide-react";

// Mock data for payments
const mockPayments = [
    {
        id: "PAY001",
        bookingId: "BK001",
        guestName: "John Doe",
        amount: 1250.00,
        method: "Credit Card",
        date: "2025-11-19",
        status: "Completed",
    },
    {
        id: "PAY002",
        bookingId: "BK003",
        guestName: "Peter Jones",
        amount: 980.00,
        method: "Bank Transfer",
        date: "2025-11-18",
        status: "Pending",
    },
    {
        id: "PAY003",
        bookingId: "BK005",
        guestName: "David Williams",
        amount: 2500.00,
        method: "Credit Card",
        date: "2025-11-17",
        status: "Completed",
    },
    {
        id: "PAY004",
        bookingId: "BK006",
        guestName: "Emily Brown",
        amount: 500.00,
        method: "Credit Card",
        date: "2025-11-16",
        status: "Refunded",
    },
    {
        id: "PAY005",
        bookingId: "BK007",
        guestName: "Michael Davis",
        amount: 1100.00,
        method: "Cash",
        date: "2025-11-15",
        status: "Completed",
    },
    {
        id: "PAY006",
        bookingId: "BK002",
        guestName: "Jane Smith",
        amount: 450.00,
        method: "Credit Card",
        date: "2025-11-20",
        status: "Completed",
    },
    {
        id: "PAY007",
        bookingId: "BK008",
        guestName: "Sarah Miller",
        amount: 1200.00,
        method: "Bank Transfer",
        date: "2025-11-20",
        status: "Pending",
    },
];

const paymentStatuses = ['All', 'Completed', 'Pending', 'Refunded', 'Failed'];
const paymentMethods = ['All', 'Credit Card', 'Bank Transfer', 'Cash'];

const statusStyles = {
    Completed: {
        icon: CheckCircle2,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        label: "Completed",
    },
    Pending: {
        icon: Clock,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        label: "Pending",
    },
    Refunded: {
        icon: RotateCcw,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        label: "Refunded",
    },
    Failed: {
        icon: XCircle,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        label: "Failed",
    },
};

const methodIcons = {
    "Credit Card": <CreditCard className="w-4 h-4" />,
    "Bank Transfer": <Banknote className="w-4 h-4" />,
    Cash: <DollarSign className="w-4 h-4" />,
};

const AllPayments = () => {
    const [filters, setFilters] = useState({ status: 'All', method: 'All' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const filteredPayments = mockPayments.filter(payment => {
        const statusMatch = filters.status === 'All' || payment.status === filters.status;
        const methodMatch = filters.method === 'All' || payment.method === filters.method;
        const searchMatch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            payment.guestName.toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && methodMatch && searchMatch;
    });

    const getStatusChip = (status) => {
        const style = statusStyles[status] || {};
        const Icon = style.icon;
        return (
            <span
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${style.bgColor || 'bg-gray-100'} ${style.textColor || 'text-gray-800'}`}
            >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {style.label || status}
            </span>
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">All Payments</h1>
                        <p className="text-gray-500 mt-1">Manage and view all financial transactions.</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-200/80">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Payment Status</label>
                            <select onChange={(e) => handleFilterChange('status', e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                {paymentStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Payment Method</label>
                            <select onChange={(e) => handleFilterChange('method', e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                {paymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                             <label className="text-sm font-semibold text-gray-600 mb-1 block">Search Payments</label>
                             <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by ID or guest name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200/80">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">
                                    Payment ID
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Booking ID
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Guest Name
                                </th>
                                <th scope="col" className="px-6 py-4 text-right">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Method
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-4 text-center">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-4 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-mono text-blue-600">
                                            {payment.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            {payment.bookingId}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">
                                            {payment.guestName}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-right">
                                            ${payment.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            {methodIcons[payment.method]}
                                            {payment.method}
                                        </td>
                                        <td className="px-6 py-4">
                                            {payment.date}
                                        </td>
                                        <td className="px-6 py-4 flex justify-center">
                                            {getStatusChip(payment.status)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition" title="View Details">
                                                    <Eye className="w-4 h-4"/>
                                                </button>
                                                {payment.status === 'Completed' && (
                                                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-md transition" title="Refund">
                                                        <RotateCcw className="w-4 h-4"/>
                                                    </button>
                                                )}
                                                {payment.status === 'Pending' && (
                                                    <button className="p-2 text-green-500 hover:bg-green-50 rounded-md transition" title="Mark as Completed">
                                                        <ShieldCheck className="w-4 h-4"/>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="w-10 h-10 text-gray-400 mb-2"/>
                                            <p className="font-semibold">No payments found matching your criteria.</p>
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

export default AllPayments;