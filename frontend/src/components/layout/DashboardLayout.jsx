import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import TopNavbar from "@/components/layout/TopNavbar";

export default function DashboardLayout() {
    const location = useLocation();
    const isChat = location.pathname === "/chat";

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#faf8ff] overflow-auto md:overflow-hidden">

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 z-50 bg-black/40 transition-opacity md:hidden ${sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                onClick={() => setSidebarOpen(false)}
            >
                <div
                    className="w-72 h-full bg-white"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Sidebar onNavigate={() => setSidebarOpen(false)} />
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-y-auto">

                {/* Mobile Header */}
                <div className="md:hidden h-16 bg-white flex items-center px-4 border-b">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu size={28} />
                    </button>

                    <h1 className="ml-4 font-bold text-lg">
                        PaperBrief AI
                    </h1>
                </div>

                {isChat && <TopNavbar />}

                <Outlet />

            </div>
        </div>
    );
}