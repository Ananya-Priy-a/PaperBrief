import React from 'react';

const StatCard = ({ icon: Icon, label, value, trend, trendLabel, colorClass }) => {
    // Generate text color class from colorClass (e.g. bg-blue-500 -> text-blue-500)
    const textColorClass = colorClass.replace('bg-', 'text-');

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                    <Icon size={24} className={textColorClass} />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                        {trend}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{trendLabel}</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</span>
                <span className="text-3xl font-bold text-slate-900">{value}</span>
            </div>
        </div>
    );
};

export default StatCard;
