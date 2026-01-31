from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class YouTubeAPI:
    def __init__(self):
        self.api_key = settings.YOUTUBE_API_KEY
        if not self.api_key:
            logger.warning("YOUTUBE_API_KEY is not set. YouTube operations will fail.")
        self.youtube = None

    def get_client(self):
        if not self.youtube:
            if not self.api_key:
                raise ValueError("YOUTUBE_API_KEY is missing")
            self.youtube = build('youtube', 'v3', developerKey=self.api_key)
        return self.youtube

    def search_videos(self, query: str, max_results: int = 10, relevance_language: str = "en"):
        """
        Search for videos matching the query.
        Returns a list of video objects (snippet + id).
        """
        try:
            client = self.get_client()
            search_response = client.search().list(
                q=query,
                part='id,snippet',
                maxResults=max_results,
                type='video',
                relevanceLanguage=relevance_language,
                videoEmbeddable='true' # Ensure we can embed it
            ).execute()

            items = search_response.get('items', [])
            return items

        except HttpError as e:
            logger.error(f"YouTube Search API Error: {e}")
            raise e

    def get_video_details(self, video_ids: list[str]):
        """
        Get detailed stats (duration, views, likes, captions) for a list of video IDs.
        """
        try:
            client = self.get_client()
            # API allows max 50 ids per call
            chunks = [video_ids[i:i + 50] for i in range(0, len(video_ids), 50)]
            all_items = []

            for chunk in chunks:
                ids_str = ",".join(chunk)
                response = client.videos().list(
                    part='snippet,contentDetails,statistics',
                    id=ids_str
                ).execute()
                all_items.extend(response.get('items', []))
            
            return all_items

        except HttpError as e:
            logger.error(f"YouTube Video Details API Error: {e}")
            raise e
            
youtube_client = YouTubeAPI()
