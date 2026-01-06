import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MEMORY_ITEMS } from "../data/memoryCards";

const API_BASE = "http://localhost:5000";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const doubled = [...MEMORY_ITEMS, ...MEMORY_ITEMS];
    const shuffled = shuffle(doubled).map((val, i) => ({
      id: i,
      value: val,
      flipped: false,
      matched: false,
    }));
    setCards(shuffled);
  }, []);

  useEffect(() => {
    if (first && second) {
      setLock(true);
      setMoves(m => m + 1);

      if (first.value === second.value) {
        setCards(prev =>
          prev.map(c =>
            c.value === first.value ? { ...c, matched: true } : c
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === first.id || c.id === second.id
                ? { ...c, flipped: false }
                : c
            )
          );
          resetTurn();
        }, 600);
      }
    }
  }, [second]);

  function resetTurn() {
    setFirst(null);
    setSecond(null);
    setLock(false);
  }

  function flip(card) {
    if (lock || card.flipped || card.matched) return;

    setCards(prev =>
      prev.map(c => (c.id === card.id ? { ...c, flipped: true } : c))
    );

    if (!first) setFirst(card);
    else setSecond(card);
  }

  const won = cards.length && cards.every(c => c.matched);

  const submitMemoryScore = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    try {
      await fetch(`${API_BASE}/api/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: Number(sessionId),
          score: moves,
          duration: 0,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submit memory score failed", err);
    }
  };

  useEffect(() => {
    if (won && !submitted) {
      submitMemoryScore();
    }
  }, [won, submitted, moves]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between mb-6">
          <Link to="/" className="text-neutral-300 hover:underline">← Back</Link>
          <h2 className="text-2xl font-bold">Memory Game</h2>
          <p>Moves: {moves}</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => flip(card)}
              className={`aspect-square rounded-xl flex justify-center items-center text-4xl
              transition-transform ${
                card.flipped || card.matched
                  ? "bg-green-600"
                  : "bg-neutral-700 hover:scale-105"
              }`}
            >
              {(card.flipped || card.matched) && card.value}
            </button>
          ))}
        </div>

        {won && (
          <div className="mt-6 text-green-400 text-center text-xl font-semibold">
            You won in {moves} moves!
          </div>
        )}
      </div>
    </div>
  );
}
