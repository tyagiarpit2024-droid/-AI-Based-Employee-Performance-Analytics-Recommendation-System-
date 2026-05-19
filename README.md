# AI-Based Smart Complaint Management System

A full-stack MERN application that allows users to register complaints, track them, and utilize Artificial Intelligence (OpenRouter API) to automatically detect urgency, suggest departments, and generate complaint summaries.

## Tech Stack
- **Frontend**: React.js (Vite), Vanilla CSS (Glassmorphism), Axios, React Router, Recharts.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas.
- **Authentication**: JWT & bcrypt.
- **AI Engine**: OpenRouter API.

## Features
1. **Authentication**: Secure JWT-based login/signup system.
2. **Dashboard**: Visual analytics of complaints (total, pending, resolved, categories).
3. **Complaint Registry**: Add, Update, Delete, and track complaints.
4. **Search/Filter**: Search complaints by location (`/api/complaints/search?location=Ghaziabad`).
5. **AI Triage Integration**: Click the AI button on any complaint to get an auto-generated JSON response containing:
   - Priority Detection (High, Medium, Low)
   - Department Routing (e.g. Water Department)
   - Executive Summary
   - Auto-generated response for the citizen

## API Documentation

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user & get JWT |
| POST | `/api/complaints` | Add a new complaint |
| GET | `/api/complaints` | Get all complaints |
| GET | `/api/complaints/search` | Search by location |
| PUT | `/api/complaints/:id` | Update complaint status |
| DELETE | `/api/complaints/:id` | Delete a complaint |
| POST | `/api/ai/recommend` | Generate AI Analysis for a complaint |

*Note: All `/complaints` and `/ai` endpoints require an Authorization Header (`Bearer <token>`).*

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   cd backend && npm install
   cd frontend && npm install
   \`\`\`

2. **Environment Variables**
   Ensure `backend/.env` exists with: `MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`, `CLIENT_URL`.
   Ensure `frontend/.env` exists with: `VITE_API_URL`.

3. **Run Application**
   Start both servers simultaneously using:
   \`\`\`bash
   cd backend && npm run dev
   cd frontend && npm run dev
   \`\`\`

## Deployment (Render)
The project is fully compatible with Render using Blueprints (`render.yaml`).
- Frontend is deployed as a static site (`npm run build`).
- Backend is deployed as a Node Web Service.
- Ensure the `VITE_API_URL` on Render includes `/api` at the end (e.g., `https://backend.onrender.com/api`).
