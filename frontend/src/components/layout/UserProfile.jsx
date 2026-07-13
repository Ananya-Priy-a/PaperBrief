import React from 'react';
import { ChevronDown, LogOut } from 'lucide-react';

const UserProfile = ({ variant = 'navbar-full', name = 'Dr. Aris', role = 'Pro Researcher', avatar = '/api/placeholder/40/40' }) => {
    if (variant === 'sidebar') {
        const initials = name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();

        return (
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl w-full">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {initials}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">{name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role}</span>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <LogOut size={18} />
                </button>
            </div>
        );
    }

    if (variant === 'navbar-simple') {
        return (
            <button className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border-2 border-slate-100 hover:border-primary transition-all">
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            </button>
        );
    }

    // Default: 'navbar-full' (for Dashboard)
    return (
        <button className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-2xl transition-all group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none mb-1">{name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:translate-y-0.5 transition-transform" />
        </button>
    );
};

export default UserProfile;
