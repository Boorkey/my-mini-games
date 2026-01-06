import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MemoryGame from "./pages/MemoryGame";
import GuessFlag from "./pages/GuessFlag";
import Sudoku from "./pages/Sudoku";
import "./index.css";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Leaderboards from "./pages/Leaderboards";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/:game" element={<ProtectedRoute><Login /></ProtectedRoute>} />
      <Route
        path="/memory"
        element={
          <ProtectedRoute>
            <MemoryGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flags"
        element={
          <ProtectedRoute>
            <GuessFlag />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sudoku"
        element={
          <ProtectedRoute>
            <Sudoku />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboards"
        element={
          <ProtectedRoute>
            <Leaderboards />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
