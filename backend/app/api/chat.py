import json
import re

from fastapi import APIRouter

from app.models.schemas import Query
from app.services.hybrid_retriever import hybrid_search
from app.services.prompt_builder import build_prompt
from app.services.groq_client import ask_gork_with_fallback

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/ask")
async def ask_question(query: Query):
    # Retrieve context and build prompt
    results = hybrid_search(query.question)
    prompt = build_prompt(results, query.question, query.mode, query.level)

    # Ask Gork
    answer = ask_gork_with_fallback(prompt)

    # Clean the answer string
    cleaned = answer.strip()

    # Remove triple backticks and optional 'json' label
    if cleaned.startswith("```") and cleaned.endswith("```"):
        cleaned = re.sub(r"^```json\s*|```$", "", cleaned, flags=re.IGNORECASE).strip()

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        # If parsing fails, return as raw_response
        parsed = {"raw_response": cleaned}

    # Return as 'answer' key for frontend consistency
    return {"answer": parsed}
