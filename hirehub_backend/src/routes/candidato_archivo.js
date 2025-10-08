const express = require('express');
const router = express.Router();
const db = require('../db');
const { check } = require('express-validator');
const runValidation = require('../middlewares/validate');

router.get('/', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM candidato_archivo');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM candidato_archivo WHERE id_archivo=$1', [req.params.id]);
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
    check('id_usuario').isInt().withMessage('candidato_id debe ser un entero'),
    check('nombre_archivo').trim().notEmpty().withMessage('nombre es obligatorio'),
    check('ruta_archivo').optional().isString().withMessage('ruta invalida')
  ],
  runValidation,
  async (req, res) => {
    try {
      const { id_usuario, nombre_archivo, ruta_archivo } = req.body;
      const r = await db.query('INSERT INTO candidato_archivo (id_usuario,nombre_archivo,ruta_archivo) VALUES ($1,$2,$3) RETURNING *', [id_usuario, nombre_archivo, ruta_archivo]);
      res.status(201).json(r.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

router.put('/:id', async (req, res) => {
  try {
    const { nombre_archivo, ruta_archivo } = req.body;
    const r = await db.query('UPDATE candidato_archivo SET nombre_archivo=$1,ruta_archivo=$2 WHERE id_archivo=$3 RETURNING *', [nombre_archivo, ruta_archivo, req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM candidato_archivo WHERE id_archivo=$1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
