import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Search, DollarSign, CreditCard, Banknote, Clock, CheckCircle2, XCircle, ShieldCheck, Mail, FileText } from "lucide-react";

// Mock data for payments (could be fetched from a single source)
const mockAllPayments = [
    { id: "PAY001", bookingId: "BK001", guestName: "John Doe", amount: 1250.00, method: "Credit Card", date: "2025-11-19", status: "Completed" },
    { id: "PAY002", bookingId: "BK003", guestName: "Peter Jones", amount: 980.00, method: "Bank Transfer", date: "2025-11-18", status: "Pending" },
    { id: "PAY003", bookingId: "BK005", guestName: "David Williams", amount: 2500.00, method: "Credit Card", date: "2025-11-17", status: "Completed" },
    { id: "PAY004", bookingId: "BK006", guestName: "Emily Brown", amount: 500.00, method: "Credit Card", date: "2025-11-16", status: "Refunded" },
    { id: "PAY005", bookingId: "BK007", guestName: "Michael Davis", amount: 1100.00, method: "Cash", date: "2025-11-15", status: "Completed" },
    { id: "PAY006", bookingId: "BK002", guestName: "Jane Smith", amount: 450.00, method: "Credit Card", date: "2025-11-20", status: "Completed" },
    { id: "PAY007", bookingId: "BK008", guestName: "Sarah Miller", amount: 1200.00, method: "Bank Transfer", date: "2025-11-20", status: "Pending" },
];

const statusStyles = {
    Pending: {
        icon: Clock,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        label: "Pending",
    },
};

const methodIcons = {
    "Credit Card": <CreditCard className="w-4 h-4" />,
    "Bank Transfer": <Banknote className="w-4 h-4" />,
    Cash: <DollarSign className="w-4 h-4" />,
};

const PendingPayments = () => {
    const [pendingPayments, setPendingPayments] = useState(mockAllPayments.filter(p => p.status === 'Pending'));
    const [searchTerm, setSearchTerm] = useState('');

    const handleMarkAsCompleted = (paymentId) => {
        setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
        console.log(`Payment ${paymentId} marked as completed.`);
        // In a real app, send API request to update status
    };

    const handleCancel = (paymentId) => {
        setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
        console.log(`Payment ${paymentId} cancelled.`);
         // In a real app, send API request to update status
    };

    const filteredPayments = pendingPayments.filter(payment =>
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.guestName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Pending Payments</h1>
                        <p className="text-gray-500 mt-1">Review and manage payments awaiting confirmation.</p>
                    </div>
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

                {/* Pending Payments Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200/80">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">Payment ID</th>
                                <th scope="col" className="px-6 py-4">Guest Name</th>
                                <th scope="col" className="px-6 py-4 text-right">Amount</th>
                                <th scope="col" className="px-6 py-4">Method</th>
                                <th scope="col" className="px-6 py-4">Date</th>
                                <th scope="col" className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-mono text-blue-600">{payment.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">{payment.guestName}</td>
                                        <td className="px-6 py-4 font-mono text-right">${payment.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            {methodIcons[payment.method]}
                                            {payment.method}
                                        </td>
                                        <td className="px-6 py-4">{payment.date}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleMarkAsCompleted(payment.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                                                    title="Mark as Completed"
                                                >
                                                    <ShieldCheck className="w-4 h-4"/>
                                                    Confirm
                                                </button>
                                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition" title="Send Reminder">
                                                    <Mail className="w-4 h-4"/>
                                                </button>
                                                 <button 
                                                    onClick={() => handleCancel(payment.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition" title="Cancel Payment">
                                                    <XCircle className="w-4 h-4"/>
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
                                            <p className="font-semibold">No pending payments found.</p>
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

export default PendingPayments;