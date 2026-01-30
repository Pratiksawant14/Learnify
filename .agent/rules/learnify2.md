---
trigger: always_on
---


# ✅ AntiGravity Rules for Learnify (MVP)

## 1) Product Scope (Strict MVP)

* Build only these 3 pages for MVP:

  1. **Home** (course prompt + user’s created courses list)
  2. **Explore** (public/premade courses catalogue)
  3. **Profile** (user profile + levels + course-wise progress)
* Do **not** build or include these features in MVP:

  * Compilation / course compilation engine
  * “AI Tutor / Professor” personality features
  * AI “watching full videos” feature
  * Real-time streaming transcription
  * Community chat or messaging (future)
* Keep MVP focused on: **goal → structured course → progress tracking**

---

## 2) Core User Flow (Must Work)

* The app must support this flow end-to-end:
  **User enters “What do you want to learn?” → system generates a structured course → user can open and follow it → progress is saved**
* The user should **never paste a playlist link** in MVP.
* The prompt input must accept:

  * topic/goal
  * level (beginner/intermediate/advanced)
  * time commitment (optional)
  * language (optional)

---

## 3) Course Output Requirements

Every generated course must include:

* Course title
* Modules (3–8)
* Lessons inside each module
* At least **1 YouTube video per lesson**
* Short lesson summary/notes
* At least **1 quiz per module**
* Progress tracking (completion %)

---

## 4) Explore Page Rules

* Explore should show:

  * premade courses (cached/generated)
  * searchable list
  * tags: topic, level, duration
* If a user selects an Explore course:

  * it gets added to **My Courses**
  * progress tracking starts for that user

---

## 5) Profile Page Rules

Profile must include:

* profile photo + name
* fields / interests the user pursued
* communities joined (static placeholder allowed in MVP)
* overall user level (computed)
* per-course levels (progress-based)

Levels are based on:

* course completion %
* quizzes attempted
* quizzes accuracy
* streak/consistency (basic)

---

## 6) Tech Stack Rules (Must Follow)

* Frontend: **React.js (prefer Next.js)** + TailwindCSS
* Backend: **FastAPI**
* Database/Auth/Storage: **Supabase**
* Video source: **YouTube embedded videos only**
* Transcripts priority order:

  1. YouTube captions
  2. `yt-dlp` transcript/audio extraction
  3. Whisper transcription fallback

---

## 7) API + Backend Architecture Rules

* Use clean API structure:

  * `POST /generate-course`
  * `GET /courses`
  * `GET /courses/{id}`
  * `POST /courses/{id}/save`
  * `POST /progress/update`
* Long-running processing must be asynchronous:

  * return `job_id`
  * frontend polls job status or uses realtime updates
* Must store job state:

  * `PENDING`, `RUNNING`, `FAILED`, `DONE`

---

## 8) Performance & Cost Control Rules

* Always cache transcripts per `video_id`
* Never re-process the same video transcript twice
* Process only top 1–3 best videos per lesson for MVP
* Limit generated note sizes (short + useful)
* Keep the system fast and stable for MVP testing

---

## 9) Trust & Safety Rules

* Always show YouTube video source attribution:

  * video title + channel name
* Never host video files on our servers
* Always keep course content tied to original sources
* Avoid hallucinated quizzes:

  * quiz answers must be supported by transcript text

---

## 10) UI/UX Rules

* UI must be clean, fast, minimal
* Home must load instantly
* Show loading skeleton during generation
* Show meaningful empty states
* User should be able to generate a course in **under 60 seconds** (MVP target)

---

## 11) Data Model Rules (Consistent Naming)

Use clear entities:

* `users`
* `courses`
* `modules`
* `lessons`
* `videos`
* `transcripts`
* `quizzes`
* `progress`

Do not create unnecessary tables early.

---

## 12) MVP Quality Rule

* The product must be **Minimum Usable**, not Minimum Possible.
* Each generated course should feel like a real learning path:
  structured → trackable → finishable.

---

