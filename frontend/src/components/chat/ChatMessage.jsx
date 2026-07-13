import React, { useState } from 'react';
import { Sparkles, User, Copy, Check } from 'lucide-react';

const ChatMessage = ({ message, isAI }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} mb-6 group`}>
            <div className={`flex items-start gap-3 max-w-[80%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${isAI
                    ? 'bg-gradient-to-br from-primary to-accent text-white'
                    : 'bg-slate-200 text-slate-600'
                    }`}>
                    {isAI ? <Sparkles size={16} /> : <User size={16} />}
                </div>

                <div className="flex flex-col gap-2">
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${isAI
                        ? 'bg-white border border-slate-100 shadow-sm text-slate-800'
                        : 'bg-primary text-white shadow-md shadow-primary/10'
                        }`}>
                        <pre className="whitespace-pre-wrap break-words font-sans text-sm">
                            {typeof message.text === "string"
                                ? message.text
                                : JSON.stringify(message.text, null, 2)}
                        </pre>                        {message.citation && (
                            <div className="mt-3 pt-3 border-t border-slate-100 italic text-slate-500 text-xs">
                                {message.citation}
                            </div>
                        )}
                    </div>

                    <div className={`flex items-center gap-4 px-1 ${isAI ? 'justify-start' : 'justify-end'}`}>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            {message.time}
                        </span>
                        {isAI && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={handleCopy} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
