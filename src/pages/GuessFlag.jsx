import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000";

import bosnia from "../assets/flags/bosnia.png";
import france from "../assets/flags/france.png";
import germany from "../assets/flags/germany.png";
import italy from "../assets/flags/italy.png";
import spain from "../assets/flags/spain.png";
import uk from "../assets/flags/uk.png";
import usa from "../assets/flags/usa.png";
import japan from "../assets/flags/japan.png";
import china from "../assets/flags/china.png";
import brazil from "../assets/flags/brazil.png";

const FLAGS = [
  { name: "Bosnia and Herzegovina", img: bosnia },
  { name: "France", img: france },
  { name: "Germany", img: germany },
  { name: "Italy", img: italy },
  { name: "Spain", img: spain },
  { name: "United Kingdom", img: uk },
  { name: "United States", img: usa },
  { name: "Japan", img: japan },
  { name: "China", img: china },
  { name: "Brazil", img: brazil },
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function GuessFlag() {
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [answered, setAnswered] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    nextQuestion();
  }, []);

  const nextQuestion = () => {
    const correct = FLAGS[Math.floor(Math.random() * FLAGS.length)];
    const wrong = shuffle(
      FLAGS.filter((f) => f.name !== correct.name)
    ).slice(0, 3);

    setCurrent(correct);
    setOptions(shuffle([correct, ...wrong]));
    setMessage("");
    setAnswered(false);
  };

  const choose = (choice) => {
    if (answered) return;

    if (choice.name === current.name) {
      setScore((s) => s + 1);
      setMessage("✅ Correct!");
    } else {
      setMessage(`❌ Wrong! It was ${current.name}`);
    }

    setAnswered(true);

    setTimeout(() => {
      setRound((r) => r + 1);
      nextQuestion();
    }, 1200);
  };

  const submitFlagsScore = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    try {
      await fetch(`${API_BASE}/api/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: Number(sessionId),
          score,
          duration: 0,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submit flags score failed", err);
    }
  };

  useEffect(() => {
    if (round > 10 && !submitted) {
      submitFlagsScore();
    }
  }, [round, submitted, score]);

  // GAME END
  if (round > 10) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">🏁 Game Over</h1>
        <p className="text-2xl mb-6">
          Score: {score} / 10
        </p>
        <Link to="/" className="text-blue-400 underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-2">Guess the Flag</h1>
      <p className="mb-4">Question {round} / 10</p>

      <img
        src={current.img}
        alt="Flag"
        className="w-64 h-40 object-cover rounded-xl mb-6"
      />

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {options.map((opt) => (
          <button
            key={opt.name}
            onClick={() => choose(opt)}
            className="p-4 bg-white/20 hover:bg-white/30 rounded-xl font-semibold"
          >
            {opt.name}
          </button>
        ))}
      </div>

      {message && <p className="mt-6 text-xl">{message}</p>}

      <Link to="/" className="mt-8 text-blue-400 underline">
        ← Back to Home
      </Link>
    </div>
  );
}
