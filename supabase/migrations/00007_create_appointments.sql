-- =============================================
-- MIGRACIÓN 00007: Tabla appointments
-- Ticket: T-1-01
-- Descripción: Citas agendadas (tabla core del sistema)
-- =============================================

-- =============================================
-- TABLA: appointments
-- =============================================

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relaciones principales
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
  
  -- Tiempo de la cita
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Precio histórico (al momento de reservar)
  price_at_booking DECIMAL(10, 2),
  
  -- Estado de la cita
  status appointment_status NOT NULL DEFAULT 'confirmed',
  
  -- Origen de la cita
  source appointment_source NOT NULL DEFAULT 'manual',
  
  -- Notas de la cita
  notes TEXT,
  
  -- Información de cancelación
  cancellation_reason TEXT,
  cancelled_by TEXT,  -- 'client' o 'professional'
  
  -- Reagendamiento
  rescheduled_from UUID REFERENCES appointments(id),
  rescheduled_at TIMESTAMPTZ,
  
  -- Términos y condiciones
  terms_accepted_at TIMESTAMPTZ,
  
  -- Integración con Google Calendar
  google_event_id TEXT,
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  
  -- Constraints de validación
  CONSTRAINT appointments_end_after_start CHECK (end_time > start_time),
  CONSTRAINT appointments_duration_positive CHECK (duration_minutes > 0),
  CONSTRAINT appointments_price_non_negative CHECK (price_at_booking IS NULL OR price_at_booking >= 0),
  CONSTRAINT appointments_cancelled_by_valid CHECK (
    cancelled_by IS NULL OR cancelled_by IN ('client', 'professional')
  )
);

-- =============================================
-- ÍNDICES CRÍTICOS PARA PERFORMANCE
-- =============================================

-- Índice principal para consultas de calendario
CREATE INDEX idx_appointments_user ON appointments(user_id);

-- Índice para vista de calendario (rango de fechas)
CREATE INDEX idx_appointments_user_date ON appointments(user_id, start_time)
  WHERE deleted_at IS NULL;

-- Índice para rango de fechas en calendario
CREATE INDEX idx_appointments_range ON appointments(user_id, start_time, end_time)
  WHERE deleted_at IS NULL;

-- Índice por cliente (historial)
CREATE INDEX idx_appointments_client ON appointments(client_id)
  WHERE deleted_at IS NULL;

-- Índice por ubicación
CREATE INDEX idx_appointments_location ON appointments(location_id)
  WHERE deleted_at IS NULL;

-- Índice por estado
CREATE INDEX idx_appointments_status ON appointments(user_id, status)
  WHERE deleted_at IS NULL;

-- Índice para sincronización con Google Calendar
CREATE INDEX idx_appointments_google ON appointments(google_event_id)
  WHERE google_event_id IS NOT NULL;

-- Índice para citas reagendadas
CREATE INDEX idx_appointments_rescheduled ON appointments(rescheduled_from)
  WHERE rescheduled_from IS NOT NULL;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Profesional puede gestionar sus citas
CREATE POLICY "Users can CRUD own appointments" ON appointments
  FOR ALL USING (auth.uid() = user_id);

-- Clientes pueden ver sus propias citas (si están autenticados con el mismo email)
CREATE POLICY "Clients can view own appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = appointments.client_id
      AND clients.email = (
        SELECT email FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE appointments IS 'Citas agendadas - tabla core del sistema TimeFlowPro';
COMMENT ON COLUMN appointments.price_at_booking IS 'Precio del servicio al momento de reservar (histórico)';
COMMENT ON COLUMN appointments.cancelled_by IS 'Quién canceló: client o professional';
COMMENT ON COLUMN appointments.rescheduled_from IS 'Si fue reagendada, referencia a la cita original';
COMMENT ON COLUMN appointments.google_event_id IS 'ID del evento en Google Calendar para sincronización';
