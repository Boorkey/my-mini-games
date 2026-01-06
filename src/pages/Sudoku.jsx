import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const BOARDS = [
  [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ],
  [
    [4, 3, 5, 2, 6, 9, 7, 8, 1],
    [6, 8, 2, 5, 7, 1, 4, 9, 3],
    [1, 9, 7, 8, 3, 4, 5, 6, 2],
    [8, 2, 6, 1, 9, 5, 3, 4, 7],
    [3, 7, 4, 6, 8, 2, 9, 1, 5],
    [9, 5, 1, 7, 4, 3, 6, 2, 8],
    [5, 1, 9, 3, 2, 6, 8, 7, 4],
    [2, 4, 8, 9, 5, 7, 1, 3, 6],
    [7, 6, 3, 4, 1, 8, 2, 5, 9],
  ],
];

// Create easier puzzles by removing some cells (keeping ~35 filled out of 81)
const createEasyPuzzle = (solvedBoard) => {
  const puzzle = solvedBoard.map(row => [...row]);
  // Remove about 46 cells to keep ~35 filled (easier puzzle)
  const positionsToRemove = [
    [0, 2], [0, 5], [0, 7], [0, 8],
    [1, 0], [1, 1], [1, 3], [1, 6], [1, 8],
    [2, 1], [2, 2], [2, 4], [2, 5], [2, 7], [2, 8],
    [3, 0], [3, 2], [3, 3], [3, 5], [3, 6], [3, 8],
    [4, 0], [4, 1], [4, 3], [4, 4], [4, 6], [4, 7],
    [5, 1], [5, 2], [5, 4], [5, 5], [5, 7], [5, 8],
    [6, 0], [6, 2], [6, 3], [6, 5], [6, 6], [6, 8],
    [7, 1], [7, 2], [7, 4], [7, 5], [7, 7], [7, 8],
    [8, 0], [8, 1], [8, 3], [8, 4], [8, 6], [8, 7],
  ];
  
  positionsToRemove.forEach(([r, c]) => {
    puzzle[r][c] = 0;
  });
  
  return puzzle;
};

const copy = (b) => b.map((r) => [...r]);

export default function Sudoku() {
  const [initialBoard, setInitialBoard] = useState([]);
  const [board, setBoard] = useState([]);
  const [message, setMessage] = useState("");

  // ⏱️ TIMER STATE
  const [startTime, setStartTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const solved = BOARDS[Math.floor(Math.random() * BOARDS.length)];
    const base = createEasyPuzzle(solved);
    setInitialBoard(copy(base));
    setBoard(copy(base));
    setStartTime(Date.now());     // ⏱️ start timing
    setFinishTime(null);
    setCurrentTime(0);
  }, []);

  // Update timer every second
  useEffect(() => {
    if (!startTime || finishTime !== null) return;

    const interval = setInterval(() => {
      setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, finishTime]);

  const isValidPlacement = (board, row, col, num) => {
    if (num === 0) return true;

    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === num) return false;
    }

    // Check 3x3 block
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    for (let r = blockRow; r < blockRow + 3; r++) {
      for (let c = blockCol; c < blockCol + 3; c++) {
        if (r !== row && c !== col && board[r][c] === num) return false;
      }
    }

    return true;
  };

  const handleChange = (r, c, value) => {
    if (initialBoard[r][c] !== 0) return;
    if (!/^[1-9]?$/.test(value)) return;

    const next = copy(board);
    const numValue = value === "" ? 0 : Number(value);
    next[r][c] = numValue;
    
    // Validate placement if a number is entered
    if (numValue !== 0 && !isValidPlacement(next, r, c, numValue)) {
      alert(`❌ Invalid placement! This number conflicts with another cell in the row, column, or block.`);
      return;
    }

    setBoard(next);
  };

  const isValidGroup = (arr) => {
    const nums = arr.filter((n) => n !== 0);
    return nums.length === new Set(nums).size;
  };

  const submitSudokuScore = async (durationSeconds) => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    try {
      await fetch(`${API_BASE}/api/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: Number(sessionId),
          score: 0,
          duration: durationSeconds,
        }),
      });
    } catch (err) {
      console.error("Submit sudoku score failed", err);
    }
  };

  const checkCorrect = () => {
    // rows & columns
    for (let i = 0; i < 9; i++) {
      if (!isValidGroup(board[i])) {
        setMessage("❌ Incorrect: row conflict");
        return;
      }
      if (!isValidGroup(board.map((r) => r[i]))) {
        setMessage("❌ Incorrect: column conflict");
        return;
      }
    }

    // 3x3 blocks
    for (let r = 0; r < 9; r += 3) {
      for (let c = 0; c < 9; c += 3) {
        const block = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            block.push(board[r + i][c + j]);
          }
        }
        if (!isValidGroup(block)) {
          setMessage("❌ Incorrect: block conflict");
          return;
        }
      }
    }

    // check if fully filled
    const complete = board.every(row => row.every(cell => cell !== 0));
    if (!complete) {
      setMessage("⚠️ Looks correct so far, but not finished yet");
      return;
    }

    // 🏁 FINISHED
    if (!finishTime) {
      const time = Math.floor((Date.now() - startTime) / 1000);
      setFinishTime(time);
      setCurrentTime(time);
      setMessage(`🎉 Completed in ${time} seconds!`);

      // Store finish time for scoreboard (accessible via window.sudokuFinishTime or localStorage)
      window.sudokuFinishTime = time;
      localStorage.setItem("sudokuFinishTime", time.toString());

      // Send score to backend
      submitSudokuScore(time);
    }
  };

  if (!board.length) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">Sudoku</h1>
      
      <div className="mb-4 text-2xl font-semibold">
        ⏱️ Time: {finishTime !== null ? `${finishTime}s` : `${currentTime}s`}
      </div>

      <div className="grid grid-cols-9 gap-1 bg-gray-700 p-2 rounded-lg">
        {board.map((row, r) =>
          row.map((num, c) => {
            const locked = initialBoard[r][c] !== 0;

            return (
              <input
                key={`${r}-${c}`}
                value={num === 0 ? "" : num}
                readOnly={locked}
                onChange={(e) => handleChange(r, c, e.target.value)}
                className={`
                  w-10 h-10 text-center text-lg font-semibold rounded
                  ${locked ? "bg-gray-300 text-black" : "bg-white text-black"}
                  ${r % 3 === 0 ? "border-t-2" : ""}
                  ${c % 3 === 0 ? "border-l-2" : ""}
                  border-gray-700 focus:outline-none
                `}
              />
            );
          })
        )}
      </div>

      <button
        onClick={checkCorrect}
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold"
      >
        Check if correct
      </button>

      {message && <p className="mt-4 text-xl">{message}</p>}

      <Link
        to="/"
        className="mt-8 text-blue-400 hover:text-blue-300 underline"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
