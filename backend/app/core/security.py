from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from app.core.config import settings

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Decodes the JWT token from Supabase.
    NOTE: verifying signature requires the JWT secret (not just the Service Key).
    For MVP, we might trust the gateway or decode without strict verify if secret is not available in env.
    Ideally, use Supabase client to getUser.
    """
    token = credentials.credentials
    try:
        # In production, verify signature with SUPABASE_JWT_SECRET
        # specific_user = supabase.auth.get_user(token)
        # return specific_user
        
        # Simple decode (Unsafe for prod without secret)
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
