import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";
import { registerSchema, loginSchema } from "../validation/authValidation.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { fullName, email, username, password } = value;
  const hashsedPassword = await bcrypt.hash(password, 10);

  const existing = await pool.query(
    "SELECT id FROM users WHERE email=$1 or username=$2",
    [email, username]
  );
  if (existing.rowCount)
    return res.status(400).json({ error: "User already exists" });

  try {
    const result = await pool.query(
      "INSERT INTO users (full_name, email, username, password) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, username",
      [fullName, email, username, hashsedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.json({ user, token });
  } catch (err) {
    console.error("Register failed: " + err);
    if (err.message.includes("secretOrPrivateKey")) {
      await pool.query("DELETE FROM users WHERE email = $1", [email]);
    }
    res.status(500).json({ error: "Server error during registration" });
  }
});

router.post("/login", async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = value;
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);
  if (!result.rowCount)
    return res.status(400).json({ error: "Invalid credentials" });

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  // const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
  //   expiresIn: "1h",
  // });
  const { accessToken, refreshToken } = generateTokens(user.id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  delete user.password;
  res.json({ user, accessToken });
});

router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  try {
    const payload = jwt.verify(token, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: payload.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  return res.json({ message: "Logged out successfully" });
});

router.get("/me", authMiddleware, async (req, res) => {
  const result = await pool.query(
    "SELECT id, full_name, email, username FROM users WHERE id = $1",
    [req.user.id]
  );
  if (!result.rowCount)
    return res.status(401).json({ error: "User not found" });

  res.json(result.rows[0]);
});

function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, process.env.TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
}

export default router;
