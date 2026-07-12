# PaperMind Backend

Refactored from a single `main.py` into a layered structure. Functionality
and API surface are unchanged: `POST /upload`, `POST /ask`, `GET /`,
static files under `/static`.

## Run

```bash
pip install -r requirements.txt
cp .env.example .env   # fill in GROQ_API_KEY
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Drop your existing frontend into `templates/index.html` and any static
assets into `static/`.

## What moved where

| Original piece | New location |
|---|---|
| `extract_pdf_with_metadata`, `detect_sections` | `app/services/pdf_parser.py` |
| `semantic_chunking` | `app/services/chunker.py` |
| `embedding_model` | `app/services/embeddings.py` |
| FAISS build/search | `app/services/faiss_index.py` |
| BM25 build/search | `app/services/bm25_index.py` |
| Global stores + `build_indexes`, `hybrid_search` | `app/services/hybrid_retriever.py` |
| `build_prompt` | `app/services/prompt_builder.py` |
| Groq client + `ask_gork_with_fallback` | `app/services/groq_client.py` |
| `Query` model | `app/models/schemas.py` |
| `/upload` route | `app/api/documents.py` |
| `/ask` route | `app/api/chat.py` |
| Env/config constants | `app/core/config.py` |
| App creation, CORS, static mount, `/` route | `app/main.py` |

## Notes on scaffolding not in the original app

The target structure includes `core/security.py`, `api/deps.py`, and
`supabase_client.py`. The original monolith had **no authentication and
no Supabase usage**, so to keep behavior identical:

- `core/security.py` and `api/deps.py` provide JWT-verification
  utilities, but nothing currently depends on them — no route requires
  auth, exactly like before.
- `supabase_client.py` builds a client only if `SUPABASE_URL`/`SUPABASE_KEY`
  are set; nothing calls it yet.

When you're ready to add auth, add `user = Depends(get_current_user)` to
the routes in `app/api/documents.py` / `app/api/chat.py`.

## Known pre-existing behavior kept as-is

- In-memory index state (`chunk_store`, `metadata_store`, `faiss_index`,
  `bm25`) is global and single-tenant, same as the original — the
  `indexes/` folder in this structure is provided for future on-disk
  persistence but isn't used yet.
- Uploaded PDFs are still written to `temp_<uuid>.pdf` in the working
  directory and never cleaned up, matching original behavior.
