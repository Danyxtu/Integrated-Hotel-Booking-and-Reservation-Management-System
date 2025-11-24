import React, { useMemo, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Search,
    DollarSign,
    CreditCard,
    Banknote,
    FileText,
} from "lucide-react";

const methodIcons = {
    "Credit Card": <CreditCard className="w-4 h-4" />,
    "Bank Transfer": <Banknote className="w-4 h-4" />,
    Cash: <DollarSign className="w-4 h-4" />,
};

const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "₱0.00";
    return `₱${Number(amount).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const Refunds = ({ payments = [] }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPayments = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return payments;

        return payments.filter((payment) => {
            const idValue = (payment.transaction_id || payment.id || "")
                .toString()
                .toLowerCase();
            const guestName = `${payment.booking?.customer?.first_name || ""} ${
                payment.booking?.customer?.last_name || ""
            }`
                .trim()
                .toLowerCase();

            return idValue.includes(query) || guestName.includes(query);
        });
    }, [payments, searchTerm]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Refunded Payments
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Review all processed refunds.
                        </p>
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
                                <th scope="col" className="px-6 py-4">
                                    Payment ID
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Guest Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-right"
                                >
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Original Payment
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Refund Date
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Reason
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => {
                                    const guestName = `${
                                        payment.booking?.customer?.first_name ||
                                        "Guest"
                                    } ${
                                        payment.booking?.customer?.last_name ||
                                        ""
                                    }`.trim();
                                    const method =
                                        payment.payment_method || "Unknown";
                                    const paymentIdentifier =
                                        payment.transaction_id ||
                                        payment.id ||
                                        "—";
                                    return (
                                        <tr
                                            key={payment.id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 font-mono text-blue-600">
                                                {paymentIdentifier}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-800">
                                                {guestName}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-right">
                                                {formatAmount(payment.amount)}
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                {methodIcons[method] || (
                                                    <CreditCard className="w-4 h-4" />
                                                )}
                                                {method}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatDate(payment.updated_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {payment.refund_reason || "—"}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-gray-500"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText className="w-10 h-10 text-gray-400 mb-2" />
                                            <p className="font-semibold">
                                                No refunded payments found.
                                            </p>
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
