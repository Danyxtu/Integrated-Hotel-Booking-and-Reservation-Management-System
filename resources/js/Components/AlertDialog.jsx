import React from 'react';
import { X } from 'lucide-react';

const AlertDialog = ({ isOpen, onClose, onConfirm, title, description }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
            onClick={onClose} // Close on overlay click
        >
            <div 
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-md m-4"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside content
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    {description && (
                        <p className="mt-1 text-sm text-gray-600">{description}</p>
                    )}
                </div>
                
                {/* Footer with actions */}
                <div className="px-6 py-4 bg-gray-50/80 flex justify-end gap-3 rounded-b-xl">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                    >
                        Confirm
                    </button>
                </div>

                {/* Close button in corner */}
                 <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:bg-gray-200 transition"
                    aria-label="Close"
                >
                    <X className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};

export default AlertDialog;
