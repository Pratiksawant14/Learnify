from supabase import create_client, Client
from app.core.config import settings

class SupabaseClient:
    """Lazy-loaded Supabase client singleton"""
    _instance: Client = None
    
    @classmethod
    def get_client(cls) -> Client:
        if cls._instance is None:
            if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
                raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
            cls._instance = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        return cls._instance

# Create a property-like object for backward compatibility
class _SupabaseProxy:
    def __getattr__(self, name):
        return getattr(SupabaseClient.get_client(), name)

supabase = _SupabaseProxy()
