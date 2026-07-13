import { useEffect, useState } from "react";
import { getChatSessions } from "@/services/chatService";
import { useNavigate } from "react-router-dom";

export default function History() {

    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);

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

        }

        loadHistory();

    }, []);

    return (

        <div className="p4 md:p-8">

            <h1 className="text-3xl font-bold mb-8">

                History

            </h1>

            <div className="space-y-4">

                {sessions.map(session => (

                    <div
                        key={session.id}
                        onClick={() => navigate("/chat", {
                            state: {
                                sessionId: session.id,
                                documentId: session.document_id,
                            },
                        })}

                        className="bg-white p-5 rounded-xl shadow"

                    >

                        <h2 className="font-semibold">

                            {session.title}

                        </h2>

                        <p className="text-sm text-gray-500">
                            {new Date(session.created_at).toLocaleString()}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}