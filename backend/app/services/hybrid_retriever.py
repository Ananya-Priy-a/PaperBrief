"""
Holds the in-memory index state (chunks, metadata, FAISS index, BM25
index) and exposes build_indexes() / hybrid_search(), exactly matching
the original monolith's global-store behavior.
"""

from typing import List, Dict

import numpy as np
from fastapi import HTTPException

from app.services.chunker import semantic_chunking
from app.services.embeddings import encode
from app.services.faiss_index import build_faiss_index, search_faiss
from app.services.bm25_index import build_bm25_index, search_bm25

# ==============================
# GLOBAL STORES
# ==============================

faiss_index = None
bm25 = None
chunk_store: List[str] = []
metadata_store: List[Dict] = []


def build_indexes(documents: List[Dict]):
    global faiss_index, bm25, chunk_store, metadata_store

    chunk_store = []
    metadata_store = []

    for doc in documents:
        chunks = semantic_chunking(doc["text"])
        for chunk in chunks:
            chunk_store.append(chunk)
            metadata_store.append({
                "page": doc["page"],
                "section": doc["section"]
            })

    if not chunk_store:
        raise ValueError("No text extracted from PDF.")

    embeddings = encode(chunk_store)
    faiss_index = build_faiss_index(embeddings)
    bm25 = build_bm25_index(chunk_store)


def hybrid_search(query: str, k: int = 5):
    if faiss_index is None or bm25 is None:
        raise HTTPException(status_code=400, detail="No document uploaded yet.")

    query_vec = encode([query])
    semantic_results = list(search_faiss(faiss_index, query_vec, k))
    keyword_results = list(search_bm25(bm25, query, k))

    combined = list(set(semantic_results) | set(keyword_results))

    results = []
    for idx in combined:
        results.append({
            "text": chunk_store[idx],
            "metadata": metadata_store[idx]
        })

    return results
