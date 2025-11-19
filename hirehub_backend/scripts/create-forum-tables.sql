-- Tabla de publicaciones del foro
CREATE TABLE IF NOT EXISTS foro_publicaciones (
    id_publicacion SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('VIRTUAL', 'PRESENCIAL', 'HIBRIDO', 'GENERAL', 'CONSEJOS', 'NETWORKING')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editado BOOLEAN DEFAULT FALSE,
    fecha_edicion TIMESTAMP
);

-- Tabla de comentarios del foro
CREATE TABLE IF NOT EXISTS foro_comentarios (
    id_comentario SERIAL PRIMARY KEY,
    id_publicacion INTEGER NOT NULL REFERENCES foro_publicaciones(id_publicacion) ON DELETE CASCADE,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    editado BOOLEAN DEFAULT FALSE,
    fecha_edicion TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_foro_publicaciones_usuario ON foro_publicaciones(id_usuario);
CREATE INDEX IF NOT EXISTS idx_foro_publicaciones_categoria ON foro_publicaciones(categoria);
CREATE INDEX IF NOT EXISTS idx_foro_publicaciones_fecha ON foro_publicaciones(fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_foro_comentarios_publicacion ON foro_comentarios(id_publicacion);
CREATE INDEX IF NOT EXISTS idx_foro_comentarios_usuario ON foro_comentarios(id_usuario);

-- Comentarios en las tablas
COMMENT ON TABLE foro_publicaciones IS 'Almacena las publicaciones del foro creadas por candidatos y empresas';
COMMENT ON TABLE foro_comentarios IS 'Almacena los comentarios en las publicaciones del foro';
COMMENT ON COLUMN foro_publicaciones.categoria IS 'Categoría de la publicación: VIRTUAL, PRESENCIAL, HIBRIDO, GENERAL, CONSEJOS, NETWORKING';
