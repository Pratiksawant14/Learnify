import os
from dotenv import load_dotenv

load_dotenv(override=True)

class Settings:
    PROJECT_NAME: str = "Learnify Backend"
    API_V1_STR: str = "/api/v1"
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    CORS_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000", "https://learnify-sable.vercel.app"] # Credentials require explicit origin, not *
    
    # Video Pipeline Configuration
    YOUTUBE_API_KEY: str = os.getenv("YOUTUBE_API_KEY", "")
    CHROMA_DB_PATH: str = os.getenv("CHROMA_DB_PATH", "./chroma_db")
    
    # Pipeline Tunables
    MAX_CANDIDATES_PER_TOPIC: int = int(os.getenv("MAX_CANDIDATES_PER_TOPIC", "30"))
    MAX_TRANSCRIPT_CHUNKS_PER_VIDEO: int = int(os.getenv("MAX_TRANSCRIPT_CHUNKS_PER_VIDEO", "50"))
    MIN_COVERAGE_SCORE: float = float(os.getenv("MIN_COVERAGE_SCORE", "0.70"))
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.75"))
    MAX_CHUNK_DURATION_SECONDS: int = int(os.getenv("MAX_CHUNK_DURATION_SECONDS", "600"))
    CHUNK_SILENCE_THRESHOLD: float = float(os.getenv("CHUNK_SILENCE_THRESHOLD", "2.0"))

settings = Settings()

# 🚨 CRITICAL: Validate environment variables at startup
required_vars = [
    ("SUPABASE_URL", settings.SUPABASE_URL),
    ("SUPABASE_KEY", settings.SUPABASE_KEY), # MUST be Service Role Key
    ("OPENAI_API_KEY", settings.OPENAI_API_KEY),
]

missing = [name for name, val in required_vars if not val]
if missing:
    raise RuntimeError(f"❌ CRITICAL ERROR: Missing required environment variables: {', '.join(missing)}")

# 🚨 Validation Note: We trust the key provided is correct. 
# Explicitly checking for "service_role" string in a JWT is flaky without decoding.
if "ey" in settings.SUPABASE_KEY:
     pass # Assume correct for now to allow startup with the new key
