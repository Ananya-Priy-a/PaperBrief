import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
    Moon,
    Sun,
    FileText,
} from 'lucide-react';

const TopNavbar = () => {
    const location = useLocation();
    const path = location.pathname;
    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);

        document.documentElement.classList.toggle("dark");
    };
    const isDashboard = path === '/dashboard';
    const isUpload = path === '/upload';
    const isChat = path === '/chat';

    // If it's the chat page, render the specialized chat header layout
    if (isChat) {
        return (
            <header className="flex-none h-20 border-b border-slate-50 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 leading-none mb-1 truncate max-w-md">
                            {location.state?.fileName || "Research Paper"}
                        </h2>
                        <p className="text-xs font-medium text-slate-400">
                            AI Chat Workspace
                        </p>
                    </div>
                </div>
            </header>
        );
    }


    return (
        <header className="h-20 border-b border-slate-100 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">

            {/* Right side items */}
            <div className="flex items-center justify-end w-full">

                <button
                    onClick={toggleDarkMode}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
                >
                    {darkMode ? (
                        <Sun size={20} />
                    ) : (
                        <Moon size={20} />
                    )}
                </button>

            </div>
            {/* Upload Page specific navigation links */}


            {/* Notifications & Theme toggles */}
            <div className="flex items-center gap-1">

            </div>

        </header>
    );
};

export default TopNavbar;
