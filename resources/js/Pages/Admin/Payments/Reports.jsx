import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { DollarSign, RefreshCw, BarChart2, CalendarDays } from "lucide-react";

// Helper to format dates to 'YYYY-MM-DD'
const formatDate = (date) => date.toISOString().split('T')[0];

// Mock data generation for reports
const generateMockReportData = (days) => {
    const data = {
        totalRevenue: 0,
        totalRefunds: 0,
        transactionCount: 0,
        revenueByDay: [],
    };

    let currentRevenue = 50000 + Math.floor(Math.random() * 10000);
    let currentRefunds = 2000 + Math.floor(Math.random() * 500);
    let currentTransactions = 200 + Math.floor(Math.random() * 50);

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);

        const dailyRevenue = Math.floor(Math.random() * 1000) + 100;
        const dailyRefunds = Math.floor(Math.random() * 50);
        const dailyTransactions = Math.floor(Math.random() * 10) + 2;

        data.totalRevenue += dailyRevenue;
        data.totalRefunds += dailyRefunds;
        data.transactionCount += dailyTransactions;

        data.revenueByDay.push({
            date: dateStr,
            revenue: dailyRevenue,
            refunds: dailyRefunds,
            transactions: dailyTransactions,
        });
    }

    return data;
};

const Reports = () => {
    const [dateRange, setDateRange] = useState("30"); // '7', '30', '90', 'custom'
    const [reportData, setReportData] = useState(generateMockReportData(30));

    useEffect(() => {
        const days = parseInt(dateRange);
        if (!isNaN(days)) {
            setReportData(generateMockReportData(days));
        }
        // Handle custom date range logic if implemented
    }, [dateRange]);

    const handleDateRangeChange = (e) => {
        setDateRange(e.target.value);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Financial Reports</h1>
                        <p className="text-gray-500 mt-1">Overview of payment trends and key financial metrics.</p>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-gray-600 mr-2">Date Range</label>
                        <select onChange={handleDateRangeChange} value={dateRange} className="w-48 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">${reportData.totalRevenue.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-10 h-10 text-green-500 bg-green-50 p-2 rounded-full"/>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Refunds</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">${reportData.totalRefunds.toFixed(2)}</p>
                        </div>
                        <RefreshCw className="w-10 h-10 text-red-500 bg-red-50 p-2 rounded-full"/>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{reportData.transactionCount}</p>
                        </div>
                        <BarChart2 className="w-10 h-10 text-blue-500 bg-blue-50 p-2 rounded-full"/>
                    </div>
                </div>

                {/* Revenue Trend (Placeholder Chart) */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue Trend</h2>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                        <CalendarDays className="w-8 h-8 mr-2"/>
                        <p>Chart placeholder for revenue trend over the selected period.</p>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                        {/* Simple text representation of data for demonstration */}
                        <p>Daily Revenue Data (last 3 entries):</p>
                        {reportData.revenueByDay.slice(-3).map((item, index) => (
                            <p key={index}>{item.date}: ${item.revenue.toFixed(2)} (Transactions: {item.transactions})</p>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Reports;