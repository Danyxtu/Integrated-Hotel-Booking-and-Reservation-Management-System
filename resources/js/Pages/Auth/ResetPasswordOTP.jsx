import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

export default function ResetPasswordOTP({ email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email,
        otp: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.otp.update'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

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
                                Reset Your Password
                            </h3>
                            <p className="text-gray-600 text-center">
                                Enter the OTP sent to your email and your new password.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email" className="sr-only" /> {/* Hidden label */}
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Email Address"
                                    readOnly // Email should not be editable here
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="otp" value="OTP Code" className="sr-only" /> {/* Hidden label */}
                                <TextInput
                                    id="otp"
                                    type="text"
                                    name="otp"
                                    value={data.otp}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) => setData('otp', e.target.value)}
                                    placeholder="One-Time Password (OTP)"
                                />

                                <InputError message={errors.otp} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="New Password" className="sr-only" /> {/* Hidden label */}
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="New Password"
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                    className="sr-only" // Hidden label
                                />
                                <TextInput
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    placeholder="Confirm New Password"
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            <PrimaryButton className="w-full flex justify-center py-4 text-lg" disabled={processing}>
                                {processing ? "Resetting Password..." : "Reset Password"}
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
