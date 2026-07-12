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

    # Fallback chain of models, tried in order until one succeeds.
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

    # --- Supabase (used by app/supabase_client.py and core/security.py) ---
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")

    def validate(self):
        if not self.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not set in environment variables.")


settings = Settings()
settings.validate()
