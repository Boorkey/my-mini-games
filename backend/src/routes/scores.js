import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { sessionId, score, duration } = req.body;


  try {
    await pool.query(
      "UPDATE sessions SET finished_at = NOW() WHERE id = $1",
      [sessionId]
    );
    await pool.query(
      "INSERT INTO scores (session_id, score, duration) VALUES ($1, $2, $3)",
      [sessionId, score, duration]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Score error" });
  }
});

export default router;
