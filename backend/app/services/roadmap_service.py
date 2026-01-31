from app.ai.roadmap_generator import generate_roadmap
from app.services.video_service import video_service

class RoadmapService:
    @staticmethod
    def create_structured_roadmap(topic: str, level: str, language: str):
        print(f"DEBUG: Starting roadmap generation for {topic}")
        # 1. Generate core structure via AI
        try:
            roadmap_json = generate_roadmap(topic, level, language)
            print("DEBUG: Roadmap JSON generated successfully")
        except Exception as e:
            print(f"DEBUG: OpenAI Generation Failed: {e}")
            raise e
        
        # 2. Enrich with YouTube videos
        print(f"Enriching roadmap for {topic}...")
        for module in roadmap_json.get("modules", []):
            for lesson in module.get("lessons", []):
                query = lesson.get("video_query")
                if query:
                    # Search logic
                    search_q = f"{query} {language} educational"
                    print(f"DEBUG: Searching video for: {search_q}")
                    try:
                        videos = video_service.search_video(search_q, limit=1)
                        if videos:
                            lesson["video"] = videos[0]
                    except Exception as e:
                        print(f"DEBUG: Video Search Failed for '{search_q}': {e}")
                        # Continue without video instead of failing whole request
                        continue
        
        return roadmap_json

roadmap_service = RoadmapService()
