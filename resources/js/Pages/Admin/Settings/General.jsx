import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { Head } from '@inertiajs/react';

const GeneralSettings = ({ settings }) => {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        hotel_name: settings.hotel_name || '',
        hotel_address: settings.hotel_address || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        website_url: settings.website_url || '',
        default_check_in_time: settings.default_check_in_time || '15:00',
        default_check_out_time: settings.default_check_out_time || '11:00',
        min_stay_duration: settings.min_stay_duration || '1',
        max_stay_duration: settings.max_stay_duration || '30',
        booking_cut_off_hours: settings.booking_cut_off_hours || '24',
        cancellation_policy: settings.cancellation_policy || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.settings.updateGeneral'));
    };

    return (
        <AdminLayout>
            <Head title="General Settings" />

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800">General Settings</h1>
                    <p className="text-gray-500 mt-1">Manage core hotel information and booking configurations.</p>
                </div>

                <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow-md space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800">Hotel Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="hotel_name" value="Hotel Name" />
                            <TextInput
                                id="hotel_name"
                                value={data.hotel_name}
                                onChange={(e) => setData('hotel_name', e.target.value)}
                                type="text"
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.hotel_name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="hotel_address" value="Hotel Address" />
                            <TextInput
                                id="hotel_address"
                                value={data.hotel_address}
                                onChange={(e) => setData('hotel_address', e.target.value)}
                                type="text"
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.hotel_address} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="contact_email" value="Contact Email" />
                            <TextInput
                                id="contact_email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                type="email"
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.contact_email} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="contact_phone" value="Contact Phone" />
                            <TextInput
                                id="contact_phone"
                                value={data.contact_phone}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                                type="text"
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.contact_phone} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="website_url" value="Website URL" />
                            <TextInput
                                id="website_url"
                                value={data.website_url}
                                onChange={(e) => setData('website_url', e.target.value)}
                                type="url"
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.website_url} className="mt-2" />
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 pt-6 border-t border-gray-200">Booking Configuration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="default_check_in_time" value="Default Check-in Time" />
                            <TextInput
                                id="default_check_in_time"
                                value={data.default_check_in_time}
                                onChange={(e) => setData('default_check_in_time', e.target.value)}
                                type="time"
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.default_check_in_time} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="default_check_out_time" value="Default Check-out Time" />
                            <TextInput
                                id="default_check_out_time"
                                value={data.default_check_out_time}
                                onChange={(e) => setData('default_check_out_time', e.target.value)}
                                type="time"
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.default_check_out_time} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="min_stay_duration" value="Minimum Stay Duration (nights)" />
                            <TextInput
                                id="min_stay_duration"
                                value={data.min_stay_duration}
                                onChange={(e) => setData('min_stay_duration', e.target.value)}
                                type="number"
                                min="1"
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.min_stay_duration} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="max_stay_duration" value="Maximum Stay Duration (nights)" />
                            <TextInput
                                id="max_stay_duration"
                                value={data.max_stay_duration}
                                onChange={(e) => setData('max_stay_duration', e.target.value)}
                                type="number"
                                min="1"
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.max_stay_duration} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="booking_cut_off_hours" value="Booking Cut-off (hours before check-in)" />
                            <TextInput
                                id="booking_cut_off_hours"
                                value={data.booking_cut_off_hours}
                                onChange={(e) => setData('booking_cut_off_hours', e.target.value)}
                                type="number"
                                min="0"
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.booking_cut_off_hours} className="mt-2" />
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="cancellation_policy" value="Cancellation Policy" />
                            <textarea
                                id="cancellation_policy"
                                value={data.cancellation_policy}
                                onChange={(e) => setData('cancellation_policy', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="4"
                            ></textarea>
                            <InputError message={errors.cancellation_policy} className="mt-2" />
                        </div>
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

export default GeneralSettings;
