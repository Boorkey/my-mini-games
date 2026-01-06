import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const API_BASE = "http://localhost:5000";

export default function Login() {
  const { game } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      // 1) Log in or create user
      const authRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!authRes.ok) {
        console.error("Auth failed");
        return;
      }

      const { userId } = await authRes.json();
      localStorage.setItem("userId", String(userId));

      // 2) Start a game session
      const sessionRes = await fetch(`${API_BASE}/api/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, game }),
      });

      if (!sessionRes.ok) {
        console.error("Session start failed");
        return;
      }

      const { sessionId } = await sessionRes.json();
      localStorage.setItem("sessionId", String(sessionId));
      localStorage.setItem("currentGame", game);

      navigate(`/${game}`);
    } catch (err) {
      console.error("Login/start error", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">Who's playing?</h1>

      <p className="mb-6 text-lg">
        Starting game: <span className="font-semibold capitalize">{game}</span>
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full p-3 rounded-lg text-white text-lg mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg text-lg font-semibold"
        >
          Start Game
        </button>
      </form>

      <Link
        to="/"
        className="mt-6 text-blue-400 hover:text-blue-300 underline"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
