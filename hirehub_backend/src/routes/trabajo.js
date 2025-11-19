const express = require('express');
const router = express.Router();
const db = require('../db');
const { check } = require('express-validator');
const runValidation = require('../middlewares/validate');

router.get('/', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM trabajo');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM trabajo WHERE id_trabajo=$1', [req.params.id]);
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
    check('titulo').trim().notEmpty().withMessage('titulo es obligatorio'),
    check('descripcion').trim().notEmpty().withMessage('descripcion es obligatoria'),
    check('salario').optional().isNumeric().withMessage('salario debe ser numérico'),
  ],
  runValidation,
  async (req, res) => {
    try {
      const { id_empresa, titulo, tags, salario_minimo, salario_maximo, experiencia_requerida, tipo_trabajo, ubicacion, descripcion } = req.body;
      const r = await db.query('INSERT INTO trabajo (id_empresa,titulo,tags,salario_minimo,salario_maximo,experiencia_requerida,tipo_trabajo,ubicacion,descripcion) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *', [id_empresa, titulo, tags ? JSON.stringify(tags) : null, salario_minimo, salario_maximo, experiencia_requerida, tipo_trabajo, ubicacion, descripcion]);
      res.status(201).json(r.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

router.put('/:id', async (req, res) => {
  try {
    const { titulo, tags, salario_minimo, salario_maximo, experiencia_requerida, tipo_trabajo, ubicacion, descripcion, estado } = req.body;
    const r = await db.query('UPDATE trabajo SET titulo=$1,tags=$2,salario_minimo=$3,salario_maximo=$4,experiencia_requerida=$5,tipo_trabajo=$6,ubicacion=$7,descripcion=$8,estado=$9 WHERE id_trabajo=$10 RETURNING *', [titulo, tags ? JSON.stringify(tags) : null, salario_minimo, salario_maximo, experiencia_requerida, tipo_trabajo, ubicacion, descripcion, estado, req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM trabajo WHERE id_trabajo=$1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/empresa/:idEmpresa', async (req, res) => {
    try {
        const { idEmpresa } = req.params;
        const r = await db.query(
            'SELECT id_trabajo, titulo, tipo_trabajo, ubicacion, estado, fecha_publicacion, salario_minimo, salario_maximo FROM trabajo WHERE id_empresa = $1 ORDER BY fecha_publicacion DESC',
            [idEmpresa]
        );
        res.json(r.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/empresa/count/:idEmpresa', async (req, res) => {
    try {
        const { idEmpresa } = req.params;
        const r = await db.query(
            `SELECT 
                COUNT(*)::int AS total,
                SUM(CASE WHEN estado = 'ACTIVO' THEN 1 ELSE 0 END)::int AS activo,
                SUM(CASE WHEN estado = 'DESACTIVADO' THEN 1 ELSE 0 END)::int AS desactivado
            FROM trabajo
            WHERE id_empresa = $1`,
            [idEmpresa]
        );
        res.json(r.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
