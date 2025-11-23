import CustomerLayout from "@/Layouts/CustomerLayout";
import UpdatePasswordForm from "@/Pages/Profile/Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "@/Pages/Profile/Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import { Settings as SettingsIcon, Shield, UserCog } from "lucide-react";

const Settings = ({ auth, mustVerifyEmail, status }) => {
    return (
        <CustomerLayout user={auth.user}>
            <Head title="Account Settings" />

            {/* Hero / Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-lg text-white">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <SettingsIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Account Settings</h1>
                        <p className="text-blue-100 mt-1">
                            Manage your personal information and security
                            preferences
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Information Card */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <UserCog className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Profile Details
                        </h2>
                    </div>

                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="w-full"
                    />
                </div>

                {/* Security / Password Card */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 h-fit">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Security
                        </h2>
                    </div>

                    <UpdatePasswordForm className="w-full" />
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Settings;
