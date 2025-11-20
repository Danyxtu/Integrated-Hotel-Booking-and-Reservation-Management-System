import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Search, DollarSign, CreditCard, Banknote, RotateCcw, FileText, Eye } from "lucide-react";

// Mock data for payments (could be fetched from a single source)
const mockAllPayments = [
    { id: "PAY001", bookingId: "BK001", guestName: "John Doe", amount: 1250.00, method: "Credit Card", date: "2025-11-19", status: "Completed" },
    { id: "PAY002", bookingId: "BK003", guestName: "Peter Jones", amount: 980.00, method: "Bank Transfer", date: "2025-11-18", status: "Pending" },
    { id: "PAY003", bookingId: "BK005", guestName: "David Williams", amount: 2500.00, method: "Credit Card", date: "2025-11-17", status: "Completed" },
    { id: "PAY004", bookingId: "BK006", guestName: "Emily Brown", amount: 500.00, method: "Credit Card", date: "2025-11-16", status: "Refunded", refundDate: "2025-11-17", refundReason: "Customer cancellation" },
    { id: "PAY005", bookingId: "BK007", guestName: "Michael Davis", amount: 1100.00, method: "Cash", date: "2025-11-15", status: "Completed" },
    { id: "PAY006", bookingId: "BK002", guestName: "Jane Smith", amount: 450.00, method: "Credit Card", date: "2025-11-20", status: "Completed" },
    { id: "PAY007", bookingId: "BK008", guestName: "Sarah Miller", amount: 1200.00, method: "Bank Transfer", date: "2025-11-20", status: "Pending" },
    { id: "PAY008", bookingId: "BK011", guestName: "Charlie Chaplin", amount: 950.00, method: "Credit Card", date: "2025-11-12", status: "Refunded", refundDate: "2025-11-14", refundReason: "Booking modification" },
];

const statusStyles = {
    Refunded: {
        icon: RotateCcw,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        label: "Refunded",
    },
};

const methodIcons = {
    "Credit Card": <CreditCard className="w-4 h-4" />,
    "Bank Transfer": <Banknote className="w-4 h-4" />,
    Cash: <DollarSign className="w-4 h-4" />,
};

const Refunds = () => {
    const [refundedPayments, setRefundedPayments] = useState(mockAllPayments.filter(p => p.status === 'Refunded'));
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPayments = refundedPayments.filter(payment =>
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.guestName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Refunded Payments</h1>
                        <p className="text-gray-500 mt-1">Review all processed refunds.</p>
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

                {/* Refunds Table */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200/80">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50/80 text-xs text-gray-700 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-4">Payment ID</th>
                                <th scope="col" className="px-6 py-4">Guest Name</th>
                                <th scope="col" className="px-6 py-4 text-right">Amount</th>
                                <th scope="col" className="px-6 py-4">Original Payment</th>
                                <th scope="col" className="px-6 py-4">Refund Date</th>
                                <th scope="col" className="px-6 py-4">Reason</th>
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
                                        <td className="px-6 py-4">{payment.refundDate}</td>
                                        <td className="px-6 py-4">{payment.refundReason}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition" title="View Details">
                                                    <Eye className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="w-10 h-10 text-gray-400 mb-2"/>
                                            <p className="font-semibold">No refunded payments found.</p>
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

export default Refunds;
