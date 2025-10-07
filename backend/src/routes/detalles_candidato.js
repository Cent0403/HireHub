const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all detalles candidato
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM detalles_candidato');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM detalles_candidato WHERE id_usuario=$1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Create or update (upsert)
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    // Basic upsert using INSERT ... ON CONFLICT (id_usuario) DO UPDATE
    const cols = Object.keys(data);
    const values = Object.values(data);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(',');
    const updates = cols.map((c, i) => `${c}=EXCLUDED.${c}`).join(',');
    const sql = `INSERT INTO detalles_candidato (${cols.join(',')}) VALUES (${placeholders}) ON CONFLICT (id_usuario) DO UPDATE SET ${updates} RETURNING *`;
    const result = await db.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM detalles_candidato WHERE id_usuario=$1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
