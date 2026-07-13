import React from 'react';

const Logo = ({ size = 'sidebar', showText = false, className = '' }) => {
    // Determine the sizing classes based on layout needs.
    const containerSizeClass = size === 'login'
        ? 'w-12 h-12 mb-4 shadow-blue-500/20'
        : 'w-10 h-10 shadow-primary/20';

    const imgSizeClass = size === 'login' ? 'w-8 h-8 object-contain' : 'w-6 h-6';

    const bgGradientClass = size === 'upload'
        ? 'bg-gradient-to-br from-primary to-accent'
        : 'bg-gradient-to-br from-[#2563eb] to-[#7c3aed]';

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className={`${containerSizeClass} ${bgGradientClass} rounded-xl flex items-center justify-center shadow-lg`}>
                <img
                    src="/paperbrief-logo.png"
                    alt="PaperBrief AI"
                />
            </div>
            {showText && (
                <span className="font-bold text-slate-900 tracking-tight text-lg">PaperBrief AI</span>
            )}
        </div>
    );
};

export default Logo;
