-- =============================================
-- MIGRACIÓN 00012: Tabla personal_blocks
-- Ticket: T-1-01
-- Descripción: Bloqueos personales del profesional (almuerzo, vacaciones, etc.)
-- =============================================

-- =============================================
-- TABLA: personal_blocks
-- =============================================

CREATE TABLE personal_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Profesional dueño
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Título del bloqueo
  title VARCHAR(100) NOT NULL,
  
  -- Tipo de bloqueo
  block_type block_type NOT NULL DEFAULT 'personal',
  
  -- Tiempo del bloqueo
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  
  -- Bloqueo de día completo
  all_day BOOLEAN NOT NULL DEFAULT false,
  
  -- Configuración de recurrencia
  recurrence_type recurrence_type NOT NULL DEFAULT 'none',
  recurrence_end_date DATE,
  
  -- Notas adicionales
  notes TEXT,
  
  -- Estado activo
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT personal_blocks_end_after_start CHECK (end_time > start_time)
);

-- =============================================
-- ÍNDICES
-- =============================================

-- Índice para consultas de calendario
CREATE INDEX idx_personal_blocks_calendar ON personal_blocks(user_id, start_time, end_time)
  WHERE is_active = true;

-- Índice para bloqueos recurrentes
CREATE INDEX idx_personal_blocks_recurrence ON personal_blocks(user_id, recurrence_type)
  WHERE recurrence_type != 'none' AND is_active = true;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE personal_blocks ENABLE ROW LEVEL SECURITY;

-- Usuario puede gestionar sus bloqueos
CREATE POLICY "Users can CRUD own personal blocks" ON personal_blocks
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE personal_blocks IS 'Bloqueos personales del profesional (almuerzo, vacaciones, etc.)';
COMMENT ON COLUMN personal_blocks.block_type IS 'Tipo: lunch, vacation, personal, other';
COMMENT ON COLUMN personal_blocks.recurrence_type IS 'Tipo de recurrencia: none, daily, weekly, monthly';
COMMENT ON COLUMN personal_blocks.recurrence_end_date IS 'Fecha hasta la cual se repite el bloqueo';
