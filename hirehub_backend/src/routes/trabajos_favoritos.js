const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM trabajos_favoritos');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id_candidato, id_trabajo } = req.body;
    const r = await db.query('INSERT INTO trabajos_favoritos (id_candidato,id_trabajo) VALUES ($1,$2) RETURNING *', [id_candidato, id_trabajo]);
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(409).json({ error: 'Already favorited' });
    res.status(500).json({ error: err.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { id_candidato, id_trabajo } = req.body;
    await db.query('DELETE FROM trabajos_favoritos WHERE id_candidato=$1 AND id_trabajo=$2', [id_candidato, id_trabajo]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
