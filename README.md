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

## 6. Screenshots

**Login page**

<img width="1485" height="888" alt="Login page" src="https://github.com/user-attachments/assets/25269228-01d9-43f8-9a80-056871dfc3b0" />

**Registration page**

<img width="1489" height="879" alt="Registration page" src="https://github.com/user-attachments/assets/f65c2637-4112-4541-8372-ec0369a1fd7e" />

**Interview plan creation form**

<img width="1524" height="887" alt="Interview plan form" src="https://github.com/user-attachments/assets/894a02f1-374d-4428-a844-7d50049314f1" />
