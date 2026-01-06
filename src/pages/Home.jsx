import { Link } from "react-router-dom";
import "../index.css";


export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center p-10">
      <h1 className="text-5xl font-extrabold mb-12 text-center">
        Mini Games Arcade
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl">

        <Link
          to="/login/memory"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 rounded-2xl
          text-center text-3xl font-semibold shadow-xl hover:scale-105 transition"
        >
          MEMORY CARDS
        </Link>

        <Link
          to="/login/flags"
          className="bg-gradient-to-r from-green-600 to-emerald-600 p-10 rounded-2xl
          text-center text-3xl font-semibold shadow-xl hover:scale-105 transition"
        >
          GUESS THE FLAG
        </Link>

        <Link
          to="/login/sudoku"
          className="bg-gradient-to-r from-purple-600 to-purple-600 p-10 rounded-2xl
          text-center text-3xl font-semibold shadow-xl hover:scale-105 transition"
        >
          SUDOKU
        </Link>

        <Link
          to="/leaderboards"
          className="bg-gradient-to-r from-yellow-600 to-orange-600 p-10 rounded-2xl
          text-center text-3xl font-semibold shadow-xl hover:scale-105 transition"
        >
          -Leaderboards-
        </Link>

      </div>
    
      <p className="mt-10 text-neutral-400">React • Vite • Tailwind v4</p>
    </div>
  );
}
