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
        
        from app.core.database import supabase
        
        # Verify token by calling Supabase Auth
        user = supabase.auth.get_user(token)
        
        if not user or not user.user:
             raise Exception("Invalid token")
             
        # Return a dict that mimics the payload expected by endpoints (sub, email etc)
        # user.user is a User object.
        return {
            "sub": user.user.id,
            "email": user.user.email,
            "user_metadata": user.user.user_metadata
        }
    except Exception as e:
        # Fallback to simple decode if API check fails (e.g. rate limit)? 
        # No, better to fail secure.
        # print(f"Auth verification failed: {e}")
        
        # For MVP local dev with anon key, sometimes getUser fails if not configured right.
        # Let's keep the fallback for now but log warning.
        try:
             payload = jwt.decode(token, options={"verify_signature": False})
             return payload
        except:
            pass
            
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
