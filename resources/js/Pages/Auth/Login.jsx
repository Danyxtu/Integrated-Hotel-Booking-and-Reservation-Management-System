import React, { useState } from "react";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Sparkles,
    Hotel,
    Shield,
    Clock,
} from "lucide-react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Login({ canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState("");
    const [loginRole, setLoginRole] = useState("user"); // default role

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
        role: loginRole, // include role in form data
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
            onSuccess: () =>
                setStatus(
                    `Login successful! Redirecting to ${data.role} dashboard...`
                ),
        });
    };

    const features = [
        { icon: Hotel, text: "Access exclusive room deals" },
        { icon: Clock, text: "Quick & easy booking" },
        { icon: Shield, text: "Secure payment gateway" },
    ];

    const toggleRole = () => {
        const newRole = loginRole === "user" ? "admin" : "user";
        setLoginRole(newRole);
        setData("role", newRole); // update role in form data
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
            <Head title="Login" />
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
                                Welcome Back to
                                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Luxury & Comfort
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Sign in to manage your reservations, access
                                exclusive member benefits, and enjoy seamless
                                booking experiences.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                        <feature.icon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">
                                        {feature.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop"
                                alt="Luxury Hotel"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-6">
                                <p className="text-white text-lg font-semibold">
                                    5-Star Luxury Awaits
                                </p>
                                <p className="text-white/80 text-sm">
                                    Join thousands of satisfied guests
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="relative">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                LuxeStay
                            </span>
                        </div>

                        <div className="mb-4 flex justify-end">
                            {/* Role Toggle Button */}
                            <button
                                type="button"
                                onClick={toggleRole}
                                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                            >
                                {loginRole === "user"
                                    ? "Switch to Admin"
                                    : "Switch to User"}
                            </button>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-3xl text-center font-bold text-gray-900 mb-2">
                                {loginRole === "user"
                                    ? "User Sign In"
                                    : "Admin Sign In"}
                            </h3>
                            <p className="text-gray-600 text-center">
                                Enter your credentials to access your{" "}
                                {loginRole} account
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <p className="text-sm font-medium text-green-700">
                                    {status}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                    isFocused
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
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
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
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

                            {/* Remember Me */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Remember me
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <PrimaryButton
                                className="w-full flex justify-center py-4 text-lg"
                                disabled={processing}
                            >
                                {processing ? "Signing in..." : "Sign In"}
                            </PrimaryButton>
                        </form>

                        {/* Register Link */}
                        {loginRole === "user" && (
                            <p className="mt-8 text-center text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    href={route("register")}
                                    className="font-semibold text-blue-600 hover:underline"
                                >
                                    Create Account
                                </Link>
                            </p>
                        )}
                    </div>

                    {/* Bottom Note */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        By signing in, you agree to our{" "}
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
