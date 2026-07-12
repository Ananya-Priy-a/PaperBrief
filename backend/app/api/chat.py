import json
import re

from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_current_user
from app.models.schemas import Query
from app.services.hybrid_retriever import hybrid_search
from app.services.prompt_builder import build_prompt
from app.services.groq_client import ask_gork_with_fallback
from app.services import records

router = APIRouter(prefix="/chat", tags=["chat"])


def _clean_and_parse(raw_text: str):
    cleaned = raw_text.strip()
    if cleaned.startswith("```") and cleaned.endswith("```"):
        cleaned = re.sub(r"^```json\s*|```$", "", cleaned, flags=re.IGNORECASE).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {"raw_response": cleaned}


@router.post("/{document_id}")
async def ask_question(document_id: str, query: Query, user: dict = Depends(get_current_user)):
    user_id = user["sub"]

    document = records.get_document(document_id, user_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found.")

    if query.session_id:
        session = records.get_chat_session(query.session_id, user_id)
        if session is None:
            raise HTTPException(status_code=404, detail="Chat session not found.")
        session_id = session["id"]
    else:
        session = records.create_chat_session(
            user_id=user_id,
            document_id=document_id,
            title=query.question[:60],
        )
        session_id = session["id"]

    results = hybrid_search(document_id, query.question)
    prompt = build_prompt(results, query.question, query.mode, query.level)
    llm_result = ask_gork_with_fallback(prompt)
    if isinstance(llm_result, dict):
        llm_text = llm_result.get("text", "")
        model_used = llm_result.get("model", "unknown")
    else:
        llm_text = llm_result
        from app.core.config import settings
        model_used = settings.GORK_MODELS[0] if settings.GORK_MODELS else "unknown"

    parsed = _clean_and_parse(llm_text)

    records.insert_chat_message(session_id, role="user", content=query.question)
    records.insert_chat_message(session_id, role="assistant", content=json.dumps(parsed))

    sources = [
        {"chunk_id": r["metadata"]["id"], "page": r["metadata"]["page"]}
        for r in results
    ]

    return {
        "answer": parsed,
        "session_id": session_id,
        "sources": sources,
        "model_used": model_used,
    }


@router.get("/sessions")
async def list_sessions(user: dict = Depends(get_current_user)):
    return records.list_chat_sessions(user["sub"])


@router.get("/sessions/{session_id}")
async def get_session_history(session_id: str, user: dict = Depends(get_current_user)):
    session = records.get_chat_session(session_id, user["sub"])
    if session is None:
        raise HTTPException(status_code=404, detail="Chat session not found.")
    messages = records.get_session_messages(session_id, user["sub"])
    return {"session": session, "messages": messages}
