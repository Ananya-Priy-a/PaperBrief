"""
Shared FastAPI dependencies.

`get_current_user` is available for routes that want to require auth,
but — matching the original app's behavior, which had no auth at all —
it is not currently applied to any route. Add
`user = Depends(get_current_user)` to a route's signature to enable it.
"""

from fastapi import Header, HTTPException, status
from typing import Optional

from app.core.security import decode_jwt


async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header.",
        )
    token = authorization.split(" ", 1)[1]
    return decode_jwt(token)
