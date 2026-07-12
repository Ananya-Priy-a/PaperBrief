"""
JWT validation logic.

NOTE: The original monolithic app had no authentication at all — every
route was open. To keep behavior identical during this refactor, these
helpers are provided as ready-to-use utilities but are NOT wired into
any route by default (see app/api/deps.py). Flip them on later by
adding `Depends(get_current_user)` to a route once you're ready to
require auth.
"""

import jwt
from fastapi import HTTPException, status

from app.core.config import settings


def decode_jwt(token: str) -> dict:
    """Decode and validate a Supabase-issued JWT. Raises HTTPException on failure."""
    if not settings.SUPABASE_JWT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_JWT_SECRET not configured.",
        )

    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token.")
