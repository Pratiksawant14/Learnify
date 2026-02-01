# 🎓 Learnify - AI-Powered Learning Roadmap Generator

![Learnify Banner](https://img.shields.io/badge/AI-Powered-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green) ![Next.js](https://img.shields.io/badge/Next.js-16.1-black) ![Supabase](https://img.shields.io/badge/Supabase-Enabled-green)

**Learnify** is an intelligent learning platform that generates personalized, structured learning roadmaps with curated YouTube videos, progress tracking, and AI-driven course recommendations.

---

## ✨ Features

### Core Features
- 🤖 **AI-Powered Course Generation** - Enter a topic and let OpenAI create a structured learning roadmap
- 🎥 **Automated Video Curation** - Intelligent YouTube video search and attachment using `yt-dlp`
- 📊 **Progress Tracking** - Track completion status across modules and lessons
- 🌍 **Multi-Language Support** - Generate courses in any language
- 🔐 **User Authentication** - Secure login via Supabase Auth
- 💾 **LocalStorage Fallback** - Instant course loading even when offline

### Pages
1. **Home** - AI course generation prompt + user's created courses
2. **Explore** - Browse public/premade courses
3. **Profile** - User profile with levels, progress, and course history

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.1 (React, TypeScript)
- **Styling:** Tailwind CSS
- **State Management:** React Hooks + LocalStorage
- **API Client:** Axios + Fetch
- **Authentication:** Supabase Auth

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **AI Model:** OpenAI GPT (via OpenRouter)
- **Video Search:** yt-dlp
- **Database:** Supabase (PostgreSQL)
- **Transcripts:** youtube-transcript-api

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Railway
- **Database:** Supabase Cloud
- **Storage:** Supabase Storage

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Pratiksawant14/Learnify.git
cd Learnify/Learnify.1
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install yt-dlp system-wide (required)
pip install yt-dlp

# Create .env file
cp .env.example .env
```

**Configure `backend/.env`:**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openrouter_api_key
CORS_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
```

**Run Backend:**
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
```

**Configure `frontend/.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=/api/py
```

**Run Frontend:**
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

---

## 🗄️ Database Setup

### Supabase Tables

Create the following tables in your Supabase project:

#### `users` (handled by Supabase Auth)

#### `courses`
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  level TEXT,
  language TEXT,
  roadmap JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `progress`
```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  lesson_id TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)

Enable RLS on all tables and create policies:

```sql
-- Courses: Users can only see their own courses (or public ones)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own courses"
  ON courses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own courses"
  ON courses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Progress: Users can only access their own progress
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own progress"
  ON progress FOR ALL
  USING (auth.uid() = user_id);
```

---

## 🌐 Deployment

### Backend (Railway)

1. **Create a New Project** on [Railway](https://railway.app)
2. **Connect GitHub Repository**
3. **Set Root Directory:** `backend`
4. **Add Environment Variables:**
   ```
   SUPABASE_URL=...
   SUPABASE_KEY=...
   OPENAI_API_KEY=...
   CORS_ORIGINS=https://your-vercel-app.vercel.app
   ```
5. **Railway will auto-detect** `requirements.txt` and deploy

### Frontend (Vercel)

1. **Import Project** on [Vercel](https://vercel.com)
2. **Set Root Directory:** `frontend`
3. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
   ```
4. **Deploy**

---

## 📁 Project Structure

```
Learnify.1/
├── backend/
│   ├── app/
│   │   ├── ai/                 # AI roadmap generator
│   │   ├── core/               # Config, security, database
│   │   ├── routers/            # API endpoints
│   │   ├── schemas/            # Pydantic models
│   │   ├── services/           # Business logic
│   │   │   ├── video_service.py        # yt-dlp video search
│   │   │   ├── roadmap_service.py      # Course generation
│   │   │   └── course_service.py       # Database operations
│   │   └── main.py             # FastAPI app entry
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── api/py/             # Next.js API proxy routes
│   │   ├── course/[id]/        # Course detail page
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── home/               # Home page components
│   │   └── course/             # Course components
│   ├── services/
│   │   ├── api.ts              # API client
│   │   └── courseService.ts    # Course API methods
│   ├── next.config.ts
│   └── .env.local
└── README.md
```

---

## 🔧 Configuration

### Environment Variables

#### Backend (`backend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Supabase service role key | `eyJhbGci...` |
| `OPENAI_API_KEY` | OpenRouter API key | `sk-or-v1-...` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |

#### Frontend (`frontend/.env.local`)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGci...` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `/api/py` (dev) or `https://...railway.app` (prod) |

---

## 🎯 How It Works

### Course Generation Flow

1. **User Input** → User enters topic, level, language, time commitment
2. **AI Generation** → OpenAI generates structured JSON roadmap
3. **Video Enrichment** → `yt-dlp` searches for best educational videos per lesson
4. **Attachment** → Video metadata (ID, title, thumbnail, channel) attached to lessons
5. **Storage** → Course saved to LocalStorage + Supabase (if authenticated)
6. **Display** → Roadmap rendered with embedded YouTube player

### Video Search Strategy

```python
yt-dlp "ytsearch1:Introduction to Python programming English educational"
```

- 10-second timeout per video
- Graceful failure (continues even if some videos fail)
- Caches video metadata in course JSON

---

## 📝 API Endpoints

### Roadmap Generation
```http
POST /roadmap/generate
Content-Type: application/json

{
  "topic": "Machine Learning",
  "level": "Beginner",
  "language": "English",
  "time_commitment": "2 weeks"
}
```

### Get Courses
```http
GET /courses/
Authorization: Bearer <supabase_jwt>
```

### Get Course by ID
```http
GET /courses/{course_id}
```

### Save Course
```http
POST /courses/
Authorization: Bearer <supabase_jwt>
Content-Type: application/json

{
  "title": "...",
  "roadmap": {...}
}
```

---

## 🐛 Known Issues & Limitations

### Production Issues
- **Video playback in deployed app:** If videos don't play, ensure:
  1. Railway backend has `youtube-transcript-api` installed
  2. `yt-dlp` is accessible in Railway environment
  3. CORS is configured correctly
  
### Performance
- Course generation takes 30-120 seconds (depends on number of lessons)
- Each video search has a 10-second timeout
- Next.js API routes have 5-minute timeout for `/roadmap/generate`

### YouTube Dependencies
- **yt-dlp required** - Ensure it's installed system-wide
- Video availability depends on YouTube's search results
- Some videos may have embedding restrictions

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code structure
- Add comments for complex logic
- Test locally before pushing
- Update README if adding new features

---

## 🔐 Security

- ✅ User authentication via Supabase
- ✅ Row-Level Security (RLS) enabled
- ✅ CORS protection
- ✅ JWT token validation
- ⚠️ **Never commit `.env` files**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Pratik Sawant** - [@Pratiksawant14](https://github.com/Pratiksawant14)

---

## 🙏 Acknowledgments

- OpenAI for GPT models
- Supabase for database and auth
- yt-dlp for reliable YouTube video search
- FastAPI and Next.js communities

---

## 📧 Support

For issues, questions, or suggestions:
- **GitHub Issues:** [Create an issue](https://github.com/Pratiksawant14/Learnify/issues)
- **Email:** your-email@example.com

---

## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐!

---

**Built with ❤️ for learners worldwide**
