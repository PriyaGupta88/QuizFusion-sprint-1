# TestForge AI — AI Test Generator Platform (Groq + React + Node + MongoDB)

An AI-powered test generator: pick a subject/topic/difficulty/question type, Groq AI writes the
questions, you take the test in a timed exam UI, Groq AI grades descriptive/coding answers,
and a floating AI chat assistant helps you study.

## What's included (working MVP)
- **Auth**: register/login with JWT, bcrypt password hashing
- **AI Test Generation**: Groq generates MCQ / coding / short / long / fill-in-blank / true-false / mixed questions as structured JSON
- **Exam UI**: timer, progress bar, next/previous, flag question, MCQ/text/code inputs
- **AI Evaluation**: objective questions auto-graded; descriptive/coding graded by Groq with feedback
- **Results**: score, percentage, pie chart, per-question review, AI summary + recommendations
- **Dashboard**: total tests, avg/best score, streak, weak/strong topics, performance line chart
- **AI Learning Assistant**: floating chatbot (Groq), markdown + code highlighting, copy/regenerate, remembers test context
- **Landing page**: animated hero with a lightweight 3D distorted-sphere "AI brain" (React Three Fiber), feature cards, glassmorphism design
- **Security basics**: helmet, rate limiting, mongo-sanitize, xss-clean, CORS

## What's NOT included yet (out of scope for this pass)
To keep this a working, honest MVP rather than a pile of stubs, I left out: admin panel, leaderboard,
achievements/badges, notifications, email verification, forgot-password flow, PDF/CSV export,
PWA/offline support, and full 3D scenes beyond the hero. The code is structured (models, routes,
services) so any of these can be added incrementally — happy to build out whichever you need next.

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# then edit .env and fill in:
#   GROQ_API_KEY=...   (from https://console.groq.com)
#   MONGODB_URI=...    (local mongodb://localhost:27017/ai-test-platform or Atlas URI)
#   JWT_SECRET=...     (any long random string)
npm run dev
```
Backend runs on `http://localhost:5000`. Health check: `GET /api/health`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` and proxies `/api` to the backend (see `vite.config.js`).

### 3. Try it
1. Register an account
2. Go to **Generate Test**, pick a subject/topic/difficulty/type, click Generate
3. Take the test, submit
4. View your AI-graded result, then check the **Dashboard**
5. Click the floating chat bubble any time to ask the AI assistant a question

## Notes on the Groq model
`services/groqService.js` uses `llama-3.3-70b-versatile`. Groq periodically rotates/deprecates model
names — if you get a model error, check https://console.groq.com/docs/models and swap the `MODEL`
constant.

## Project structure
```
AI-Test-Platform/
├── backend/   (Express + Mongoose + Groq SDK)
│   ├── config/db.js
│   ├── models/ (User, Test, Result, Chat)
│   ├── services/groqService.js   ← all Groq prompts live here
│   ├── controllers/, routes/, middleware/
│   └── server.js
└── frontend/  (React + Vite + Tailwind)
    └── src/
        ├── pages/ (Landing, Login, Register, Dashboard, GenerateTest, TakeTest, Result)
        ├── components/ (Navbar, AIChatWidget, HeroBrain, ProtectedRoute)
        └── context/AuthContext.jsx
```
