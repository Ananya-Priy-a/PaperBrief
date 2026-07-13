import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import UploadPaper from "@/pages/UploadPaper";
import ChatWorkspace from "@/pages/ChatWorkspace";
import DashboardLayout from "@/components/layout/DashboardLayout";
import History from "@/pages/History";
import MyPapers from "@/pages/MyPapers";
import Settings from "@/pages/Settings";
import Signup from "@/pages/Signup";
export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/upload" element={<UploadPaper />} />
                    <Route path="/chat" element={<ChatWorkspace />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/my-papers" element={<MyPapers />} />
                    <Route path="/settings" element={<Settings />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}