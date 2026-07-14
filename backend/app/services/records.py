from typing import List, Dict, Optional
from app.supabase_client import get_supabase


def create_document_row(document_id: str, user_id: str, filename: str, storage_path: str, file_size_bytes: int) -> dict:
    supabase = get_supabase()
    result = supabase.table("documents").insert({
        "id": document_id,
        "user_id": user_id,
        "filename": filename,
        "storage_path": storage_path,
        "file_size_bytes": file_size_bytes,
        "status": "processing",
    }).execute()
    return result.data[0]


def update_document_status(document_id: str, status: str, page_count: Optional[int] = None):
    supabase = get_supabase()
    payload = {"status": status}
    if page_count is not None:
        payload["page_count"] = page_count
    supabase.table("documents").update(payload).eq("id", document_id).execute()


def list_documents(user_id: str) -> List[Dict]:
    supabase = get_supabase()
    result = (
        supabase.table("documents")
        .select("*")
        .eq("user_id", user_id)
        .order("uploaded_at", desc=True)
        .execute()
    )
    return result.data


def get_document(document_id: str, user_id: str) -> Optional[Dict]:
    supabase = get_supabase()
    result = (
        supabase.table("documents")
        .select("*")
        .eq("id", document_id)
        .eq("user_id", user_id)
        .execute()
    )
    return result.data[0] if result.data else None


def delete_document_row(document_id: str, user_id: str) -> bool:
    supabase = get_supabase()
    result = (
        supabase.table("documents")
        .delete()
        .eq("id", document_id)
        .eq("user_id", user_id)
        .execute()
    )
    return len(result.data) > 0


def create_chat_session(user_id: str, document_id: str, title: str) -> dict:
    supabase = get_supabase()
    result = supabase.table("chat_sessions").insert({
        "user_id": user_id,
        "document_id": document_id,
        "title": title,
    }).execute()
    return result.data[0]


def list_chat_sessions(user_id: str) -> List[Dict]:
    supabase = get_supabase()
    result = (
        supabase.table("chat_sessions")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


def get_chat_session(session_id: str, user_id: str) -> Optional[Dict]:
    supabase = get_supabase()
    result = (
        supabase.table("chat_sessions")
        .select("*")
        .eq("id", session_id)
        .eq("user_id", user_id)
        .execute()
    )
    return result.data[0] if result.data else None


def insert_chat_message(session_id: str, role: str, content: str) -> dict:
    supabase = get_supabase()
    result = supabase.table("chat_messages").insert({
        "session_id": session_id,
        "role": role,
        "content": content,
    }).execute()
    return result.data[0]


def get_session_messages(session_id: str, user_id: str) -> List[Dict]:
    supabase = get_supabase()
    result = (
        supabase.table("chat_messages")
        .select("*")
        .eq("session_id", session_id)
        .order("created_at", desc=False)
        .execute()
    )
    return result.data
