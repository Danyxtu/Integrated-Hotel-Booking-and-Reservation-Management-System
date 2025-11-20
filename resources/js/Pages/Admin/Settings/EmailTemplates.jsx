import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { Head } from '@inertiajs/react';

const EmailTemplates = ({ settings }) => {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        email_booking_confirmation_subject: settings.email_booking_confirmation_subject || '',
        email_booking_confirmation_body: settings.email_booking_confirmation_body || '',
        email_cancellation_subject: settings.email_cancellation_subject || '',
        email_cancellation_body: settings.email_cancellation_body || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.settings.updateEmailTemplates'));
    };

    return (
        <AdminLayout>
            <Head title="Email Templates" />

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800">Email Templates</h1>
                    <p className="text-gray-500 mt-1">Customize the content of your automated email notifications.</p>
                </div>

                <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow-md space-y-6">
                    {/* Booking Confirmation Email */}
                    <h2 className="text-xl font-semibold text-gray-800">Booking Confirmation</h2>
                    <div>
                        <InputLabel htmlFor="email_booking_confirmation_subject" value="Subject" />
                        <TextInput
                            id="email_booking_confirmation_subject"
                            value={data.email_booking_confirmation_subject}
                            onChange={(e) => setData('email_booking_confirmation_subject', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.email_booking_confirmation_subject} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="email_booking_confirmation_body" value="Email Body" />
                        <textarea
                            id="email_booking_confirmation_body"
                            value={data.email_booking_confirmation_body}
                            onChange={(e) => setData('email_booking_confirmation_body', e.target.value)}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="8"
                        ></textarea>
                        <InputError message={errors.email_booking_confirmation_body} className="mt-2" />
                        <p className="text-xs text-gray-500 mt-1">Available placeholders: {`{guest_name}, {booking_number}, {check_in_date}, {check_out_date}, {room_type}, {total_price}`}</p>
                    </div>

                    {/* Booking Cancellation Email */}
                    <h2 className="text-xl font-semibold text-gray-800 pt-6 border-t border-gray-200">Booking Cancellation</h2>
                    <div>
                        <InputLabel htmlFor="email_cancellation_subject" value="Subject" />
                        <TextInput
                            id="email_cancellation_subject"
                            value={data.email_cancellation_subject}
                            onChange={(e) => setData('email_cancellation_subject', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.email_cancellation_subject} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="email_cancellation_body" value="Email Body" />
                        <textarea
                            id="email_cancellation_body"
                            value={data.email_cancellation_body}
                            onChange={(e) => setData('email_cancellation_body', e.target.value)}
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows="8"
                        ></textarea>
                        <InputError message={errors.email_cancellation_body} className="mt-2" />
                        <p className="text-xs text-gray-500 mt-1">Available placeholders: {`{guest_name}, {booking_number}`}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>
                        {recentlySuccessful && (
                            <p className="text-sm text-gray-600">Saved.</p>
                        )}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EmailTemplates;
