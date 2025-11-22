import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Search, DollarSign, CreditCard, Banknote, Clock, CheckCircle2, XCircle, FileText, RotateCcw, Eye, ArrowUpDown, ShieldCheck } from "lucide-react";
import { router, usePage } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    Cancelled: {
        icon: XCircle,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        label: "Cancelled",
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

// --- Confirmation Dialogs (adapted to be called from PaymentDetailsDialog) ---
const ConfirmPaymentDialog = ({ payment, open, onOpenChange, onConfirm, isProcessing }) => {
    if (!payment) return null;
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Payment Completion?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to mark payment #{payment.id} for booking #{payment.booking?.booking_number} as Completed? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm(payment.id, 'Completed')} disabled={isProcessing}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const CancelPaymentDialog = ({ payment, open, onOpenChange, onConfirm, isProcessing }) => {
    if (!payment) return null;
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Payment Cancellation?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to mark payment #{payment.id} for booking #{payment.booking?.booking_number} as Cancelled? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm(payment.id, 'Cancelled')} disabled={isProcessing}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const RefundPaymentDialog = ({ payment, open, onOpenChange, onConfirm, isProcessing, refundReason }) => {
    if (!payment) return null;
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Payment Refund?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to refund payment #{payment.id} for booking #{payment.booking?.booking_number}?
                        <p className="mt-2 text-sm text-gray-700">Reason: <span className="font-semibold">{refundReason}</span></p>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm(payment.id, refundReason)} disabled={isProcessing}>Confirm Refund</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

// --- PaymentDetailsDialog component (reused from Pending.jsx, adapted) ---
const PaymentDetailsDialog = ({
    payment,
    open,
    onOpenChange,
    onConfirmStatusUpdate, // Callback for Confirm/Cancel
    onRefund, // Callback for Refund
    isProcessing,
    // Props to control nested confirmation dialogs
    isConfirmDialogOpen, setIsConfirmDialogOpen,
    isCancelDialogOpen, setIsCancelDialogOpen,
    isRefundDialogOpen, setIsRefundDialogOpen,
    refundReason, setRefundReason,
}) => {
    const [isRefundReasonVisible, setIsRefundReasonVisible] = useState(false);

    const handleConfirmClick = () => {
        setIsConfirmDialogOpen(true);
    };

    const handleCancelClick = () => {
        setIsCancelDialogOpen(true);
    };

    const handleRefundAction = () => {
        if (!isRefundReasonVisible) {
            setIsRefundReasonVisible(true);
        } else {
            // Trigger refund confirmation dialog
            setIsRefundDialogOpen(true);
        }
    };

    if (!payment) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-[800px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Payment Details #{payment.id}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Review details for payment #{payment.id}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-semibold">Booking Number:</p>
                            <p className="text-gray-700">{payment.booking?.booking_number}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Guest Name:</p>
                            <p className="text-gray-700">{payment.booking?.customer?.first_name} {payment.booking?.customer?.last_name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Amount:</p>
                            <p className="text-gray-700">${parseFloat(payment.amount).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Payment Method:</p>
                            <p className="text-gray-700">{payment.payment_method}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Payment Date:</p>
                            <p className="text-gray-700">{new Date(payment.payment_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Status:</p>
                            <p className="text-gray-700">{payment.status}</p>
                        </div>
                         {payment.status === 'Refunded' && payment.refund_reason && (
                            <div className="col-span-2">
                                <p className="text-sm font-semibold">Refund Reason:</p>
                                <p className="text-gray-700">{payment.refund_reason}</p>
                            </div>
                        )}
                    </div>

                    {/* Show action buttons only if payment is pending */}
                    {payment.status === 'Pending' && (
                        <>
                            {isRefundReasonVisible && (
                                <div className="space-y-2 mt-4">
                                    <Label htmlFor="refundReason">Reason for Refund</Label>
                                    <Input
                                        id="refundReason"
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        placeholder="e.g., Customer requested, overcharged"
                                        disabled={isProcessing}
                                    />
                                    {refundReason.length === 0 && <p className="text-red-500 text-sm">Reason is required to proceed with refund.</p>}
                                </div>
                            )}
                            <AlertDialogFooter>
                                <Button
                                    variant="destructive"
                                    onClick={handleCancelClick}
                                    disabled={isProcessing}
                                >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Cancel Payment
                                </Button>
                                <Button
                                    variant="warning"
                                    onClick={handleRefundAction}
                                    disabled={isProcessing || (isRefundReasonVisible && refundReason.length === 0)}
                                >
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    {isRefundReasonVisible ? 'Confirm Refund' : 'Refund Payment'}
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={handleConfirmClick}
                                    disabled={isProcessing}
                                >
                                    <ShieldCheck className="w-4 h-4 mr-1" />
                                    Confirm Payment
                                </Button>
                            </AlertDialogFooter>
                        </>
                    )}
                </div>

                {/* If not pending, just a close button in footer */}
                {payment.status !== 'Pending' && (
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => onOpenChange(false)}>Close</AlertDialogAction>
                    </AlertDialogFooter>
                )}
            </AlertDialogContent>
        </AlertDialog>
    );
};


const AllPayments = ({ payments, statuses, sortBy, sortDirection }) => {
    const { url } = usePage();
    const currentParams = Object.fromEntries(new URLSearchParams(window.location.search));

    const [searchTerm, setSearchTerm] = useState(currentParams.search || '');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState(currentParams.status_filter || 'All');
    const [selectedMethodFilter, setSelectedMethodFilter] = useState(currentParams.method_filter || 'All');

    // New states for dialogs and processing
    const { toast } = useToast();
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const applyFiltersAndSort = (params) => {
        router.get(route('admin.payments.all'), params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = (filterName, value) => {
        const newParams = { ...currentParams, [filterName]: value };
        if (filterName === 'status_filter') {
            setSelectedStatusFilter(value);
        } else if (filterName === 'method_filter') {
            setSelectedMethodFilter(value);
        } else if (filterName === 'search') {
            // State is already updated by handleSearchInput, just need to apply it
        }
        // Remove empty or 'All' filters from params to keep URLs clean
        Object.keys(newParams).forEach(key => {
            if (newParams[key] === '' || newParams[key] === 'All') {
                delete newParams[key];
            }
        });
        applyFiltersAndSort(newParams);
    };

    const handleSearchInput = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = () => {
        handleFilterChange('search', searchTerm);
    };

    const handleSort = (column) => {
        const newDirection = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc';
        applyFiltersAndSort({ ...currentParams, sort_by: column, sort_direction: newDirection });
    };

    // Action handlers for payments
    const executeStatusUpdate = (paymentId, newStatus) => {
        setIsProcessing(true);
        router.patch(route('admin.payments.updateStatus', paymentId), { status: newStatus }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsConfirmDialogOpen(false);
                setIsCancelDialogOpen(false);
                setIsDetailsDialogOpen(false); // Close details dialog after action
                setSelectedPayment(null);
                toast({
                    title: "Success",
                    description: `Payment #${paymentId} status updated to ${newStatus}.`,
                    variant: "success",
                });
            },
            onError: (error) => {
                console.error("Payment status update failed:", error);
                let errorMessage = "Failed to update payment status.";
                if (error && typeof error === 'object') {
                    if (error.status) {
                        errorMessage += ` Status Code: ${error.status}.`;
                    }
                    if (error.message) {
                        errorMessage = error.message;
                    } else if (Object.keys(error).length > 0) {
                        const firstErrorKey = Object.keys(error)[0];
                        errorMessage = error[firstErrorKey];
                    }
                }
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            },
            onFinish: () => {
                setIsProcessing(false);
            }
        });
    };

    const executeRefund = (paymentId, reason) => {
        setIsProcessing(true);
        router.patch(route('admin.payments.refund', paymentId), { reason: reason }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsRefundDialogOpen(false);
                setIsDetailsDialogOpen(false);
                setSelectedPayment(null);
                setRefundReason('');
                toast({
                    title: "Success",
                    description: `Payment #${paymentId} has been refunded.`,
                    variant: "success",
                });
            },
            onError: (error) => {
                console.error("Payment refund failed:", error);
                let errorMessage = "Failed to refund payment.";
                if (error && typeof error === 'object') {
                    if (error.status) {
                        errorMessage += ` Status Code: ${error.status}.`;
                    }
                    if (error.message) {
                        errorMessage = error.message;
                    } else if (Object.keys(error).length > 0) {
                        const firstErrorKey = Object.keys(error)[0];
                        errorMessage = error[firstErrorKey];
                    }
                }
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            },
            onFinish: () => {
                setIsProcessing(false);
            }
        });
    };

    const handleViewDetailsClick = (payment) => {
        setSelectedPayment(payment);
        setIsDetailsDialogOpen(true);
    };

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

    const statusOptions = [{ name: 'All', value: 'All' }, ...statuses.map(s => ({ name: s, value: s }))];
    const paymentMethods = ['All', 'Credit Card', 'Bank Transfer', 'Cash'];

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
                            <select onChange={(e) => handleFilterChange('status_filter', e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" value={selectedStatusFilter}>
                                {statusOptions.map(status => <option key={status.value} value={status.value}>{status.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="text-sm font-semibold text-gray-600 mb-1 block">Payment Method</label>
                            <select onChange={(e) => handleFilterChange('method_filter', e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500" value={selectedMethodFilter}>
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
                                    onChange={handleSearchInput}
                                    onBlur={handleSearchSubmit} // Trigger search on blur
                                    onKeyDown={(e) => { // Trigger search on Enter key press
                                        if (e.key === 'Enter') {
                                            handleSearchSubmit();
                                        }
                                    }}
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
                                    <button onClick={() => handleSort('id')} className="flex items-center gap-1 uppercase">
                                        Payment ID
                                        {sortBy === 'id' && (
                                            <ArrowUpDown className={`w-3 h-3 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>
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
                                    <button onClick={() => handleSort('payment_date')} className="flex items-center gap-1 uppercase">
                                        Date
                                        {sortBy === 'payment_date' && (
                                            <ArrowUpDown className={`w-3 h-3 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4 text-center">
                                     <button onClick={() => handleSort('status')} className="flex items-center justify-center gap-1 uppercase">
                                        Status
                                        {sortBy === 'status' && (
                                            <ArrowUpDown className={`w-3 h-3 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {payments.length > 0 ? (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-mono text-blue-600">
                                            {payment.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            {payment.booking?.booking_number}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">
                                            {payment.booking?.customer?.first_name}{" "}
                                            {payment.booking?.customer?.last_name}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-right">
                                            ${parseFloat(payment.amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            {methodIcons[payment.payment_method]}
                                            {payment.payment_method}
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(payment.payment_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusChip(payment.status)}
                                            {payment.status === 'Refunded' && payment.refund_reason && (
                                                <p className="text-xs text-gray-500 mt-1">Reason: {payment.refund_reason}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition" title="View Details" onClick={() => handleViewDetailsClick(payment)}>
                                                    <Eye className="w-4 h-4"/>
                                                </button>
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
            {selectedPayment && (
                <PaymentDetailsDialog
                    payment={selectedPayment}
                    open={isDetailsDialogOpen}
                    onOpenChange={setIsDetailsDialogOpen}
                    onConfirmStatusUpdate={executeStatusUpdate}
                    onRefund={executeRefund}
                    isProcessing={isProcessing}
                    isConfirmDialogOpen={isConfirmDialogOpen}
                    setIsConfirmDialogOpen={setIsConfirmDialogOpen}
                    isCancelDialogOpen={isCancelDialogOpen}
                    setIsCancelDialogOpen={setIsCancelDialogOpen}
                    isRefundDialogOpen={isRefundDialogOpen}
                    setIsRefundDialogOpen={setIsRefundDialogOpen}
                    refundReason={refundReason}
                    setRefundReason={setRefundReason}
                />
            )}
            {selectedPayment && (
                <ConfirmPaymentDialog
                    payment={selectedPayment}
                    open={isConfirmDialogOpen}
                    onOpenChange={setIsConfirmDialogOpen}
                    onConfirm={executeStatusUpdate}
                    isProcessing={isProcessing}
                />
            )}
            {selectedPayment && (
                <CancelPaymentDialog
                    payment={selectedPayment}
                    open={isCancelDialogOpen}
                    onOpenChange={setIsCancelDialogOpen}
                    onConfirm={executeStatusUpdate}
                    isProcessing={isProcessing}
                />
            )}
             {selectedPayment && (
                <RefundPaymentDialog
                    payment={selectedPayment}
                    open={isRefundDialogOpen}
                    onOpenChange={setIsRefundDialogOpen}
                    onConfirm={executeRefund}
                    isProcessing={isProcessing}
                    refundReason={refundReason}
                />
            )}
        </AdminLayout>
    );
};

export default AllPayments;