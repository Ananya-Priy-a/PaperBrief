import React from 'react';
import {
    FileText,
    CheckCircle2,
    Trash2
} from "lucide-react";
const PaperCard = ({
    variant = "dashboard",
    id,
    title,
    author,
    date,
    status = "Processed",
    image,
    size,
    onContinue,
    onDelete,
}) => {
    if (variant === 'upload') {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden border-b border-slate-50">
                    <img
                        src={image || "/api/placeholder/400/300"}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                        <FileText size={12} className="text-primary" />
                        <span className="text-[10px] font-bold text-slate-900 uppercase">PDF</span>
                    </div>
                </div>
                <div className="p-4">
                    <h4 className="text-xs font-bold text-slate-900 mb-1 truncate">{title}</h4>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{size}</span>
                        <button className="text-slate-300 hover:text-slate-600 transition-colors">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Default: 'dashboard' variant
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-36 bg-slate-100 overflow-hidden rounded-t-2xl flex items-center justify-center">
                <FileText
                    size={60}
                    className="text-slate-300"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <FileText size={12} className="text-primary" />
                    <span className="text-[10px] font-bold text-slate-900 line-clamp-2 uppercase">PDF</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="p-4">
                <h4 className="font-bold text-slate-900 line-clamp-2 leading-snug mb-1 line-clamp-2 min-h-[2.5rem]">
                    {title}
                </h4>
                <p className="text-xs font-medium text-slate-500 mb-4">{author}</p>

                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-5">
                    <div className="flex items-center gap-3 mt-4">
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle2 size={12} />
                        <span>{status}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-4">

                    <button
                        onClick={onContinue}
                        className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary/10 active:scale-95"
                    >
                        Continue Chat
                    </button>

                    <button
                        onClick={onDelete}
                        className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 transition-all"
                        title="Delete Paper"
                    >
                        <Trash2 size={18} />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default PaperCard;
