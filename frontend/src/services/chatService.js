import axios from "axios";
import { supabase } from "@/lib/supabase";

const API = axios.create({
    baseURL: "http://localhost:8000",
});
export const askQuestion = async (
    documentId,
    question,
    level = "undergraduate",
    mode = "normal",
    sessionId = null
) => {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    console.log("JWT:", session.access_token);
    console.log("Document ID:", documentId);

    return API.post(
        `/chat/${documentId}`,
        {
            question,
            level,
            mode,
            session_id: sessionId,
        },
        {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        }
    );
};
export const getChatSessions = async () => {

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return API.get("/chat/sessions", {

        headers: {

            Authorization: `Bearer ${session.access_token}`,

        },

    });

};
export const getSessionHistory = async (sessionId) => {

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return API.get(`/chat/sessions/${sessionId}`, {

        headers: {

            Authorization: `Bearer ${session.access_token}`,

        },

    });

};
