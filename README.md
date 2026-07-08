# AI Interview IQ

AI Interview IQ is a full-stack web application that helps job seekers prepare for interviews by analyzing their resume against a specific job description. It generates a match score, highlights skill gaps, and builds a personalized interview preparation plan using AI.

## Live Demo

https://ai-interview-iq.vercel.app

## What it does

You paste in a job description, then either upload your resume or write a short description of your background. The app sends this to an AI model (via the Groq API), which analyzes how well your profile matches the role and returns:

- A match score out of 100
- A list of skill gaps between your profile and the job
- Personalized technical and behavioral interview questions
- A 7-day preparation roadmap
- Suggestions to improve your resume

You can also download the full result as a PDF report.

## Features

- Secure user authentication (register/login) with JWT and hashed passwords
- Resume upload with text extraction from PDF and DOCX files
- AI-powered analysis using the Groq API, with a strict prompt and a retry mechanism so the AI reliably returns structured, usable data instead of free-form text
- A results dashboard showing match score, skill gaps, questions, and roadmap
- PDF report generation and download
- Logout functionality that properly clears the session, so returning to the login page always requires fresh credentials
- Responsive design for desktop and mobile

## Tech stack

**Frontend:** React, Vite, SCSS — deployed on Vercel

**Backend:** Node.js, Express, MongoDB — deployed on Render

**Database:** MongoDB Atlas

**AI:** Groq API (Llama 3.3 70B) for resume/job-description analysis

## The hardest part to get right

Getting the AI to reliably return valid, structured JSON instead of conversational text was the biggest challenge. This is handled through a strict system prompt describing the exact JSON shape expected, plus a validation step: if the first response isn't valid JSON, the app automatically retries once with a stricter instruction before giving up.

## Running it locally

### Backend
cd backend
npm install

Create a `.env` file in the `backend` folder:
MONGO_URI=your MongoDB connection string
JWT_SECRET=any long random string
GROQ_API_KEY=your Groq API key
PORT=5000
CLIENT_URL=http://localhost:5173

Start it:
npm run dev

### Frontend
cd frontend
npm install

Create a `.env` file in the `frontend` folder:
VITE_API_URL=http://localhost:5000/api

Start it:
npm run dev

The app will be running at http://localhost:5173

## Deployment

Backend is deployed on Render as a Web Service (root directory: backend, build command: npm install, start command: npm start), with environment variables set directly in Render's dashboard. Frontend is deployed on Vercel (root directory: frontend), with VITE_API_URL pointed at the live Render backend URL. Both are connected directly to this GitHub repository, so pushing to main automatically triggers a new deployment on both platforms.

## Author
Built by Komal Singh.


## 6. Screenshots

**Login page**

<img width="1485" height="888" alt="Login page" src="https://github.com/user-attachments/assets/25269228-01d9-43f8-9a80-056871dfc3b0" />

**Registration page**

<img width="1489" height="879" alt="Registration page" src="https://github.com/user-attachments/assets/f65c2637-4112-4541-8372-ec0369a1fd7e" />

**Interview plan creation form**

<img width="1524" height="887" alt="Interview plan form" src="https://github.com/user-attachments/assets/894a02f1-374d-4428-a844-7d50049314f1" />
