const express = require('express');
const router = express.Router();
const db = require('../db');
const { check } = require('express-validator');
const runValidation = require('../middlewares/validate');

router.get('/', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM empresa_red_social');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM empresa_red_social WHERE id_red_social=$1', [req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/',
  [
    check('id_usuario').isInt().withMessage('empresa_id debe ser un entero'),
    check('nombre_red').trim().notEmpty().withMessage('red es obligatoria'),
    check('link').isURL().withMessage('enlace debe ser una URL válida')
  ],
  runValidation,
  async (req, res) => {
    try {
      const { id_usuario, nombre_red, link } = req.body;
      const r = await db.query('INSERT INTO empresa_red_social (id_usuario,nombre_red,link) VALUES ($1,$2,$3) RETURNING *', [id_usuario, nombre_red, link]);
      res.status(201).json(r.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

router.put('/:id', async (req, res) => {
  try {
    const { nombre_red, link } = req.body;
    const r = await db.query('UPDATE empresa_red_social SET nombre_red=$1,link=$2 WHERE id_red_social=$3 RETURNING *', [nombre_red, link, req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM empresa_red_social WHERE id_red_social=$1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
