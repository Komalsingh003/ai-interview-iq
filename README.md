# AI Interview IQ - Setup Guide

## 1. Backend setup
cd backend
npm install
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, GROQ_API_KEY in .env
npm run dev

## 2. Frontend setup
cd frontend
npm install
cp .env.example .env
npm run dev

## 3. MongoDB Atlas (free)
- Go to mongodb.com/cloud/atlas -> create free cluster
- Database Access -> add a user + password
- Network Access -> allow 0.0.0.0/0 (for dev)
- Get connection string, put in backend/.env as MONGO_URI

## 4. Groq API key
- console.groq.com -> API Keys -> Create -> paste into backend/.env

## 5. Deploy
- Backend -> Render.com (Web Service, root: backend, build: npm install, start: npm start, add env vars)
- Frontend -> Vercel (root: frontend, add VITE_API_URL = your Render backend URL + /api)
