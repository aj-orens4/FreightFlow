/*
  Purpose: CRUD API for vehicles
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
  const rows = db.prepare(`
    SELECT vehicles.*, drivers.name AS driver_name
    FROM vehicles
    LEFT JOIN drivers ON drivers.id = vehicles.driver_id
    ORDER BY vehicles.created_at DESC
  `).all();
  res.json({ vehicles: rows });
});

router.post("/", (req, res) => {
  const { plateNo, type, capacityKg, status, driverId } = req.body || {};
  if (!plateNo) return res.status(400).json({ error: "Plate number is required." });

  const info = db.prepare(
    "INSERT INTO vehicles (plate_no, type, capacity_kg, status, driver_id) VALUES (?, ?, ?, ?, ?)"
  ).run(plateNo.trim(), type || "Truck", capacityKg || null, status || "Available", driverId || null);

  const vehicle = db.prepare("SELECT * FROM vehicles WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json({ vehicle });
});

router.put("/:id", (req, res) => {
  const { plateNo, type, capacityKg, status, driverId } = req.body || {};
  const existing = db.prepare("SELECT * FROM vehicles WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Vehicle not found." });

  db.prepare(
    "UPDATE vehicles SET plate_no = ?, type = ?, capacity_kg = ?, status = ?, driver_id = ? WHERE id = ?"
  ).run(
    plateNo ?? existing.plate_no,
    type ?? existing.type,
    capacityKg ?? existing.capacity_kg,
    status ?? existing.status,
    driverId ?? existing.driver_id,
    req.params.id
  );

  const vehicle = db.prepare("SELECT * FROM vehicles WHERE id = ?").get(req.params.id);
  res.json({ vehicle });
});

router.delete("/:id", (req, res) => {
  const info = db.prepare("DELETE FROM vehicles WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Vehicle not found." });
  res.json({ ok: true });
});

module.exports = router;
