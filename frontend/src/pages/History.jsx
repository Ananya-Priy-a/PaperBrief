import { useEffect, useState } from "react";
import {
    getChatSessions,
    deleteDocument,
} from "@/services/chatService";
import { useNavigate } from "react-router-dom";
import { Trash2, History as HistoryIcon } from "lucide-react";
export default function History() {

    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {

        async function loadHistory() {

            try {

                const response = await getChatSessions();

                console.log(response.data);

                setSessions(response.data);

            }

            catch (err) {

                console.error(err);

            }
            finally {

                setLoading(false);

            }

        }

        loadHistory();

    }, []);
    const handleDelete = async (documentId, e) => {

        e.stopPropagation();

        const confirmDelete = window.confirm(
            "Delete this paper permanently?"
        );

        if (!confirmDelete) return;

        try {

            await deleteDocument(documentId);

            setSessions((prev) =>
                prev.filter(
                    (session) =>
                        session.document_id !== documentId
                )
            );

        } catch (err) {

            console.error(err);

            alert("Failed to delete document.");

        }

    };

    return (

        <div className="p4 md:p-8">

            <h1 className="text-3xl font-bold mb-8">

                History

            </h1>

            {loading ? (

                <div className="flex justify-center items-center py-20">

                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>

                </div>

            ) : sessions.length === 0 ? (

                <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow p-12 text-center">

                    <HistoryIcon
                        size={56}
                        className="text-gray-400 mb-4"
                    />

                    <h2 className="text-xl font-semibold text-gray-700">
                        No History Yet
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Upload a research paper and start chatting to see your history here.
                    </p>

                </div>

            ) : (

                <div className="space-y-4">

                    {sessions.map(session => (

                        <div
                            key={session.id}
                            onClick={() =>
                                navigate("/chat", {
                                    state: {
                                        sessionId: session.id,
                                        documentId: session.document_id,
                                    },
                                })
                            }
                            className="bg-white p-5 rounded-xl shadow flex justify-between items-center cursor-pointer hover:shadow-md transition"
                        >

                            <div>

                                <h2 className="font-semibold">
                                    {session.title}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {new Date(session.created_at).toLocaleString()}
                                </p>

                            </div>

                            <button
                                onClick={(e) =>
                                    handleDelete(session.document_id, e)
                                }
                                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                            >
                                <Trash2 size={18} />
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}