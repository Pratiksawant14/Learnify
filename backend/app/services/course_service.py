from app.core.database import supabase
from app.schemas.course import CourseCreate
import json

class CourseService:
    @staticmethod
    def create_course(course_data: dict, user_id: str):
        # Insert into courses table
        data = {
            "title": course_data["title"],
            "description": course_data.get("description"),
            "roadmap_json": course_data, # Store the full roadmap
            "owner_id": user_id
        }
        
        response = supabase.table("courses").insert(data).execute()
        return response.data[0] if response.data else None

    @staticmethod
    def get_courses_by_user(user_id: str):
        response = supabase.table("courses").select("*").eq("owner_id", user_id).execute()
        return response.data

    @staticmethod
    def get_course_by_id(course_id: str):
        response = supabase.table("courses").select("*").eq("id", course_id).single().execute()
        return response.data

course_service = CourseService()
