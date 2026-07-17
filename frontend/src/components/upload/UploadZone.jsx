import React, { useState, useRef } from 'react';
import { CloudUpload } from 'lucide-react';

const UploadZone = ({ onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);

    const handleBrowse = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            onUpload(files);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (onUpload) {
            onUpload(e.dataTransfer.files);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative h-80 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 bg-white ${isDragging
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-slate-200 hover:border-slate-300'
                }`}
        >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 animate-bounce-subtle">
                <CloudUpload size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Drag your PDF here</h3>
            <p className="text-slate-400 text-sm font-medium mb-8 text-center">
                Supports individual pdf files (Max 20MB)
            </p>
            <button
                type="button"
                onClick={handleBrowse}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
                Browse Files
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                hidden
                onChange={handleFileChange}
            />
        </div>
    );
};

export default UploadZone;
