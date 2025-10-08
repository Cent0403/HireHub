const express = require('express');
const router = express.Router();
const db = require('../db');

// List usuarios
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM usuario ORDER BY id_usuario');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get usuario by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM usuario WHERE id_usuario = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuario not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Create usuario
router.post('/', async (req, res) => {
  try {
    const { nombre_completo, usuario, correo, contrasena_hash, tipo } = req.body;
    const result = await db.query(
      'INSERT INTO usuario (nombre_completo, usuario, correo, contrasena_hash, tipo) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [nombre_completo, usuario, correo, contrasena_hash, tipo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_completo, usuario, correo, contrasena_hash, tipo } = req.body;
    const result = await db.query(
      'UPDATE usuario SET nombre_completo=$1, usuario=$2, correo=$3, contrasena_hash=$4, tipo=$5 WHERE id_usuario=$6 RETURNING *',
      [nombre_completo, usuario, correo, contrasena_hash, tipo, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuario not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM usuario WHERE id_usuario=$1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
