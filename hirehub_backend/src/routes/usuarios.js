const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const { check } = require('express-validator');
const runValidation = require('../middlewares/validate');

const saltRounds = 10;

router.get('/count/candidatos', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT COUNT(*)::int AS count
       FROM usuario
       WHERE tipo = 'CANDIDATO'`
    );
    res.json({ tipo: 'CANDIDATO', count: result.rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/count/empresas', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT COUNT(*)::int AS count
       FROM usuario
       WHERE tipo = 'EMPRESA'`
    );
    res.json({ tipo: 'EMPRESA', count: result.rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM usuario ORDER BY id_usuario');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM usuario WHERE id_usuario = $1', [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Usuario not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/',
  [
    check('nombre_completo').trim().notEmpty().withMessage('nombre es obligatorio'),
    check('correo').isEmail().withMessage('email inválido'),
    check('contrasena_hash').isLength({ min: 6 }).withMessage('password mínimo 6 caracteres'),
  ],
  runValidation,
  async (req, res) => {
    try {
      const { nombre_completo, usuario, correo, contrasena_hash, tipo } = req.body;
      const hashedPassword = await bcrypt.hash(contrasena_hash, saltRounds);
      const result = await db.query(
        `INSERT INTO usuario (nombre_completo, usuario, correo, contrasena_hash, tipo)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [nombre_completo, usuario, correo, hashedPassword, tipo]
      );
      const newUser = result.rows[0];
      delete newUser.contrasena_hash;
      res.status(201).json(newUser);
    } catch (err) {
      console.error(err);
      if (err.code === '23505') {
        return res.status(409).json({ message: 'El usuario o correo ya existe.' });
      }
      res.status(500).json({ error: err.message });
    }
  }
);

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let { nombre_completo, usuario, correo, contrasena_hash, tipo } = req.body;
    if (contrasena_hash) {
      contrasena_hash = await bcrypt.hash(contrasena_hash, saltRounds);
    }
    const result = await db.query(
      `UPDATE usuario
       SET nombre_completo=$1,
           usuario=$2,
           correo=$3,
           contrasena_hash=COALESCE($4, contrasena_hash),
           tipo=$5
       WHERE id_usuario=$6
       RETURNING *`,
      [nombre_completo, usuario, correo, contrasena_hash, tipo, id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: 'Usuario not found' });
    const updatedUser = result.rows[0];
    delete updatedUser.contrasena_hash;
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

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
