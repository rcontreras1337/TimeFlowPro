-- =============================================
-- MIGRACIÓN 00011: Tabla travel_blocks
-- Ticket: T-1-01
-- Descripción: Bloques de tiempo de traslado entre ubicaciones
-- =============================================

-- =============================================
-- TABLA: travel_blocks
-- =============================================

CREATE TABLE travel_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Profesional
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Cita destino (el traslado es hacia esta cita)
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  
  -- Ubicaciones del traslado
  from_location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
  to_location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
  
  -- Tiempo del traslado
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  travel_time_minutes INTEGER NOT NULL,
  
  -- Origen del cálculo
  source travel_source NOT NULL DEFAULT 'manual',
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT travel_blocks_end_after_start CHECK (end_time > start_time),
  CONSTRAINT travel_blocks_time_positive CHECK (travel_time_minutes > 0)
);

-- =============================================
-- ÍNDICES
-- =============================================

-- Índice principal para calendario
CREATE INDEX idx_travel_blocks_calendar ON travel_blocks(user_id, start_time, end_time);

-- Índice por cita
CREATE INDEX idx_travel_blocks_appointment ON travel_blocks(appointment_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE travel_blocks ENABLE ROW LEVEL SECURITY;

-- Usuario puede gestionar sus bloques de traslado
CREATE POLICY "Users can CRUD own travel blocks" ON travel_blocks
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE travel_blocks IS 'Bloques de tiempo reservados para traslado entre ubicaciones';
COMMENT ON COLUMN travel_blocks.appointment_id IS 'Cita hacia la cual se realiza el traslado';
COMMENT ON COLUMN travel_blocks.source IS 'Origen del cálculo: manual o google_maps';
