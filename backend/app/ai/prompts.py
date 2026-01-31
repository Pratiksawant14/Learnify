
# 2) Roadmap Lesson → Compact Lesson Spec
# Given lesson title and learning objective, create a single short description
LESSON_SPEC_PROMPT = """
Given these lesson details:
Title: {title}
Description: {description}

Create a single short description (1-2 sentences) that captures the exact concepts to teach, ideal depth, and example requirement.
Format: "Teach: X, Y; Level: beginner; Example: show code snippet for Z"
Output ONLY the sentence.
"""

# 3) Coverage Justification/Analysis
# We use this to actually score or verify coverage if simple similarity isn't enough
COVERAGE_ANALYSIS_PROMPT = """
You are a teacher evaluating if a video transcript segment covers the required lesson plan.

Lesson Requirement: "{lesson_spec}"

Transcript Segment:
"{transcript_text}"

Does this segment cover the lesson core concepts?
Return JSON:
{{ 
    "score": <float 0.0 to 1.0>, 
    "reason": "<short justification>",
    "covered_concepts": ["<concept1>", "<concept2>"],
    "missing_concepts": ["<missing1>"]
}}
"""

# 4) Supplement Text Generator
SUPPLEMENT_GENERATION_PROMPT = """
Write a concise 400-700 word lesson text that explains "{topic}" for "{level}" learners.
Include 2 short examples and 1 quick quiz question.
The content should be accurate, engaging, and suitable for a self-paced learner.
Return only the text content (Markdown supported).
"""

# 5) Video Player Features
PROMPT_LESSON_SUMMARY = """
Summarize the key concepts for a coding lesson titled '{title}'. 
Return a JSON with 'summary' (list of 3 bullet points, concise) and 'key_concepts' (list of 5 tags/keywords).
"""

PROMPT_EXPLAIN_CONCEPT = """
Explain the concept of '{topic}' (Lesson: {lesson_title}) in '{mode}' mode.
Modes:
- simple: Explain like I'm 10 years old. Use analogies.
- example: Provide a clear code example or real-world scenario.
- deep: deep dive into technical details, memory, performance, or history.
"""

PROMPT_ANSWER_QUESTION = """
You are an expert coding tutor.
Context: Lesson '{lesson_title}'.
Question: {question}
Answer clearly and concisely (max 3 sentences).
"""
