import { TrendingUp } from "lucide-react";

const StatCard = ({ name, value, trend, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-100 border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
        <div className="flex items-center justify-between mb-4">
            <div
                className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center shadow-md`}
            >
                <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
            <span
                className={`text-sm font-semibold text-gray-500 flex items-center gap-1`}
            >
                {trend && (
                    <>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        {trend}
                    </>
                )}
            </span>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-500">{name}</p>
    </div>
);

export default StatCard;
