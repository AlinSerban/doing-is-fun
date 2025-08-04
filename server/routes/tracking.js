import express from "express";
import { pool } from "../db/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET
router.get("/workouts/summary", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const totalResult = await pool.query(
    `SELECT COALESCE(SUM(duration), 0) as total FROM workouts WHERE user_id = $1 and entry_date >= CURRENT_DATE - INTERVAL '7 days'`,
    [userId]
  );

  const typeResult = await pool.query(
    `SELECT workout_type, COUNT(*) FROM workouts WHERE user_id = $1 GROUP BY workout_type ORDER BY COUNT(*) DESC LIMIT 1`,
    [userId]
  );

  res.json({
    totalMinutes: totalResult.rows[0].total,
    mostFrequentType: typeResult.rows[0]?.workout_type || "N/A",
  });
});

router.get("/workouts/history", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const result = await pool.query(
    `
    SELECT DATE(entry_timestamp) AS entry_date, SUM(duration) AS total_duration
    FROM workouts
    WHERE user_id = $1 AND entry_timestamp >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(entry_timestamp)
    ORDER BY DATE(entry_timestamp)
    `,
    [userId]
  );
  res.json(result.rows);
});

router.get("/nutrition/history", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT DATE(entry_timestamp) AS entry_date,
            SUM(calories_consumed) AS total_consumed,
            SUM(calories_burned) AS total_burned
      FROM nutrition
      WHERE user_id = $1 AND entry_timestamp >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(entry_timestamp)
      ORDER BY DATE(entry_timestamp)
      `,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch nutrition history" });
  }
});

router.get("/activities/history", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT DATE(entry_timestamp) AS entry_date, SUM(duration) AS total_duration
      FROM activities
      WHERE user_id = $1 AND entry_timestamp >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(entry_timestamp)
      ORDER BY DATE(entry_timestamp)
      `,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activity history" });
  }
});

// POST
router.post("/workouts", authMiddleware, async (req, res) => {
  const { workout_type, duration, entry_date } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      `INSERT INTO workouts (user_id, workout_type, duration, entry_date)
            VALUES ($1, $2, $3, $4)`,
      [userId, workout_type, duration, entry_date]
    );
    res.status(201).json({ message: "Workout logged!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to log workout." });
  }
});

router.post("/nutrition", authMiddleware, async (req, res) => {
  const { calories_consumed, calories_burned, entry_date } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      `
            INSERT INTO nutrition (user_id, calories_consumed, calories_burned, entry_date)
            VALUES ($1, $2, $3, $4)`,
      [userId, calories_consumed, calories_burned, entry_date]
    );

    res.status(201).json({ message: "Nutrition logged!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to log nutrition." });
  }
});

router.post("/activities", authMiddleware, async (req, res) => {
  const { activity_type, duration, entry_date } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      `
        INSERT INTO activities (user_id, activity_type, duration, entry_date)
        VALUES ($1, $2, $3, $4)`,
      [userId, activity_type, duration, entry_date]
    );
    res.status(201).json({ message: "Activity logged!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to log activity." });
  }
});

export default router;
