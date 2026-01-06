import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.post("/start", async (req, res) => {
  const { userId, game } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO sessions (user_id, game) VALUES ($1, $2) RETURNING id",
      [userId, game]
    );

    res.json({ sessionId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Session error" });
  }
});

export default router;
