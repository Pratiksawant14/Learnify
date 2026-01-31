import chromadb
from chromadb.utils import embedding_functions
from app.core.config import settings

# Initialize Chroma (Persistent or volatile for MVP)
# For MVP, locally persistent
chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Use OpenAI embedding function
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key=settings.OPENAI_API_KEY,
    model_name="text-embedding-3-small",
    api_base=settings.OPENAI_BASE_URL
)

# Get or create collection
collection = chroma_client.get_or_create_collection(
    name="lesson_transcripts",
    embedding_function=openai_ef
)

class EmbeddingService:
    @staticmethod
    def add_transcript_chunks(lesson_id: str, text: str):
        # Simple chunking
        chunk_size = 1000
        chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        
        ids = [f"{lesson_id}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"lesson_id": lesson_id, "chunk_index": i} for i in range(len(chunks))]
        
        collection.add(
            documents=chunks,
            ids=ids,
            metadatas=metadatas
        )

    @staticmethod
    def query_similar(query_text: str, n_results: int = 3):
        results = collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        return results

embedding_service = EmbeddingService()
