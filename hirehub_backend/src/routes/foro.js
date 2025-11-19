const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET - Obtener todas las publicaciones con información del autor
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    
    let query = `
      SELECT 
        p.*,
        u.nombre_completo,
        u.usuario,
        u.correo,
        u.tipo as tipo_usuario,
        (SELECT COUNT(*) FROM foro_comentarios WHERE id_publicacion = p.id_publicacion) as total_comentarios
      FROM foro_publicaciones p
      JOIN usuario u ON p.id_usuario = u.id_usuario
    `;
    
    const params = [];
    
    if (categoria && categoria !== 'TODOS') {
      query += ' WHERE p.categoria = $1';
      params.push(categoria);
    }
    
    query += ' ORDER BY p.fecha_creacion DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener publicaciones:', err);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
});

// GET - Obtener una publicación específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        p.*,
        u.nombre_completo,
        u.usuario,
        u.correo,
        u.tipo as tipo_usuario
      FROM foro_publicaciones p
      JOIN usuario u ON p.id_usuario = u.id_usuario
      WHERE p.id_publicacion = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener publicación:', err);
    res.status(500).json({ error: 'Error al obtener publicación' });
  }
});

// POST - Crear una nueva publicación
router.post('/', async (req, res) => {
  try {
    const { id_usuario, titulo, contenido, categoria } = req.body;
    
    if (!id_usuario || !titulo || !contenido || !categoria) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    const validCategories = ['VIRTUAL', 'PRESENCIAL', 'HIBRIDO', 'GENERAL', 'CONSEJOS', 'NETWORKING'];
    if (!validCategories.includes(categoria)) {
      return res.status(400).json({ error: 'Categoría inválida' });
    }
    
    const result = await pool.query(
      `INSERT INTO foro_publicaciones (id_usuario, titulo, contenido, categoria)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_usuario, titulo, contenido, categoria]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear publicación:', err);
    res.status(500).json({ error: 'Error al crear publicación' });
  }
});

// PUT - Editar una publicación
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, titulo, contenido, categoria } = req.body;
    
    // Verificar que el usuario es el dueño de la publicación
    const checkOwner = await pool.query(
      'SELECT id_usuario FROM foro_publicaciones WHERE id_publicacion = $1',
      [id]
    );
    
    if (checkOwner.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }
    
    if (checkOwner.rows[0].id_usuario !== id_usuario) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta publicación' });
    }
    
    const result = await pool.query(
      `UPDATE foro_publicaciones 
       SET titulo = $1, contenido = $2, categoria = $3, editado = TRUE, fecha_edicion = CURRENT_TIMESTAMP
       WHERE id_publicacion = $4
       RETURNING *`,
      [titulo, contenido, categoria, id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al editar publicación:', err);
    res.status(500).json({ error: 'Error al editar publicación' });
  }
});

// DELETE - Eliminar una publicación
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.body;
    
    // Verificar que el usuario es el dueño de la publicación
    const checkOwner = await pool.query(
      'SELECT id_usuario FROM foro_publicaciones WHERE id_publicacion = $1',
      [id]
    );
    
    if (checkOwner.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }
    
    if (checkOwner.rows[0].id_usuario !== id_usuario) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta publicación' });
    }
    
    await pool.query('DELETE FROM foro_publicaciones WHERE id_publicacion = $1', [id]);
    
    res.json({ message: 'Publicación eliminada exitosamente' });
  } catch (err) {
    console.error('Error al eliminar publicación:', err);
    res.status(500).json({ error: 'Error al eliminar publicación' });
  }
});

// GET - Obtener comentarios de una publicación
router.get('/:id/comentarios', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        c.*,
        u.nombre_completo,
        u.usuario,
        u.correo,
        u.tipo as tipo_usuario
      FROM foro_comentarios c
      JOIN usuario u ON c.id_usuario = u.id_usuario
      WHERE c.id_publicacion = $1
      ORDER BY c.fecha_creacion ASC
    `, [id]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener comentarios:', err);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// POST - Crear un comentario
router.post('/:id/comentarios', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, contenido } = req.body;
    
    if (!id_usuario || !contenido) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    // Verificar que la publicación existe
    const checkPost = await pool.query(
      'SELECT id_publicacion FROM foro_publicaciones WHERE id_publicacion = $1',
      [id]
    );
    
    if (checkPost.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }
    
    const result = await pool.query(
      `INSERT INTO foro_comentarios (id_publicacion, id_usuario, contenido)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, id_usuario, contenido]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear comentario:', err);
    res.status(500).json({ error: 'Error al crear comentario' });
  }
});

// DELETE - Eliminar un comentario
router.delete('/:id/comentarios/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { id_usuario } = req.body;
    
    // Verificar que el usuario es el dueño del comentario
    const checkOwner = await pool.query(
      'SELECT id_usuario FROM foro_comentarios WHERE id_comentario = $1',
      [commentId]
    );
    
    if (checkOwner.rows.length === 0) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    
    if (checkOwner.rows[0].id_usuario !== id_usuario) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
    }
    
    await pool.query('DELETE FROM foro_comentarios WHERE id_comentario = $1', [commentId]);
    
    res.json({ message: 'Comentario eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar comentario:', err);
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
});

module.exports = router;
