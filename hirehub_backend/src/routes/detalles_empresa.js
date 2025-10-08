const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM detalles_empresa');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM detalles_empresa WHERE id_usuario=$1', [req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const cols = Object.keys(data);
    const values = Object.values(data);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(',');
    const updates = cols.map((c) => `${c}=EXCLUDED.${c}`).join(',');
    const sql = `INSERT INTO detalles_empresa (${cols.join(',')}) VALUES (${placeholders}) ON CONFLICT (id_usuario) DO UPDATE SET ${updates} RETURNING *`;
    const result = await db.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM detalles_empresa WHERE id_usuario=$1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
