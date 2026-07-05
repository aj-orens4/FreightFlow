/*
  Purpose: Registration, login, logout, and "who am I" endpoints
  Author: FreightFlow Engineering
  Version: 0.1.0
  Last Updated: 2026-07-05
*/

const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

function publicUser(u) {
  return { id: u.id, fullName: u.full_name, email: u.email, role: u.role };
}

router.post("/register", (req, res) => {
  const { fullName, email, password, role } = req.body || {};

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "Full name, email, and password are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const allowedRoles = ["Administrator", "Freight Manager", "Dispatcher", "Fleet Supervisor", "Driver", "Customer", "Service Provider", "Business Owner"];
  const finalRole = allowedRoles.includes(role) ? role : "Administrator";

  const info = db.prepare(
    "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)"
  ).run(fullName.trim(), email.toLowerCase().trim(), passwordHash, finalRole);

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);

  req.session.userId = user.id;
  res.status(201).json({ user: publicUser(user) });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  req.session.userId = user.id;
  res.json({ user: publicUser(user) });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

router.get("/me", (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Not authenticated." });
  }
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.session.userId);
  if (!user) return res.status(401).json({ error: "Not authenticated." });
  res.json({ user: publicUser(user) });
});

module.exports = router;
