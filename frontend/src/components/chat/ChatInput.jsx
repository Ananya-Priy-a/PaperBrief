import React, { useRef } from 'react';
import { Paperclip, Send } from 'lucide-react';

const ChatInput = ({
    value,
    onChange,
    onSubmit,
    onFileUpload,
}) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    const fileInputRef = useRef(null);
    return (
        <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-4xl mx-auto"
            >
                <div className="bg-slate-50 border-2 border-transparent focus-within:border-primary/20 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-primary/5 transition-all rounded-3xl p-4">
                    <input
                        type="file"
                        accept=".pdf"
                        ref={fileInputRef}
                        hidden
                        onChange={(e) => {
                            if (e.target.files.length > 0) {
                                onFileUpload(e.target.files[0]);
                            }
                        }}
                    />
                    <textarea
                        value={value}
                        onChange={onChange}
                        placeholder="Ask about this paper..."
                        rows="1"
                        className="w-full resize-none bg-transparent px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 border-none focus:outline-none focus:ring-0 min-h-[44px] max-h-40 overflow-y-auto"
                        onKeyDown={handleKeyDown}
                    />

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-1 flex-wrap">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                            >
                                <Paperclip size={20} />
                            </button>

                        </div>

                        <div className="flex items-center gap-2 shrink-0">

                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition"
                            >
                                Send
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <p className="text-center text-[10px] text-slate-400 mt-4 font-medium">
                PaperBrief AI can make mistakes. Always verify critical technical data.
            </p>
        </div>
    );
};

export default ChatInput;
