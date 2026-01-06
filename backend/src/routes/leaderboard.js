import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/:game", async (req, res) => {
  const { game } = req.params;

  let orderClause = "s.score ASC";
  if (game === "flags") orderClause = "s.score DESC";
  if (game === "sudoku") orderClause = "s.duration ASC";

  try {
    const result = await pool.query(`
      SELECT u.username, s.score, s.duration
      FROM scores s
      JOIN sessions sess ON s.session_id = sess.id
      JOIN users u ON sess.user_id = u.id
      WHERE sess.game = $1
      ORDER BY ${orderClause}
      LIMIT 10
    `, [game]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Leaderboard error" });
  }
});

export default router;
