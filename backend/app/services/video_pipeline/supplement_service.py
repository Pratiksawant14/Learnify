from .base import LessonPlan
from app.ai.llm_client import llm_client

class SupplementService:
    def create_text_fallback(self, lesson_plan: LessonPlan) -> dict:
        """
        Generates a text-based lesson when no video is found.
        """
        content = llm_client.generate_supplement(lesson_plan.lesson_title, lesson_plan.target_level)
        
        return {
             "title": lesson_plan.lesson_title,
             "description": lesson_plan.description,
             "type": "text",
             "content": content,
             "teacher": "Learnify AI",
             "score": 1.0 # Generated is always 100% relevant technically
        }

supplement_service = SupplementService()
