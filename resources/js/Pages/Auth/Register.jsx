import React, { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false); // Added for password visibility
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "user",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
            <Head title="Register" />
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding & Info */}
                <div className="hidden lg:block relative">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                    <div className="relative space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Link href={route("home")}>
                                    <Sparkles className="w-8 h-8 text-white" />
                                </Link>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    LuxStay
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Premium Hospitality Experience
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                Join Us Today for
                                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Unforgettable Stays
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Create an account to easily manage your
                                bookings, explore exclusive offers, and
                                experience seamless hospitality.
                            </p>
                        </div>
                        {/* Optional: Add a compelling image or more features related to registration */}
                        <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop"
                                alt="Luxury Hotel"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-6">
                                <p className="text-white text-lg font-semibold">
                                    Your Journey Begins Here
                                </p>
                                <p className="text-white/80 text-sm">
                                    Quick and easy registration process
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="relative">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Link href={route("home")}>
                                    <Sparkles className="w-7 h-7 text-white" />
                                </Link>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                LuxeStay
                            </span>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-3xl text-center font-bold text-gray-900 mb-2">
                                Create Your Account
                            </h3>
                            <p className="text-gray-600 text-center">
                                Get started with LuxeStay today!
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* First Name */}
                            <div>
                                <InputLabel
                                    htmlFor="first_name"
                                    value="First Name"
                                />
                                <TextInput
                                    id="first_name"
                                    name="first_name"
                                    value={data.first_name}
                                    className="mt-1 block w-full"
                                    autoComplete="given-name"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.first_name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <InputLabel
                                    htmlFor="last_name"
                                    value="Last Name"
                                />
                                <TextInput
                                    id="last_name"
                                    name="last_name"
                                    value={data.last_name}
                                    className="mt-1 block w-full"
                                    autoComplete="family-name"
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.last_name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Email Address"
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                />
                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full pr-12"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                />
                                <div className="relative">
                                    <TextInput
                                        id="password_confirmation"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full pr-12"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            {/* Submit Button */}
                            <PrimaryButton
                                className="w-full flex justify-center py-4 text-lg"
                                disabled={processing}
                            >
                                {processing ? "Registering..." : "Register"}
                            </PrimaryButton>
                        </form>

                        {/* Login Link */}
                        <p className="mt-8 text-center text-gray-600">
                            Already have an account?{" "}
                            <Link
                                href={route("login")}
                                className="font-semibold text-blue-600 hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>

                    {/* Bottom Note */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        By registering, you agree to our{" "}
                        <Link className="text-blue-600 hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link className="text-blue-600 hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
