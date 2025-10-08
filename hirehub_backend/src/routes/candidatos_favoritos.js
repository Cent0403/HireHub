const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM candidatos_favoritos');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id_empresa, id_candidato } = req.body;
    const r = await db.query('INSERT INTO candidatos_favoritos (id_empresa,id_candidato) VALUES ($1,$2) RETURNING *', [id_empresa, id_candidato]);
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(409).json({ error: 'Already favorited' });
    res.status(500).json({ error: err.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { id_empresa, id_candidato } = req.body;
    await db.query('DELETE FROM candidatos_favoritos WHERE id_empresa=$1 AND id_candidato=$2', [id_empresa, id_candidato]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
