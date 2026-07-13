import React from 'react';
import { logout } from "@/services/authService";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CloudUpload,
    History,
    FileText,
    LogOut,
    Plus,
} from 'lucide-react';
import Logo from './Logo';
import UserProfile from './UserProfile';

import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon: Icon, label, to, onNavigate }) => (
    <NavLink
        to={to}
        onClick={onNavigate}
        className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`
        }
    >
        {({ isActive }) => (
            <>
                <Icon
                    size={20}
                    className={
                        isActive
                            ? "text-white"
                            : "group-hover:scale-110 transition-transform"
                    }
                />
                <span className="text-sm font-semibold">{label}</span>
            </>
        )}
    </NavLink>

);

const Sidebar = ({ onNavigate }) => {
    const handleNavigate = () => {
        onNavigate?.();
    };
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;

    const isDashboard = path === '/dashboard';
    const isUpload = path === '/upload';
    const isChat = path === '/chat';
    const isMyPapers = path === "/my-papers";
    const isHistory = path === "/history";

    // Get correct logo size variant
    <Logo size="sidebar" showText />
    // Get icons based on route to preserve exact visual representation

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Logout failed");
        }
    };

    const newAnalysisButton = (
        <button
            onClick={() => {
                handleNavigate();
                navigate("/upload");
            }}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/25 transition-all active:scale-[0.98] mb-8 group"
        >
            <Plus
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
            />
            New Analysis
        </button>
    );

    return (
        <aside className="flex-none w-64 shrink-0 bg-white border-r border-slate-100 flex flex-col p-6 overflow-y-auto shrink-0 h-full">
            {/* Logo */}
            <div className="mb-10 px-2">
                <Logo size="sidebar" showText={true} />
            </div>

            {/* New Analysis */}
            {newAnalysisButton}

            {/* Navigation Menu */}
            <div className="space-y-1 mb-8">
                <SidebarItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    isActive={isDashboard}
                    to="/dashboard"
                    onNavigate={handleNavigate}
                />


                <SidebarItem
                    icon={FileText}
                    label="My Papers"
                    isActive={isMyPapers}
                    to="/my-papers"
                    onNavigate={handleNavigate}
                />

                <SidebarItem
                    icon={History}
                    label="History"
                    isActive={isHistory}
                    to="/history"
                    onNavigate={handleNavigate}
                />

                {/* Logout menu item (only on dashboard page) */}
                <button
                    onClick={async () => {

                        handleNavigate();

                        await handleLogout();

                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                    <LogOut
                        size={20}
                        className="group-hover:scale-110 transition-transform"
                    />
                    <span className="text-sm font-semibold">
                        Logout
                    </span>
                </button>
            </div>

            {/* Bottom section */}
            <div className="mt-auto pt-8 border-t border-slate-100 space-y-4">
                {/* "New Analysis" Button at the bottom for Upload page */}

            </div>
        </aside>
    );
};

export default Sidebar;
