import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    Menu,
    X,
    Home,
    Calendar,
    DoorOpen,
    Settings,
    User,
    LogOut,
} from "lucide-react";
import AlertDialog from "@/Components/AlertDialog";

export default function CustomerLayout({ children }) {
    const { url } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

    const navItems = [
        {
            name: "Dashboard",
            href: route("customer.dashboard"),
            icon: Home,
            key: "customer.dashboard",
        },
        {
            name: "Reservations",
            href: route("customer.reservations"),
            icon: Calendar,
            key: "customer.reservations",
        },
        {
            name: "Rooms",
            href: route("customer.rooms"),
            icon: DoorOpen,
            key: "customer.rooms",
        },
        {
            name: "Settings",
            href: route("customer.settings"),
            icon: Settings,
            key: "customer.settings",
        },
    ];

    const handleLogout = () => {
        setIsLogoutAlertOpen(false);
        router.post(route("logout"));
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                } shadow-2xl`}
            >
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Customer Portal
                                </h1>
                                <p className="text-xs text-gray-400">
                                    Manage your bookings
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        // ⭐ FIXED isActive here:
                        const isActive = route().current(item.key);

                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    isActive
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-105"
                                        : "hover:bg-gray-700/50 hover:translate-x-1"
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon
                                        className={`w-5 h-5 ${
                                            isActive
                                                ? "text-white"
                                                : "text-gray-400 group-hover:text-white"
                                        }`}
                                    />
                                    <span
                                        className={`font-medium ${
                                            isActive
                                                ? "text-white"
                                                : "text-gray-300"
                                        }`}
                                    >
                                        {item.name}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                    <div className="bg-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                                JD
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-white">
                                    John Doe
                                </p>
                                <p className="text-xs text-gray-400">
                                    john@example.com
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsLogoutAlertOpen(true)}
                            className="mt-4 flex items-center justify-center w-full px-4 py-3 rounded-xl text-red-400 bg-red-900/30 hover:bg-red-900/50 transition-colors duration-200"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            <span className="font-medium">Log Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
                    <div className="flex items-center justify-between p-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Customer Portal
                        </h2>
                        <div className="w-6" />
                    </div>
                </header>

                <main className="flex-1 overflow-auto">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 min-h-[calc(100vh-12rem)]">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <AlertDialog
                isOpen={isLogoutAlertOpen}
                onClose={() => setIsLogoutAlertOpen(false)}
                onConfirm={handleLogout}
                title="Confirm Logout"
                description="Are you sure you want to log out of your account?"
            />
        </div>
    );
}
