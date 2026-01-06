import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const GAMES = [
  { key: "memory", label: "Memory (Least Moves)" },
  { key: "flags", label: "Flags (Most Correct)" },
  { key: "sudoku", label: "Sudoku (Fastest Time)" },
];

export default function Leaderboards() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      GAMES.map((g) =>
        fetch(`http://localhost:5000/api/leaderboard/${g.key}`)
          .then((res) => res.json())
          .then((rows) => ({ game: g.key, rows }))
      )
    ).then((results) => {
      const obj = {};
      results.forEach((r) => (obj[r.game] = r.rows));
      setData(obj);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading leaderboards...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-10">🏆 Leaderboards</h1>

      {GAMES.map((g) => (
        <div key={g.key} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{g.label}</h2>

          <div className="bg-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/20">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Player</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Time (s)</th>
                </tr>
              </thead>
              <tbody>
                {data[g.key]?.map((row, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3">{row.username}</td>
                    <td className="p-3">{row.score}</td>
                    <td className="p-3">{row.duration ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="text-center mt-10">
        <Link to="/" className="text-blue-400 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
