from youtube_transcript_api import YouTubeTranscriptApi

class TranscriptService:
    @staticmethod
    def fetch_transcript(video_id: str):
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            # Return raw list of dicts: [{text, start, duration}]
            return transcript 
        except Exception as e:
            print(f"Error fetching transcript: {e}")
            return None

    @staticmethod
    def get_full_text(transcript: list):
        if not transcript:
            return ""
        return " ".join([t['text'] for t in transcript])

transcript_service = TranscriptService()
