import express from "express";
import { pool } from "../db/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

async function awardXp(userId) {
  const XP_GAIN = 10;
  await pool.query(
    `UPDATE users
       SET xp = xp + $1
       WHERE id = $2`,
    [XP_GAIN, userId]
  );
  return XP_GAIN;
}

async function awardFirst5LogsBadge(userId) {
  const countRes = await pool.query(
    `SELECT (
       (SELECT COUNT(*) FROM workouts WHERE user_id=$1)
       + (SELECT COUNT(*) FROM nutrition WHERE user_id=$1)
       + (SELECT COUNT(*) FROM activities WHERE user_id=$1)
     ) as total_logs`,
    [userId]
  );
  const totalLogs = Number(countRes.rows[0].total_logs);
  const unlocked = [];

  if (totalLogs >= 5) {
    const badgeRes = await pool.query(
      `SELECT id, name, description, icon_url FROM badges WHERE key = 'first_5_logs'`
    );
    const badge = badgeRes.rows[0];
    if (badge) {
      const insertRes = await pool.query(
        `INSERT INTO user_badges (user_id, badge_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING
         RETURNING badge_id`,
        [userId, badge.id]
      );
      if (insertRes.rowCount > 0) {
        unlocked.push({
          id: badge.id,
          key: "first_5_logs",
          name: badge.name,
          description: badge.description,
          icon_url: badge.icon_url,
        });
      }
    }
  }

  return unlocked;
}

async function awardXpAndBadges(userId) {
  const xpGained = await awardXp(userId);
  const totalXpRes = await pool.query(`SELECT xp FROM users WHERE id = $1`, [
    userId,
  ]);
  const totalXp = totalXpRes.rows[0].xp;
  const unlockedBadges = await awardFirst5LogsBadge(userId);
  return { xpGained, totalXp, unlockedBadges };
}

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
async function handlePost(req, res, insertQuery, insertParams) {
  const userId = req.user.id;
  try {
    await pool.query(insertQuery, insertParams);
    const { xpGained, totalXp, unlockedBadges } = await awardXpAndBadges(
      userId
    );
    res.status(201).json({
      message: "Logged successfully!",
      xpGained,
      totalXp,
      unlockedBadges,
    });
  } catch {
    res.status(500).json({ error: "Failed to log entry." });
  }
}

router.post("/workouts", authMiddleware, async (req, res) => {
  const { workout_type, duration, entry_date } = req.body;

  handlePost(
    req,
    res,
    `INSERT INTO workouts (user_id, workout_type, duration, entry_date) VALUES ($1,$2,$3,$4)`,
    [req.user.id, workout_type, duration, entry_date]
  );
});

router.post("/nutrition", authMiddleware, async (req, res) => {
  const { calories_consumed, calories_burned, entry_date } = req.body;
  handlePost(
    req,
    res,
    `INSERT INTO nutrition (user_id, calories_consumed, calories_burned, entry_date) VALUES ($1,$2,$3,$4)`,
    [req.user.id, calories_consumed, calories_burned, entry_date]
  );
});

router.post("/activities", authMiddleware, async (req, res) => {
  const { activity_type, duration, entry_date } = req.body;
  handlePost(
    req,
    res,
    `INSERT INTO activities (user_id, activity_type, duration, entry_date) VALUES ($1,$2,$3,$4)`,
    [req.user.id, activity_type, duration, entry_date]
  );
});

export default router;
