"""
Holds in-memory index state for ALL currently-indexed documents, keyed
by document_id, so a user can have several uploaded PDFs and ask
questions about a specific one via POST /chat/{document_id}.
"""

from typing import List, Dict
from fastapi import HTTPException
from app.services.chunker import semantic_chunking
from app.services.embeddings import encode
from app.services.faiss_index import build_faiss_index, search_faiss
from app.services.bm25_index import build_bm25_index, search_bm25

_index_store: Dict[str, Dict] = {}


def build_indexes(documents: List[Dict], document_id: str) -> int:
    chunk_store: List[str] = []
    metadata_store: List[Dict] = []

    for doc in documents:
        chunks = semantic_chunking(doc["text"])
        for chunk in chunks:
            chunk_id = f"c_{len(chunk_store):04d}"
            chunk_store.append(chunk)
            metadata_store.append({
                "id": chunk_id,
                "page": doc["page"],
                "section": doc["section"]
            })

    if not chunk_store:
        raise ValueError("No text extracted from PDF.")

    embeddings = encode(chunk_store)
    faiss_index = build_faiss_index(embeddings)
    bm25 = build_bm25_index(chunk_store)

    _index_store[document_id] = {
        "faiss_index": faiss_index,
        "bm25": bm25,
        "chunk_store": chunk_store,
        "metadata_store": metadata_store,
    }

    return len(chunk_store)


def has_index(document_id: str) -> bool:
    return document_id in _index_store


def drop_index(document_id: str) -> None:
    _index_store.pop(document_id, None)


def hybrid_search(document_id: str, query: str, k: int = 10):
    entry = _index_store.get(document_id)
    if entry is None:
        raise HTTPException(
            status_code=404,
            detail="No index found for this document. It may need to be re-uploaded (indexes are in-memory and reset on server restart).",
        )

    query_vec = encode([query])
    semantic_results = list(search_faiss(entry["faiss_index"], query_vec, k))
    keyword_results = list(search_bm25(entry["bm25"], query, k))
    combined = list(set(semantic_results) | set(keyword_results))

    results = []
    for idx in combined:
        results.append({
            "text": entry["chunk_store"][idx],
            "metadata": entry["metadata_store"][idx]
        })
    return results
