const express = require('express');
const router = express.Router();
const db = require('../db');
const { check } = require('express-validator');
const runValidation = require('../middlewares/validate');

router.get('/', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM aplicacion_trabajo');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM aplicacion_trabajo WHERE id_aplicacion=$1', [req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/',
  (req, res, next) => {
    console.log('=== POST /aplicacion_trabajo ===');
    console.log('Body recibido:', req.body);
    next();
  },
  [
    check('id_candidato').isInt().withMessage('candidato_id debe ser un entero'),
    check('id_trabajo').isInt().withMessage('trabajo_id debe ser un entero'),
  ],
  runValidation,
  async (req, res) => {
    try {
      const { id_candidato, id_trabajo, estado } = req.body;
      console.log('Pasó validación. Datos:', { id_candidato, id_trabajo, estado });
      const r = await db.query('INSERT INTO aplicacion_trabajo (id_candidato,id_trabajo,estado) VALUES ($1,$2,$3) RETURNING *', [id_candidato, id_trabajo, estado]);
      res.status(201).json(r.rows[0]);
    } catch (err) {
      console.error(err);
      if (err.code === '23505') return res.status(409).json({ error: 'Duplicate application' });
      if (err.code === '23514') return res.status(400).json({ error: 'Estado inválido. Valores permitidos: Revisando, Pendiente, Denegado, Aceptado' });
      res.status(500).json({ error: err.message });
    }
  }
);

router.put('/:id', async (req, res) => {
  try {
    const { estado } = req.body;
    const r = await db.query('UPDATE aplicacion_trabajo SET estado=$1 WHERE id_aplicacion=$2 RETURNING *', [estado, req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM aplicacion_trabajo WHERE id_aplicacion=$1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
