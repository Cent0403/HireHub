-- Agregar columna para almacenar la ruta del CV en PDF
ALTER TABLE detalles_candidato 
ADD COLUMN IF NOT EXISTS cv_url VARCHAR(500);

COMMENT ON COLUMN detalles_candidato.cv_url IS 'Ruta del archivo PDF del curriculum vitae del candidato';
