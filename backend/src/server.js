import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/sessions.js";
import scoreRoutes from "./routes/scores.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import { pool } from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("Server here");
console.log("Server running on http://localhost:5000");


app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
pool.query("SELECT COUNT(*) FROM users")
  .then(res => console.log("Users in DB:", res.rows[0]))
  .catch(err => console.error("Neon error:", err));