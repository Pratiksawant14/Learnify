from app.core.database import supabase
from app.schemas.course import CourseCreate
from app.core.config import settings
from supabase import create_client, Client
import json

class CourseService:
    @staticmethod
    def create_course(course_data: dict, user_id: str, token: str = None):
        # Insert into courses table
        data = {
            "title": course_data["title"],
            "description": course_data.get("description"),
            "roadmap_json": course_data, # Store the full roadmap
            "owner_id": user_id
        }
        
        # Use a scoped client with the user's token for RLS
        client = supabase
        if token:
            try:
                # Re-instantiate a fresh client to be safe
                client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                # Force headers directly to be sure
                client.postgrest.headers.update({"Authorization": f"Bearer {token}"})
            except Exception as e:
                print(f"Error creating scoped client: {e}")
                # Fallback to global client (will likely fail RLS but worth a try or just crash later)
                client = supabase

        try:
            response = client.table("courses").insert(data).execute()
        except Exception as e:
            print(f"Error creating course in DB: {e}")
            raise e
            
        course_id = response.data[0]["id"] if response.data else None
        
        if course_id:
            # Iterate modules and lessons to populate 'lessons' table
            lessons_payload = []
            global_index = 0
            
            for module in course_data.get("modules", []):
                for lesson in module.get("lessons", []):
                    # Extract video ID if available
                    video_id = None
                    if lesson.get("video") and isinstance(lesson["video"], dict):
                        video_id = lesson["video"].get("id")
                    
                    lessons_payload.append({
                        "course_id": course_id,
                        "title": lesson.get("title", "Untitled Lesson"),
                        "video_id": video_id,
                        "order_index": global_index,
                        "start_time": 0, # Default for now
                        "end_time": 0
                    })
                    global_index += 1
            
            if lessons_payload:
                try:
                    client.table("lessons").insert(lessons_payload).execute()
                except Exception as e:
                    print(f"Error inserting lessons: {e}")
                    # Don't fail the whole course creation if lessons fail? 
                    # Or maybe we should. But for now, let's log and continue so the course at least exists.
                    pass
                
        return response.data[0] if response.data else None

    @staticmethod
    def get_courses_by_user(user_id: str):
        response = supabase.table("courses").select("*").eq("owner_id", user_id).execute()
        return response.data

    @staticmethod
    def get_course_by_id(course_id: str):
        try:
            response = supabase.table("courses").select("*").eq("id", course_id).single().execute()
            return response.data
        except Exception as e:
            # .single() raises if no rows found. Return None to handle as 404.
            print(f"Course not found for ID {course_id}: {e}")
            return None

    @staticmethod
    def get_public_courses(limit: int = 20):
        # Fetch recent courses for Explore/Public view
        try:
            response = supabase.table("courses").select("*").order("created_at", desc=True).limit(limit).execute()
            return response.data
        except Exception as e:
            print(f"Error fetching public courses: {e}")
            return []

    @staticmethod
    async def process_course_content(course_id: str):
        """
        Background task to fetch transcripts and generate embeddings for a new course.
        """
        print(f"DEBUG: Starting background content processing for course {course_id}")
        # Fetch lessons
        response = supabase.table("lessons").select("*").eq("course_id", course_id).execute()
        lessons = response.data
        
        if not lessons:
            print(f"DEBUG: No lessons found for course {course_id}")
            return
            
        from app.services.transcript_service import transcript_service
        from app.ai.embeddings import embedding_service
        
        for lesson in lessons:
            video_id = lesson.get("video_id")
            if video_id:
                # 1. Fetch Transcript
                print(f"DEBUG: Fetching transcript for video {video_id} (Lesson {lesson['id']})")
                transcript_list = transcript_service.fetch_transcript(video_id)
                
                if transcript_list:
                    full_text = transcript_service.get_full_text(transcript_list)
                    
                    # 2. Save Transcript to DB
                    supabase.table("lessons").update({"transcript_text": full_text}).eq("id", lesson["id"]).execute()
                    
                    # 3. Generate Embeddings (Chroma)
                    print(f"DEBUG: generating embeddings for lesson {lesson['id']}")
                    embedding_service.add_transcript_chunks(lesson["id"], full_text)
                else:
                    print(f"DEBUG: No transcript available for video {video_id}")

course_service = CourseService()
