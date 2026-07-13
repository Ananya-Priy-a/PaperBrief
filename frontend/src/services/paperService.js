import axios from "axios";
import { supabase } from "@/lib/supabase";

const API = axios.create({
    baseURL: "http://localhost:8000",
});

export const uploadPaper = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    // Get logged-in user's JWT
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return API.post("/documents", formData, {
        headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getDocuments = async () => {

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return API.get("/documents", {
        headers: {
            Authorization: `Bearer ${session.access_token}`,
        },
    });
};
export const deleteDocument = async (documentId) => {

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return API.delete(`/documents/${documentId}`, {
        headers: {
            Authorization: `Bearer ${session.access_token}`,
        },
    });

};