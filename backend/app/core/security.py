"""
JWT validation logic. Used by app/api/deps.py's get_current_user.

Supabase now issues ES256-signed JWTs by default (asymmetric JWT
Signing Keys), verified against a public key from Supabase's JWKS
endpoint -- not the old shared-secret HS256 approach. This reads the
token's alg header and verifies accordingly, falling back to legacy
HS256 for older projects.
"""

import jwt
from jwt import PyJWKClient
from fastapi import HTTPException, status

from app.core.config import settings

_jwks_client = (
    PyJWKClient(settings.SUPABASE_JWKS_URL, headers={"apikey": settings.SUPABASE_KEY})
    if settings.SUPABASE_URL
    else None
)

def decode_jwt(token: str) -> dict:
    try:
        header = jwt.get_unverified_header(token)
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token.")

    alg = header.get("alg")

    try:
        if alg == "ES256":
            if _jwks_client is None:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="SUPABASE_URL not configured (needed to fetch JWKS).",
                )
            signing_key = _jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256"],
                audience="authenticated",
            )
        else:
            if not settings.SUPABASE_JWT_SECRET:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="SUPABASE_JWT_SECRET not configured.",
                )
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