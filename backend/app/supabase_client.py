"""
Supabase server-side client.

Not used by the current routes (the original app has no persistence
layer beyond in-memory index state), but provided here per the target
project structure so services can opt into Supabase storage later.
"""

from supabase import create_client, Client

from app.core.config import settings

supabase_client: Client | None = None

if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


def get_supabase() -> Client:
    if supabase_client is None:
        raise RuntimeError(
            "Supabase client not configured. Set SUPABASE_URL and SUPABASE_KEY."
        )
    return supabase_client
