const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar multer para almacenar CVs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/cvs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.params.id;
    const uniqueSuffix = Date.now();
    cb(null, `cv-${userId}-${uniqueSuffix}.pdf`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM detalles_candidato');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let result = await db.query('SELECT * FROM detalles_candidato WHERE id_usuario=$1', [id]);
    
    if (result.rowCount === 0) {
      // Crear registro automáticamente si no existe
      try {
        const insertResult = await db.query(
          'INSERT INTO detalles_candidato (id_usuario) VALUES ($1) RETURNING *',
          [id]
        );
        return res.json(insertResult.rows[0]);
      } catch (insertErr) {
        // Si falla al crear, retornar objeto vacío
        console.log('No se pudo crear registro automáticamente:', insertErr.message);
        return res.json({ id_usuario: parseInt(id), cv_url: null });
      }
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

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

// POST - Subir CV en PDF
router.post('/:id/cv', upload.single('cv'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }
    
    const cvUrl = `/uploads/cvs/${req.file.filename}`;
    
    // Actualizar o crear el registro con la URL del CV
    const result = await db.query(
      `INSERT INTO detalles_candidato (id_usuario, cv_url) 
       VALUES ($1, $2) 
       ON CONFLICT (id_usuario) 
       DO UPDATE SET cv_url = EXCLUDED.cv_url 
       RETURNING *`,
      [id, cvUrl]
    );
    
    res.json({ 
      message: 'CV subido exitosamente',
      cv_url: cvUrl,
      detalles: result.rows[0]
    });
  } catch (err) {
    console.error('Error al subir CV:', err);
    res.status(500).json({ error: 'Error al subir el CV' });
  }
});

// GET - Descargar CV
router.get('/:id/cv', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`[CV Download] Solicitando CV para usuario ID: ${id}`);
    
    // Obtener la URL del CV desde la base de datos
    const result = await db.query(
      'SELECT cv_url FROM detalles_candidato WHERE id_usuario = $1',
      [id]
    );
    
    console.log(`[CV Download] Resultado de query:`, result.rows);
    
    if (result.rowCount === 0) {
      console.log(`[CV Download] No se encontró registro para usuario ${id}`);
      return res.status(404).json({ error: 'Candidato no encontrado' });
    }
    
    if (!result.rows[0].cv_url) {
      console.log(`[CV Download] Usuario ${id} no tiene CV subido`);
      return res.status(404).json({ error: 'Este candidato no ha subido su CV' });
    }
    
    const cvUrl = result.rows[0].cv_url;
    const filePath = path.join(__dirname, '../../', cvUrl);
    
    console.log(`[CV Download] Ruta del archivo: ${filePath}`);
    
    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      console.log(`[CV Download] Archivo no existe en el sistema: ${filePath}`);
      return res.status(404).json({ error: 'Archivo no encontrado en el servidor' });
    }
    
    console.log(`[CV Download] Enviando archivo...`);
    
    // Enviar el archivo
    res.download(filePath, `CV-Candidato-${id}.pdf`, (err) => {
      if (err) {
        console.error('[CV Download] Error al descargar archivo:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error al descargar el archivo' });
        }
      } else {
        console.log(`[CV Download] Archivo enviado exitosamente`);
      }
    });
  } catch (err) {
    console.error('[CV Download] Error en catch:', err);
    res.status(500).json({ error: 'Error al obtener el CV', details: err.message });
  }
});

// DELETE - Eliminar CV
router.delete('/:id/cv', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener la URL del CV
    const result = await db.query(
      'SELECT cv_url FROM detalles_candidato WHERE id_usuario = $1',
      [id]
    );
    
    if (result.rowCount === 0 || !result.rows[0].cv_url) {
      return res.status(404).json({ error: 'CV no encontrado' });
    }
    
    const cvUrl = result.rows[0].cv_url;
    const filePath = path.join(__dirname, '../../', cvUrl);
    
    // Eliminar archivo físico
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Actualizar base de datos
    await db.query(
      'UPDATE detalles_candidato SET cv_url = NULL WHERE id_usuario = $1',
      [id]
    );
    
    res.json({ message: 'CV eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar CV:', err);
    res.status(500).json({ error: 'Error al eliminar el CV' });
  }
});

module.exports = router;
