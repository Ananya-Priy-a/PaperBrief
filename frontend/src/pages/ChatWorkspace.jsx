import React, { useState, useEffect, useRef } from 'react';
import { getDocuments, uploadPaper } from "@/services/paperService";
import {
    askQuestion,
    getSessionHistory,
} from "@/services/chatService"; import {
    Sparkles,
    FileText,
} from 'lucide-react';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import { useLocation, useNavigate } from "react-router-dom";

const ChatWorkspace = () => {
    const location = useLocation();
    const [mode, setMode] = useState("normal");
    const [level, setLevel] = useState("undergraduate");
    const navigate = useNavigate();

    const state = location.state || {};

    const {
        documentId: initialDocumentId,
        sessionId: previousSessionId,
    } = state;

    const [documentId, setDocumentId] = useState(initialDocumentId || "");

    const [fileName, setFileName] = useState(state.fileName || "");
    const [fileSize, setFileSize] = useState(state.fileSize || 0);
    useEffect(() => {

        if (!documentId) {
            navigate("/my-papers");
        }

    }, [documentId, navigate]);

    useEffect(() => {

        if (!previousSessionId) return;

        async function loadPreviousChat() {
            try {

                const response = await getSessionHistory(previousSessionId);
                const docsResponse = await getDocuments();
                const currentDocument = docsResponse.data.find(
                    doc => doc.id === response.data.session.document_id
                );

                if (currentDocument) {

                    setFileName(currentDocument.filename);

                    setFileSize(currentDocument.file_size_bytes);

                }

                console.log("Documents Response:", docsResponse.data);
                console.log(response.data.messages);
                console.log(response.data);

                const history = response.data.messages.map(msg => ({

                    id: msg.id,

                    text: (() => {

                        if (msg.role !== "assistant") return msg.content;

                        try {

                            const answer = JSON.parse(msg.content);

                            if (answer.raw_response) {
                                return answer.raw_response;
                            }

                            let formatted = "";

                            formatted += `📄 MAIN IDEA\n\n${answer.main_idea || "Not available"}\n\n`;

                            if (answer.key_concepts?.length) {

                                formatted += "🔑 KEY CONCEPTS\n\n";

                                answer.key_concepts.forEach((item, index) => {

                                    formatted += `${index + 1}. ${item.concept}\n`;
                                    formatted += `${item.explanation}\n\n`;

                                });

                            }



                            if (answer.simple_summary) {

                                formatted += `📝 SIMPLE SUMMARY\n\n${answer.simple_summary}`;

                            }

                            return formatted;

                        }

                        catch {

                            return msg.content;

                        }

                    })(),

                    isAI: msg.role === "assistant",

                    time: new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),

                }));
                console.log(history);
                setMessages(history);

            }

            catch (err) {

                console.error(err);

            }

        }

        loadPreviousChat();

    }, [previousSessionId]);


    console.log("Document ID:", documentId);
    const initialMessage = {
        id: 1,
        text: "Your document has been uploaded successfully. Ask me anything about it.",
        isAI: true,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };

    const [messages, setMessages] = useState([initialMessage]);
    const [sessionId, setSessionId] = useState(
        previousSessionId || null);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    const handleFileUpload = async (file) => {
        try {

            const response = await uploadPaper(file);

            // Update document information
            setDocumentId(response.data.document_id);
            setFileName(file.name);
            setFileSize(file.size);

            // Reset chat
            setSessionId(null);

            setMessages([
                {
                    id: Date.now(),
                    text: "Your document has been uploaded successfully. Ask me anything about it.",
                    isAI: true,
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);

        } catch (err) {

            console.error(err);
            alert("Upload failed");

        }
    };
    const handleSendMessage = async (e) => {

        e.preventDefault();

        if (!inputValue.trim()) return;

        const question = inputValue;

        setMessages(prev => [

            ...prev,

            {
                id: Date.now(),
                text: question,
                isAI: false,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },

        ]);

        setInputValue("");

        setIsTyping(true);

        try {

            const response = await askQuestion(
                documentId,
                question,
                level,
                mode,
                sessionId
            );

            console.log(response.data);

            setSessionId(response.data.session_id);

            const answer = response.data.answer;

            let formattedResponse = "";

            if (typeof answer === "string") {

                formattedResponse = answer;

            } else if (answer.raw_response) {

                formattedResponse = answer.raw_response;

            } else {

                formattedResponse += `📄 MAIN IDEA\n\n${answer.main_idea || "Not available"}\n\n`;

                if (answer.key_concepts?.length) {

                    formattedResponse += "🔑 KEY CONCEPTS\n\n";

                    answer.key_concepts.forEach((item, index) => {

                        formattedResponse += `${index + 1}. ${item.concept}\n`;
                        formattedResponse += `${item.explanation}\n\n`;

                    });

                }

                if (answer.equations_explained) {

                    formattedResponse += `📐 EQUATIONS\n\n${answer.equations_explained}\n\n`;

                }

                if (answer.real_world_example) {

                    formattedResponse += `🌍 REAL WORLD EXAMPLE\n\n${answer.real_world_example}\n\n`;

                }

                if (answer.simple_summary) {

                    formattedResponse += `📝 SIMPLE SUMMARY\n\n${answer.simple_summary}`;

                }

            }

            setMessages(prev => [

                ...prev,

                {

                    id: Date.now() + 1,

                    text: formattedResponse,

                    isAI: true,

                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),

                },

            ]);

        }
        catch (error) {

            console.error(error);

            alert("Failed to get AI response");

        }
        finally {

            setIsTyping(false);

        }

    };
    console.log("Messages State:", messages);
    return (
        <div className="flex flex-col lg:flex-row h-full overflow-hidden">

            <main className="flex-1 flex flex-col min-w-0 bg-white relative overflow-hidden">

                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 bg-slate-50/30"
                >
                    <div className="w-full max-w-4xl mx-auto">
                        {messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                message={msg}
                                isAI={msg.isAI}
                            />
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-6 animate-pulse">
                                <Sparkles size={14} className="text-primary" />
                                PaperBrief is thinking...
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Container */}
                <ChatInput
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onSubmit={handleSendMessage}
                    onFileUpload={handleFileUpload}
                    mode={mode}
                    setMode={setMode}
                    level={level}
                    setLevel={setLevel}
                />
            </main>

            {/* 3. Right Details Panel */}
            <aside className="hidden xl:flex w-[360px] shrink-0 flex-col border-l border-slate-100 bg-[#faf8ff] p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-slate-900 tracking-tight">Paper Details</h3>
                </div>

                {/* Paper Preview Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
                    <div className="w-full aspect-[4/3] bg-slate-50 rounded-xl mb-5 flex items-center justify-center border border-slate-100 relative overflow-hidden">                        <FileText size={48} className="text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 bg-primary text-[10px] font-bold text-white px-2 py-0.5 rounded shadow-sm">PDF</div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Title</span>
                            <h4 className="text-sm font-bold text-slate-900 leading-snug break-words">
                                {fileName || "Research Paper"}
                            </h4>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Size</span>
                                <p className="text-xs font-bold text-slate-900">{fileSize
                                    ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB`
                                    : "--"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default ChatWorkspace;