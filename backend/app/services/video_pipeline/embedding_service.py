from typing import List
from .base import TranscriptChunk
from app.ai.embeddings import get_chroma_collection
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def embed_and_store(self, chunks: List[TranscriptChunk]):
        """
        Embeds chunks using Chroma's internal embedding function (configured in app.ai.embeddings)
        and stores them.
        """
        if not chunks:
            return
            
        try:
            collection = get_chroma_collection()
            
            # Prepare batch
            ids = [c.chunk_id for c in chunks]
            documents = [c.text for c in chunks]
            metadatas = [
                {
                    "video_id": c.video_id,
                    "start_time": c.start_time,
                    "end_time": c.end_time
                }
                for c in chunks
            ]
            
            # Upsert
            # Using upsert to handle re-runs
            collection.upsert(
                ids=ids,
                documents=documents,
                metadatas=metadatas
            )
            
            logger.info(f"Upserted {len(chunks)} chunks to Chroma.")
            
        except Exception as e:
            logger.error(f"Error in embed_and_store: {e}")
            raise e

    def query_similar_chunks(self, query_text: str, n_results: int = 5) -> List[dict]:
        """
        Search for similar chunks.
        Returns list of dicts with metadata + score + text.
        """
        try:
            collection = get_chroma_collection()
            results = collection.query(
                query_texts=[query_text],
                n_results=n_results
            )
            
            # Unpack results
            # Chroma returns lists of lists (one per query)
            output = []
            if results['ids']:
                ids = results['ids'][0]
                dists = results['distances'][0] if 'distances' in results else []
                metas = results['metadatas'][0] if 'metadatas' in results else []
                docs = results['documents'][0] if 'documents' in results else []
                
                for i in range(len(ids)):
                    output.append({
                        "id": ids[i],
                        "score": dists[i] if i < len(dists) else 0.0, # distance! smaller is better usually, depending on metric
                        "metadata": metas[i] if i < len(metas) else {},
                        "text": docs[i] if i < len(docs) else ""
                    })
            return output

        except Exception as e:
            logger.error(f"Error querying chunks: {e}")
            return []

embedding_service = EmbeddingService()
