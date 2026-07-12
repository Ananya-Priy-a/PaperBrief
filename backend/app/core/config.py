"""
Central configuration loading.

All environment-variable driven settings live here so the rest of the
app never calls os.getenv() directly.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # --- Groq / LLM provider ---
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"

    GORK_MODELS = [
        "openai/gpt-oss-120b",
        "llama-3.3-70b-versatile",
        "openai/gpt-oss-20b",
        "llama-3.1-8b-instant",
    ]
    MAX_RETRIES_PER_MODEL: int = 2
    MODEL_TIMEOUT_SECONDS: int = 20

    # --- Embeddings ---
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"

    # --- Supabase ---
    _supabase_url_raw: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_URL: str = _supabase_url_raw.split("/rest/v1")[0].rstrip("/") if _supabase_url_raw else ""
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    SUPABASE_STORAGE_BUCKET: str = os.getenv("SUPABASE_STORAGE_BUCKET", "pdfs")

    # Public-key endpoint for verifying Supabase's current default ES256
    # (asymmetric) JWTs. Derived automatically from SUPABASE_URL.
    SUPABASE_JWKS_URL: str = os.getenv(
        "SUPABASE_JWKS_URL",
        f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json" if SUPABASE_URL else "",
    )

    # --- Upload validation ---
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "20"))
    ALLOWED_UPLOAD_MIME_TYPES = ["application/pdf"]

    def validate(self):
        if not self.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not set in environment variables.")


settings = Settings()
settings.validate()