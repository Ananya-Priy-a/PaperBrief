import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    FileText,
    ArrowRight,
    MessageSquare,
    FileSearch,
    ChevronDown,
    MoreVertical
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import PaperCard from '@/components/papers/PaperCard';
import { getDocuments } from "@/services/paperService";
import { getChatSessions } from "@/services/chatService";





// --- Main Component ---

const Dashboard = () => {
    const navigate = useNavigate();
    const [papers, setPapers] = useState([]);
    const [sessions, setSessions] = useState([]);
    useEffect(() => {

        async function loadDashboard() {

            try {

                const docs = await getDocuments();

                const chats = await getChatSessions();

                setPapers(docs.data);

                setSessions(chats.data);

            }

            catch (err) {

                console.error(err);

            }

        }

        loadDashboard();

    }, []);
    return (
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 italic">
                        Welcome Back
                    </h1>

                    <p className="text-slate-500 font-medium">
                        Manage your research papers and continue your AI conversations.
                    </p>
                </div>

            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">                <StatCard
                icon={FileText}
                label="Total Papers"
                value={papers.length}
                trend={`${papers.length} Uploaded`}
                trendLabel="Growth"
                colorClass="bg-blue-500"
            />
                <StatCard
                    icon={MessageSquare}
                    label="Recent Chats"
                    value={sessions.length}
                    trend="Total Sessions"
                    trendLabel="Last Activity"
                    colorClass="bg-purple-500"
                />

            </div>

            {/* Recently Uploaded Section */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Recently Uploaded</h3>
                    <button
                        onClick={() => navigate("/my-papers")}
                        className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all group"
                    >                        View all papers
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {papers.slice(0, 3).map((paper) => (

                        <PaperCard

                            key={paper.id}

                            id={paper.id}

                            title={paper.filename}

                            size={`${(paper.file_size / (1024 * 1024)).toFixed(2)} MB`}

                        />

                    ))}
                </div>
            </section>

        </div>
    );
};

export default Dashboard;