/*
  Purpose: CRUD API for drivers
  Author: FreightFlow Engineering
  Version: 0.1.0
  Last Updated: 2026-07-05
*/

const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM drivers ORDER BY created_at DESC").all();
  res.json({ drivers: rows });
});

router.post("/", (req, res) => {
  const { name, phone, licenseNo, status } = req.body || {};
  if (!name) return res.status(400).json({ error: "Driver name is required." });

  const info = db.prepare(
    "INSERT INTO drivers (name, phone, license_no, status) VALUES (?, ?, ?, ?)"
  ).run(name.trim(), phone || null, licenseNo || null, status || "Available");

  const driver = db.prepare("SELECT * FROM drivers WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json({ driver });
});

router.put("/:id", (req, res) => {
  const { name, phone, licenseNo, status } = req.body || {};
  const existing = db.prepare("SELECT * FROM drivers WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Driver not found." });

  db.prepare(
    "UPDATE drivers SET name = ?, phone = ?, license_no = ?, status = ? WHERE id = ?"
  ).run(
    name ?? existing.name,
    phone ?? existing.phone,
    licenseNo ?? existing.license_no,
    status ?? existing.status,
    req.params.id
  );

  const driver = db.prepare("SELECT * FROM drivers WHERE id = ?").get(req.params.id);
  res.json({ driver });
});

router.delete("/:id", (req, res) => {
  const info = db.prepare("DELETE FROM drivers WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Driver not found." });
  res.json({ ok: true });
});

module.exports = router;
