# 🎮 Mini Games Platform

A full-stack web application featuring multiple mini-games, user authentication, and persistent leaderboards.

---

## 🚀 Overview

This project is a **full-stack web application** built using:

* **Frontend:** React (Vite)
* **Backend:** Node.js + Express
* **Database:** Neon PostgreSQL

Users can log in, play different games, and have their scores saved and displayed on leaderboards.

---

## 🎯 Features

* 🔐 User login system
* 🎮 Multiple mini-games:

  * Memory Game (score based on number of attempts)
  * Guess the Flag (score based on correct answers)
  * Sudoku (score based on completion time)
* 🏆 Leaderboards for each game
* 💾 Persistent score storage using PostgreSQL
* 🔄 Real-time communication between frontend and backend via REST API

---

## 🧱 Project Structure

```
my-mini-games/
│
├── src/                 # React frontend
│   ├── pages/           # Main pages (Home, Login, Games, Leaderboards)
│   ├── assets/          # Images and static files
│   ├── data/            # Game data (e.g. memory cards)
│   ├── App.jsx          # Routing setup
│   └── main.jsx         # Entry point
│
├── backend/             # Express backend
│   ├── routes/          # API routes (auth, scores, leaderboard)
│   ├── db.js            # Database connection (Neon)
│   ├── server.js        # Server entry point
│   └── .env             # Environment variables (NOT committed)
│
└── README.md
```

---

## ⚙️ How to Run Locally

### 1️⃣ Clone the repository

```
git clone https://github.com/YOUR_USERNAME/mini-games-project.git
cd mini-games-project
```

---

### 2️⃣ Setup Frontend

```
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

### 3️⃣ Setup Backend

```
cd backend
npm install
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

### 4️⃣ Environment Variables

Create a `.env` file inside the `backend/` folder:

```
DATABASE_URL=your_neon_connection_string
PORT=5000
```

⚠️ Do NOT commit `.env` to GitHub.

---

## 🗄️ Database

The project uses **Neon PostgreSQL**.

Tables include:

* `users`
* `sessions`
* `memory_scores`
* `guess_flag_scores`
* `sudoku_scores`

The backend communicates with the database using SQL queries via the `pg` library.

---

## 🔌 API Endpoints (Examples)

* `POST /api/auth/login` → login or create user
* `POST /api/sessions/start` → start game session
* `POST /api/scores/:game` → submit score
* `GET /api/leaderboard/:game` → fetch leaderboard

---

## 🧠 How It Works

1. User logs in through the frontend
2. Backend creates or retrieves user from database
3. User starts a game (session is created)
4. Game is played in React
5. Score is sent to backend
6. Backend saves score in database
7. Leaderboard displays top scores

---

## 🎓 Technologies Used

* React
* React Router
* Node.js
* Express.js
* PostgreSQL (Neon)
* Tailwind CSS

---

## 📌 Notes

* This project demonstrates a **full-stack architecture**
* Frontend and backend are **separated and communicate via HTTP**
* Database ensures **persistent and shared data across users**

---

## 📷 Future Improvements

* Multiplayer (1v1) support
* Authentication with passwords
* UI/UX enhancements
* Deployment (Vercel + Render)

---

## 👨‍💻 Author

Developed as a course project demonstrating full-stack web development concepts.

---

## 📄 License

This project is for educational purposes.

