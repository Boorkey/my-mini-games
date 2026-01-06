import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username } = req.body;


  if (!username) return res.status(400).json({ error: "Username required" });

  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    if (existing.rows.length) {
      return res.json({ userId: existing.rows[0].id });
    }

    const created = await pool.query(
      "INSERT INTO users (username) VALUES ($1) RETURNING id",
      [username]
    );
    res.json({ userId: created.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Auth error" });
  }
});

export default router;
