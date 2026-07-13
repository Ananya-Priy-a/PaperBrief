from sentence_transformers import SentenceTransformer

from app.core.config import settings

# Loaded once at import time, exactly like the original monolith.
embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)


def encode(texts):
    """Thin wrapper kept so callers don't import SentenceTransformer directly."""
    return embedding_model.encode(texts)
