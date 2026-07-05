/*
  Purpose: CRUD API for customers
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
  const rows = db.prepare("SELECT * FROM customers ORDER BY created_at DESC").all();
  res.json({ customers: rows });
});

router.post("/", (req, res) => {
  const { name, email, phone, address } = req.body || {};
  if (!name) return res.status(400).json({ error: "Customer name is required." });

  const info = db.prepare(
    "INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)"
  ).run(name.trim(), email || null, phone || null, address || null);

  const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json({ customer });
});

router.put("/:id", (req, res) => {
  const { name, email, phone, address } = req.body || {};
  const existing = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Customer not found." });

  db.prepare(
    "UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?"
  ).run(name ?? existing.name, email ?? existing.email, phone ?? existing.phone, address ?? existing.address, req.params.id);

  const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.params.id);
  res.json({ customer });
});

router.delete("/:id", (req, res) => {
  const info = db.prepare("DELETE FROM customers WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Customer not found." });
  res.json({ ok: true });
});

module.exports = router;
