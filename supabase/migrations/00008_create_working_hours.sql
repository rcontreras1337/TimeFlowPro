-- =============================================
-- MIGRACIÓN 00008: Tabla working_hours
-- Ticket: T-1-01
-- Descripción: Horarios de trabajo por ubicación
-- =============================================

-- =============================================
-- TABLA: working_hours
-- =============================================

CREATE TABLE working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Profesional dueño
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Ubicación a la que aplica este horario
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  
  -- Día de la semana (0=Domingo, 1=Lunes, ... 6=Sábado)
  day_of_week SMALLINT NOT NULL,
  
  -- Horario de trabajo
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Estado activo
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT working_hours_day_valid CHECK (day_of_week >= 0 AND day_of_week <= 6),
  CONSTRAINT working_hours_time_valid CHECK (end_time > start_time)
);

-- =============================================
-- ÍNDICES
-- =============================================

-- Índice principal para consultas de disponibilidad
CREATE INDEX idx_working_hours_lookup ON working_hours(user_id, location_id, day_of_week, is_active);

-- Índice por ubicación
CREATE INDEX idx_working_hours_location ON working_hours(location_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;

-- Usuario puede gestionar sus horarios
CREATE POLICY "Users can CRUD own working hours" ON working_hours
  FOR ALL USING (auth.uid() = user_id);

-- Público puede ver horarios activos para disponibilidad
CREATE POLICY "Public can view active working hours" ON working_hours
  FOR SELECT USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = working_hours.user_id
      AND profiles.is_active = true
      AND profiles.account_status IN ('trial', 'active')
    )
  );

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE working_hours IS 'Horarios de trabajo del profesional por ubicación';
COMMENT ON COLUMN working_hours.day_of_week IS '0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado';
COMMENT ON COLUMN working_hours.start_time IS 'Hora de inicio del bloque de trabajo';
COMMENT ON COLUMN working_hours.end_time IS 'Hora de fin del bloque de trabajo';
