import React, { useState } from "react";
import {
    LayoutDashboard,
    Calendar,
    Hotel,
    CreditCard,
    Users,
    Settings,
    Menu,
    ChevronDown,
    Sparkles,
    Bell,
    Search,
    LogOut,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { Toaster } from "@/components/ui/toaster";

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedMenu, setExpandedMenu] = useState(null);
    const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const { url } = usePage();
    const user = usePage().props.auth.user;
    // console.log(user);
    // console.log(user.first_name);
    // console.log(user.last_name);

    const menuItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            path: "admin.dashboard",
        },
        {
            name: "Reservations",
            icon: Calendar,
            submenu: [
                {
                    name: "All Bookings",
                    path: "admin.reservations.all-bookings",
                },
                { name: "Pending", path: "admin.reservations.pending" },
                { name: "Walk-in", path: "admin.bookings.walkin" },
            ],
        },
        {
            name: "Room Management",
            icon: Hotel,
            submenu: [
                { name: "All Rooms", path: "admin.rooms.all" },
                { name: "Room Types", path: "admin.room_types.index" },
                { name: "Availability", path: "admin.rooms.availability" },
            ],
        },
        {
            name: "Payments",
            icon: CreditCard,
            submenu: [
                { name: "All Transactions", path: "admin.payments.all" },
                { name: "Pending Payments", path: "admin.payments.pending" },
                { name: "Refunds", path: "admin.payments.refunds" },
            ],
        },
        {
            name: "Guests & Users",
            icon: Users,
            submenu: [
                { name: "All Customers", path: "admin.users.customers" },
                { name: "Admin Accounts", path: "admin.users.admins" }, // New link
            ],
        },
        {
            name: "Settings",
            icon: Settings,
            submenu: [{ name: "General", path: "admin.settings.general" }],
        },
    ];

    const isSubMenuActive = (sub) =>
        url.includes(sub.path.replace("admin.", "/admin/"));

    const isMenuActive = (item) => {
        if (item.submenu) {
            return item.submenu.some((sub) =>
                url.includes(sub.path.replace("admin.", "/admin/"))
            );
        }
        return url.includes(item.path.replace("admin.", "/admin/"));
    };

    const toggleSubmenu = (menuName) => {
        setExpandedMenu((prev) => (prev === menuName ? null : menuName));
    };

    const getActiveMenuName = () => {
        for (const item of menuItems) {
            if (item.submenu) {
                const match = item.submenu.find((sub) => isSubMenuActive(sub));
                if (match) return match.name;
            }
            if (isMenuActive(item)) return item.name;
        }
        return "Dashboard";
    };

    const activeMenuName = getActiveMenuName();

    const renderMenuItemContent = (item) => (
        <>
            <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {sidebarOpen && (
                    <span className="font-medium">{item.name}</span>
                )}
            </div>

            {sidebarOpen && (
                <div className="flex items-center gap-2">
                    {item.badge && (
                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full font-semibold">
                            {item.badge}
                        </span>
                    )}
                    {item.submenu && (
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                                expandedMenu === item.name ? "rotate-180" : ""
                            }`}
                        />
                    )}
                </div>
            )}
        </>
    );

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* SIDEBAR */}
            <aside
                className={`${
                    sidebarOpen ? "w-72" : "w-20"
                } fixed left-0 top-0 h-screen z-50 bg-white border-r border-gray-200 
                  transition-all duration-300 ease-in-out flex flex-col shadow-sm`}
            >
                <div className="flex items-center justify-between p-6 border-b">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    LuxStay
                                </h1>
                                <p className="text-xs text-gray-500">
                                    Admin Panel
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto cursor-pointer shadow-md"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                    )}

                    {sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>

                {/* MENU */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {menuItems.map((item) => (
                        <div key={item.name}>
                            {item.submenu ? (
                                <button
                                    onClick={() => toggleSubmenu(item.name)}
                                    className={`flex items-center w-full justify-between px-4 py-3 rounded-xl transition-all
                                        ${
                                            isMenuActive(item)
                                                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {renderMenuItemContent(item)}
                                </button>
                            ) : (
                                <Link
                                    href={route(item.path)}
                                    className={`flex items-center w-full justify-between px-4 py-3 rounded-xl transition-all
                                        ${
                                            isMenuActive(item)
                                                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {renderMenuItemContent(item)}
                                </Link>
                            )}

                            {/* SUBMENU with animation */}
                            {sidebarOpen && item.submenu && (
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out
                                        ${
                                            expandedMenu === item.name
                                                ? "max-h-[500px] opacity-100 mt-1"
                                                : "max-h-0 opacity-0"
                                        }
                                    `}
                                >
                                    <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-1">
                                        {item.submenu.map((sub) => (
                                            <Link
                                                key={sub.name}
                                                href={route(sub.path)}
                                                className={`w-full block px-4 py-2 rounded-lg text-sm transition
                                                    ${
                                                        isSubMenuActive(sub)
                                                            ? "bg-indigo-50 text-indigo-700 font-medium"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                    }`}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* FOOTER USER INFO */}
                {sidebarOpen && (
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {user.first_name ? user.first_name[0] : ""}
                                {user.last_name ? user.last_name[0] : ""}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-900">
                                    {user.first_name} {user.last_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Administrator
                                </p>
                            </div>
                            <button
                                onClick={() => setLogoutDialogOpen(true)}
                                className="p-2 hover:bg-gray-200 rounded-lg"
                            >
                                <LogOut className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            {/* MAIN CONTENT */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${
                    sidebarOpen ? "ml-72" : "ml-20"
                }`}
            >
                <header className="bg-white border-b shadow-sm">
                    <div className="flex items-center justify-between px-8 py-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {activeMenuName}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Manage your hotel efficiently
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-xl">
                                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {user.first_name ? user.first_name[0] : ""}
                                    {user.last_name ? user.last_name[0] : ""}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {user.first_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Admin
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
                <Toaster />
            </div>

            {/* LOGOUT DIALOG */}
            {isLogoutDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Confirm Logout
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to log out of your account?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setLogoutDialogOpen(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                            >
                                Log Out
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
