from youtubesearchpython import VideosSearch
from youtube_transcript_api import YouTubeTranscriptApi
from typing import Optional

class VideoService:
    @staticmethod
    def search_video(query: str, limit: int = 1):
        videos_search = VideosSearch(query, limit=limit)
        results = videos_search.result()
        
        if not results['result']:
            return None
            
        videos = []
        for video in results['result']:
            videos.append({
                "video_id": video['id'],
                "title": video['title'],
                "link": video['link'],
                "thumbnail": video['thumbnails'][0]['url'],
                "channel": video['channel']['name'],
                "duration": video['duration']
            })
        return videos

    @staticmethod
    def get_transcript(video_id: str):
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            # Combine for full text
            full_text = " ".join([entry['text'] for entry in transcript])
            return {"transcript": transcript, "full_text": full_text}
        except Exception as e:
            print(f"Error fetching transcript for {video_id}: {e}")
            return None

video_service = VideoService()
