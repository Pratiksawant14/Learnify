from app.core.database import supabase
from typing import Optional

class ProgressService:
    @staticmethod
    def mark_lesson_complete(user_id: str, lesson_id: str):
        # 1. Update progress table
        data = {
            "user_id": user_id,
            "lesson_id": lesson_id,
            "completed": True,
            "xp_awarded": 100 # Base XP
        }
        # Upsert
        response = supabase.table("progress").upsert(data).execute()
        
        # 2. Update user XP/Skills (Simplification: just add to 'General' skill for now)
        # Fetch current skill
        skill_res = supabase.table("skills").select("*").eq("user_id", user_id).eq("skill_name", "General").execute()
        
        current_xp = 0
        if skill_res.data:
            current_xp = skill_res.data[0]["xp"]
            
        new_xp = current_xp + 100
        new_level = int(new_xp / 1000) + 1
        
        skill_data = {
            "user_id": user_id,
            "skill_name": "General",
            "xp": new_xp,
            "level": new_level
        }
        supabase.table("skills").upsert(skill_data).execute()
        
        return response.data

    @staticmethod
    def get_user_progress(user_id: str):
        response = supabase.table("progress").select("*").eq("user_id", user_id).execute()
        return response.data

    @staticmethod
    def get_user_skills(user_id: str):
        response = supabase.table("skills").select("*").eq("user_id", user_id).execute()
        return response.data

progress_service = ProgressService()
