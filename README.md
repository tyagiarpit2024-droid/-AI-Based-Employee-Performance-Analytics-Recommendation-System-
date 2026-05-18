# AI-Based Employee Performance Analytics & Recommendation System

## Overview
A full-stack MERN application that serves as an Employee Performance Analytics & Recommendation System. It includes authentication, CRUD operations for employees, and utilizes the OpenRouter API to provide AI-based recommendations and insights.

## Features
- **JWT Authentication**: Secure login and signup.
- **Employee Management**: Add, update, view, and delete employee records.
- **AI Recommendations**: Get AI-driven feedback, promotion recommendations, and training suggestions for employees using OpenRouter API.
- **Analytics Dashboard**: View aggregate data, such as department-wise statistics and performance averages.
- **Responsive UI**: Built with React and Tailwind CSS.
- **Deployment Ready**: Fully configured for deployment on Render.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, Recharts, Axios.
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcrypt, Axios.
- **Database**: MongoDB Atlas.
- **AI**: OpenRouter API (OpenAI compatible).

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder using the provided `.env.example`.

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` folder with `VITE_API_URL=http://localhost:5000/api`.

4. **Run Application:**
   Open two terminals:
   - Terminal 1: `cd backend && npm run dev`
   - Terminal 2: `cd frontend && npm run dev`

## Deployment
This project is configured for one-click deployment on Render using the included `render.yaml` file.
1. Connect your GitHub repository to Render.
2. Render will automatically detect the `render.yaml` and deploy two services:
   - A Node.js Web Service for the backend.
   - A Static Site for the frontend.
3. Configure the environment variables in the Render dashboard for both services based on the `.env.example` files.
