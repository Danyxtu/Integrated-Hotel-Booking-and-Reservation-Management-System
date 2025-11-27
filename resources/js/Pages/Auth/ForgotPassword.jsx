import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
                        {/* Logo and Title */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                <Link href={route("home")}>
                                    <Sparkles className="w-7 h-7 text-white" />
                                </Link>
                            </div>
                            <h3 className="text-3xl text-center font-bold text-gray-900 mb-2">
                                Forgot Your Password?
                            </h3>
                            <p className="text-gray-600 text-center">
                                Enter your email to receive a password reset OTP.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <p className="text-sm font-medium text-green-700">
                                    {status}
                                </p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Email Address"
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <PrimaryButton className="w-full flex justify-center py-4 text-lg" disabled={processing}>
                                {processing ? "Sending OTP..." : "Email Password Reset OTP"}
                            </PrimaryButton>
                        </form>
                        
                        <p className="mt-8 text-center text-gray-600">
                            Remember your password?{' '}
                            <Link
                                href={route('login')}
                                className="font-semibold text-blue-600 hover:underline"
                            >
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
