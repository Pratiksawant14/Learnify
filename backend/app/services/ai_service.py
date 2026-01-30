import json
import random
from pathlib import Path
from typing import Dict, Any, List, Optional

DATA_DIR = Path(__file__).parent.parent / "data"
SUMMARIES_FILE = DATA_DIR / "ai_summaries.json"

class AIService:
    def __init__(self):
        self._ensure_data_dir()
        self.cache = self._load_cache()

    def _ensure_data_dir(self):
        if not DATA_DIR.exists():
            DATA_DIR.mkdir(parents=True)
        if not SUMMARIES_FILE.exists():
            with open(SUMMARIES_FILE, "w") as f:
                json.dump({}, f)

    def _load_cache(self) -> Dict[str, Any]:
        try:
            with open(SUMMARIES_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}

    def _save_cache(self, video_id: str, data: Dict[str, Any]):
        # Load fresh just in case (simple concurrency handling)
        current = self._load_cache()
        
        # Merge existing video data with new data
        if video_id not in current:
            current[video_id] = {}
            
        current[video_id].update(data)
        
        with open(SUMMARIES_FILE, "w") as f:
            json.dump(current, f, indent=2)
        
        self.cache = current

    def get_summary_and_concepts(self, video_id: str, transcript_text: str, lesson_title: str) -> Dict[str, Any]:
        # Check cache
        cached = self.cache.get(video_id, {})
        if "summary" in cached and "key_concepts" in cached:
            return {
                "summary": cached["summary"],
                "key_concepts": cached["key_concepts"]
            }

        # MOCK AI GENERATION LOGIC
        # In a real app, this would call OpenAI/Gemini
        
        # Creating a plausible summary from the text mock
        words = transcript_text.split()
        summary_bullets = [
            f"This lesson covers the core aspects of {lesson_title}.",
            f"Key focus is placed on {words[10] if len(words) > 10 else 'fundamentals'} and how it relates to the broader system.",
            "You will learn practical applications and best practices.",
            "The instructor emphasizes the importance of understanding the underlying mechanism."
        ]
        
        # Extracting "concepts" (fake extraction)
        concepts = [
            "Fundamentals",
            lesson_title.split()[-1] if lesson_title else "Core Logic",
            "Best Practices",
            "Implementation"
        ]

        result = {
            "summary": summary_bullets,
            "key_concepts": concepts
        }
        
        self._save_cache(video_id, result)
        return result

    def get_explanation(self, video_id: str, transcript_text: str, mode: str) -> str:
        # Check cache
        cached = self.cache.get(video_id, {}).get("explanations", {})
        if mode in cached:
            return cached[mode]

        # MOCK AI EXPLANATION GENERATION
        explanation = ""
        context = transcript_text[:200] + "..." if len(transcript_text) > 200 else transcript_text

        if mode == "simple":
            explanation = (
                "Here's the simple version:\n\n"
                "Think of this concept like a recipe. You have your ingredients (inputs) and your final dish (output). "
                "This lesson basically teaches you how to mix them correctly so you don't end up with a mess. "
                "It's really about following the steps in the right order."
            )
        elif mode == "example":
            explanation = (
                "Let's look at a concrete example:\n\n"
                "Imagine you are building a house. "
                f"The concepts in this lesson are like the blueprint. You wouldn't start laying bricks without a plan, right? "
                "Similarly, in code, you define your structure before executing logic. "
                "For instance, if you were writing a function for this, you'd start by defining your variables (the bricks) "
                "and then write the logic (the layout)."
            )
        elif mode == "deep":
            explanation = (
                "Technically speaking:\n\n"
                "This topic touches on the lower-level abstraction of the system. "
                "When we analyze the performance implications, we see that optimizing this particular flow reduces computational overhead. "
                "The instructor touches on time complexity and memory management, suggesting that a declarative approach "
                "yields better maintainability than an imperative one in this context."
            )
        else:
            explanation = "Mode not supported."

        # Save to cache
        current_data = self.cache.get(video_id, {})
        explanations = current_data.get("explanations", {})
        explanations[mode] = explanation
        
        self._save_cache(video_id, {"explanations": explanations})
        
        return explanation

    def answer_question(self, video_id: str, question: str, lesson_title: str) -> str:
        # Check cache (optional, maybe skip for Q&A uniqueness, but good for presets)
        # For MVP, we'll generate fresh or use simple logic
        
        q_lower = question.lower()
        
        if "simple" in q_lower or "simply" in q_lower:
            return (
                f"Simply put, {lesson_title} is about managing how data flows. "
                "Imagine a traffic system where this concept acts as the traffic light, "
                "ensuring everything moves smoothly without crashing."
            )
        
        if "important" in q_lower or "importance" in q_lower:
            return (
                f"Understanding {lesson_title} is critical because it's a foundational building block. "
                "Without it, scalable applications become impossible to maintain. "
                "It directly impacts performance and code readability."
            )
            
        if "mistakes" in q_lower or "common" in q_lower:
            return (
                "Beginners often overcomplicate this by trying to do too much at once. "
                "Another common mistake is ignoring edge cases. "
                "Focus on the happy path first, then add complexity."
            )
            
        if "use this" in q_lower or "real world" in q_lower:
            return (
                "You'll use this in almost every production-grade application. "
                "For example, when handling user authentication or processing payments, "
                "this pattern ensures data integrity."
            )

        # Fallback 'AI' answer
        return (
            f"That's a great question about {lesson_title}. "
            "Based on the transcript, the instructor emphasizes that practice is key here. "
            "The specific details usually depend on your exact implementation context, "
            "but the general rule is to keep it modular and testable."
        )
