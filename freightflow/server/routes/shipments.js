/*
  Purpose: CRUD API for shipments, including basic dashboard stats aggregation
  Author: FreightFlow Engineering
  Version: 0.1.0
  Last Updated: 2026-07-05
*/

const express = require("express");
const db = require("../db");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
router.use(requireAuth);

function generateReference() {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `FF-${n}`;
}

router.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT shipments.*,
           customers.name AS customer_name,
           vehicles.plate_no AS vehicle_plate,
           drivers.name AS driver_name
    FROM shipments
    LEFT JOIN customers ON customers.id = shipments.customer_id
    LEFT JOIN vehicles ON vehicles.id = shipments.vehicle_id
    LEFT JOIN drivers ON drivers.id = shipments.driver_id
    ORDER BY shipments.created_at DESC
  `).all();
  res.json({ shipments: rows });
});

router.get("/stats", (req, res) => {
  const total = db.prepare("SELECT COUNT(*) AS c FROM shipments").get().c;
  const byStatus = db.prepare("SELECT status, COUNT(*) AS c FROM shipments GROUP BY status").all();
  const revenue = db.prepare("SELECT COALESCE(SUM(cost), 0) AS total FROM shipments").get().total;
  res.json({ total, byStatus, revenue });
});

router.post("/", (req, res) => {
  const { customerId, vehicleId, driverId, origin, destination, status, weightKg, cost } = req.body || {};
  if (!origin || !destination) {
    return res.status(400).json({ error: "Origin and destination are required." });
  }

  const reference = generateReference();
  const info = db.prepare(`
    INSERT INTO shipments (reference, customer_id, vehicle_id, driver_id, origin, destination, status, weight_kg, cost)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    reference,
    customerId || null,
    vehicleId || null,
    driverId || null,
    origin.trim(),
    destination.trim(),
    status || "Pending",
    weightKg || null,
    cost || 0
  );

  const shipment = db.prepare("SELECT * FROM shipments WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json({ shipment });
});

router.put("/:id", (req, res) => {
  const { customerId, vehicleId, driverId, origin, destination, status, weightKg, cost } = req.body || {};
  const existing = db.prepare("SELECT * FROM shipments WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Shipment not found." });

  db.prepare(`
    UPDATE shipments
    SET customer_id = ?, vehicle_id = ?, driver_id = ?, origin = ?, destination = ?, status = ?, weight_kg = ?, cost = ?
    WHERE id = ?
  `).run(
    customerId ?? existing.customer_id,
    vehicleId ?? existing.vehicle_id,
    driverId ?? existing.driver_id,
    origin ?? existing.origin,
    destination ?? existing.destination,
    status ?? existing.status,
    weightKg ?? existing.weight_kg,
    cost ?? existing.cost,
    req.params.id
  );

  const shipment = db.prepare("SELECT * FROM shipments WHERE id = ?").get(req.params.id);
  res.json({ shipment });
});

router.delete("/:id", (req, res) => {
  const info = db.prepare("DELETE FROM shipments WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Shipment not found." });
  res.json({ ok: true });
});

module.exports = router;
