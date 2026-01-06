-- =============================================
-- MIGRACIÓN 00010: Tabla location_travel_times
-- Ticket: T-1-01
-- Descripción: Tiempos de traslado entre ubicaciones
-- =============================================

-- =============================================
-- TABLA: location_travel_times
-- =============================================

CREATE TABLE location_travel_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Profesional dueño
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Ubicación origen
  from_location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  
  -- Ubicación destino
  to_location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  
  -- Tiempo de traslado en minutos
  travel_time_minutes INTEGER NOT NULL,
  
  -- Auditoría
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT travel_times_pair_unique UNIQUE (from_location_id, to_location_id),
  CONSTRAINT travel_times_different_locations CHECK (from_location_id != to_location_id),
  CONSTRAINT travel_times_positive CHECK (travel_time_minutes > 0)
);

-- =============================================
-- ÍNDICES
-- =============================================

CREATE INDEX idx_travel_times_user ON location_travel_times(user_id);
CREATE INDEX idx_travel_times_from ON location_travel_times(from_location_id);
CREATE INDEX idx_travel_times_to ON location_travel_times(to_location_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE location_travel_times ENABLE ROW LEVEL SECURITY;

-- Usuario puede gestionar sus tiempos de traslado
CREATE POLICY "Users can CRUD own travel times" ON location_travel_times
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE location_travel_times IS 'Matriz de tiempos de traslado entre ubicaciones (configuración manual)';
COMMENT ON COLUMN location_travel_times.travel_time_minutes IS 'Tiempo estimado de traslado en minutos';
