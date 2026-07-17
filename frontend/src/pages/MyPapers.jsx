import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import {
    getDocuments,
    deleteDocument,
} from "@/services/paperService";
import PaperCard from "@/components/papers/PaperCard";
import { getChatSessions } from "@/services/chatService";
import { useNavigate } from "react-router-dom";
export default function MyPapers() {

    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {

        async function loadPapers() {

            try {

                const response = await getDocuments();

                setPapers(response.data);

            }
            catch (err) {

                console.error(err);

            }
            finally {

                setLoading(false);

            }

        }

        loadPapers();

    }, []);
    const handleOpen = (paper) => {

        navigate("/chat", {
            state: {
                documentId: paper.id,
                fileName: paper.filename,
                fileSize: paper.file_size,
            },
        });

    };

    const handleContinue = async (paper) => {

        try {

            const response = await getChatSessions();

            const existingSession = response.data.find(
                session => session.document_id === paper.id
            );

            navigate("/chat", {
                state: {
                    documentId: paper.id,
                    sessionId: existingSession?.id || null,
                    fileName: paper.filename,
                    fileSize: paper.file_size,
                },
            });

        }

        catch (err) {

            console.error(err);

            navigate("/chat", {
                state: {
                    documentId: paper.id,
                    fileName: paper.filename,
                    fileSize: paper.file_size,
                },
            });

        }

    };

    const handleDelete = async (paper) => {

        const confirmDelete = window.confirm(
            `Delete "${paper.filename}" ?`
        );

        if (!confirmDelete) return;

        try {

            await deleteDocument(paper.id);

            setPapers((prev) =>
                prev.filter((p) => p.id !== paper.id)
            );

        }

        catch (err) {

            console.error(err);

            alert("Failed to delete paper");

        }

    };
    return (

        <div className="p-4 md:p-8">

            <h1 className="text-3xl font-bold mb-8">

                My Papers

            </h1>

            {loading ? (

                <div className="flex justify-center items-center py-20">

                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>

                </div>

            ) : papers.length === 0 ? (

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-14 flex flex-col items-center justify-center text-center">

                    <FileText
                        size={56}
                        className="text-slate-400 mb-4"
                    />

                    <h2 className="text-2xl font-bold text-slate-700">
                        No Papers Uploaded
                    </h2>

                    <p className="text-slate-500 mt-3 max-w-md">
                        Upload your first research paper to begin analyzing, chatting, and managing your documents.
                    </p>

                    <button
                        onClick={() => navigate("/upload")}
                        className="mt-8 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition"
                    >
                        Upload Your First Paper
                    </button>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">

                    {papers.map((paper) => (

                        <PaperCard
                            key={paper.id}
                            id={paper.id}
                            title={paper.filename}
                            size={`${(paper.file_size / (1024 * 1024)).toFixed(2)} MB`}
                            onOpen={() => handleOpen(paper)}
                            onContinue={() => handleContinue(paper)}
                            onDelete={() => handleDelete(paper)}
                        />

                    ))}

                </div>

            )}

        </div>

    );

}