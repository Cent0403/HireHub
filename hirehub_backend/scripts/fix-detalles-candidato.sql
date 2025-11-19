-- Hacer que la columna nacionalidad sea nullable
ALTER TABLE detalles_candidato 
ALTER COLUMN nacionalidad DROP NOT NULL;
