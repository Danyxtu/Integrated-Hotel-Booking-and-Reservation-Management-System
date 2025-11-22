import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Search, DollarSign, CreditCard, Banknote, Clock, CheckCircle2, XCircle, ShieldCheck, Mail, FileText, Eye } from "lucide-react"; // Added Eye icon
import { router } from "@inertiajs/react";
import { useToast } from "@/hooks/use-toast";
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
import { Input } from "@/components/ui/input"; // Assuming Input component exists for refund reason
import { Label } from "@/components/ui/label"; // Assuming Label component exists

// These are removed as per the plan
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";


const statusStyles = {
    Pending: {
        icon: Clock,
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        label: "Pending",
    },
    Completed: {
        icon: CheckCircle2,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        label: "Completed",
    },
    Cancelled: {
        icon: XCircle,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        label: "Cancelled",
    },
    Refunded: {
        icon: DollarSign,
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

// --- New PaymentDetailsDialog component ---
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
                        Review details and take action for payment #{payment.id}.
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
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onOpenChange(false)} disabled={isProcessing}>Close</AlertDialogCancel>
                    {payment.status === 'Pending' && (
                        <>
                            <Button
                                variant="destructive"
                                onClick={handleCancelClick}
                                disabled={isProcessing}
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancel Payment
                            </Button>
                            <Button
                                variant="warning" // Assuming a 'warning' variant exists for yellow color
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
                        </>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};


const PendingPayments = ({ payments, statuses }) => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false); // New state for details dialog
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false); // New state for refund dialog
    const [refundReason, setRefundReason] = useState(''); // New state for refund reason
    const [isProcessing, setIsProcessing] = useState(false);

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
                console.error("Payment status update failed:", error); // Log the full error object
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
        router.patch(route('admin.payments.refund', paymentId), { reason: reason }, { // New route, using PATCH as it's an update to the payment record
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

    // Note: handleConfirmClick and handleCancelClick are now internal to PaymentDetailsDialog

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

    const filteredPayments = payments.filter(payment =>
        payment.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.booking?.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.booking?.customer?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.booking?.customer?.last_name.toLowerCase().includes(searchTerm.toLowerCase())
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
                                <th scope="col" className="px-6 py-4">Booking ID</th>
                                <th scope="col" className="px-6 py-4">Guest Name</th>
                                <th scope="col" className="px-6 py-4 text-right">Amount</th>
                                <th scope="col" className="px-6 py-4">Method</th>
                                <th scope="col" className="px-6 py-4">Date</th>
                                <th scope="col" className="px-6 py-4 text-center">Status</th>
                                <th scope="col" className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-mono text-blue-600">{payment.id}</td>
                                        <td className="px-6 py-4">{payment.booking?.booking_number}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800">
                                            {payment.booking?.customer?.first_name}{" "}
                                            {payment.booking?.customer?.last_name}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-right">${parseFloat(payment.amount).toFixed(2)}</td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            {methodIcons[payment.payment_method]}
                                            {payment.payment_method}
                                        </td>
                                        <td className="px-6 py-4">{new Date(payment.payment_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            {/* Always pending status on this page */}
                                            {getStatusChip(payment.status)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleViewDetailsClick(payment)}
                                                    title="View Payment Details"
                                                >
                                                    <Eye className="w-4 h-4 mr-1"/>
                                                    View Details
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
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
            {/* The new PaymentDetailsDialog will be rendered here */}
            {selectedPayment && (
                <PaymentDetailsDialog
                    payment={selectedPayment}
                    open={isDetailsDialogOpen}
                    onOpenChange={setIsDetailsDialogOpen}
                    onConfirmStatusUpdate={executeStatusUpdate}
                    onRefund={executeRefund}
                    isProcessing={isProcessing}
                    // Pass existing dialog open/close states and reason handlers
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
            {/* Keep confirmation dialogs but they will be triggered by PaymentDetailsDialog */}
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

export default PendingPayments;