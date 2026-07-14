import React, { useState } from 'react';
import {
    Plus,
    FileText,
    CheckCircle2
} from 'lucide-react';
import UploadZone from '@/components/upload/UploadZone';
import { uploadPaper } from "@/services/paperService";
import { useNavigate } from "react-router-dom";

/**
 * UploadPaper Component for PaperBrief AI
 * Built with React, Tailwind CSS v4, and Lucide Icons.
 * Features a professional drag-and-drop zone and management for research papers.
 */

// --- Sub-components ---

const UploadTip = ({ text }) => (
    <div className="flex gap-3 items-start">
        <div className="mt-0.5 bg-primary/10 p-1 rounded-full text-primary shrink-0">
            <CheckCircle2 size={14} />
        </div>
        <p className="text-xs font-medium text-slate-600 leading-relaxed">{text}</p>
    </div>
);

// --- Main Component ---

const UploadPaper = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    const handleUploadToServer = async () => {
        if (!selectedFile) return;

        setIsUploading(true);

        try {
            const response = await uploadPaper(selectedFile);

            setSelectedFile(null);

            navigate("/chat", {
                state: {
                    documentId: response.data.document_id,
                    fileName: selectedFile.name,
                    fileSize: selectedFile.size,
                },
            });

        } catch (error) {
            console.error(error);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };
    const handleUpload = (files) => {
        if (!files || files.length === 0) return;

        const file = files[0];

        setSelectedFile(file);

    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">

            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 italic">Upload Research Papers</h1>
                <p className="text-slate-500 font-medium max-w-2xl">
                    Expand your knowledge base. Upload PDF documents to start deep-learning analysis, citation mapping, and intelligent summarization.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                {/* Upload Zone & Progress */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <UploadZone onUpload={handleUpload} />
                    {selectedFile && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <FileText className="text-primary" size={24} />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {selectedFile.name}
                                        </h3>

                                        <p className="text-sm text-slate-500">
                                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-5">


                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="px-5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleUploadToServer}
                                        className="px-5 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition"
                                    >
                                        Upload Paper
                                    </button>

                                </div>


                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Cards */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-6">Upload Tips</h4>
                        <div className="space-y-6">
                            <UploadTip text="Upload text-based PDF documents for the best AI analysis." />
                            <UploadTip text="Ask specific questions to receive more accurate responses." />
                            <UploadTip text="Larger documents may take a few seconds to process before chatting." />
                        </div>
                    </div>


                </div>

            </div>

            {
                isUploading && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">

                        <div className="bg-white rounded-3xl shadow-xl p-8 text-center w-80">

                            <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>

                            <h2 className="text-xl font-bold">
                                Uploading Paper...
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Please wait while your document is uploaded.
                            </p>

                        </div>

                    </div>
                )
            }
        </div>
    );
};

export default UploadPaper;
