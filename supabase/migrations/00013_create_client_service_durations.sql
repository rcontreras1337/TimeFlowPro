-- =============================================
-- MIGRACIÓN 00013: Tabla client_service_durations
-- Ticket: T-1-01
-- Descripción: Historial de duraciones por cliente-servicio para sugerencia adaptativa
-- =============================================

-- =============================================
-- TABLA: client_service_durations
-- =============================================

CREATE TABLE client_service_durations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Cliente
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Servicio
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  
  -- Estadísticas de duración
  average_duration_minutes INTEGER NOT NULL,
  min_duration_minutes INTEGER NOT NULL,
  max_duration_minutes INTEGER NOT NULL,
  
  -- Contador de citas
  total_appointments INTEGER NOT NULL DEFAULT 0,
  
  -- Última cita completada
  last_appointment_at TIMESTAMPTZ,
  
  -- Auditoría
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Restricción: par único cliente-servicio
  CONSTRAINT client_service_durations_unique UNIQUE (client_id, service_id)
);

-- =============================================
-- ÍNDICES
-- =============================================

CREATE INDEX idx_csd_client ON client_service_durations(client_id);
CREATE INDEX idx_csd_service ON client_service_durations(service_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE client_service_durations ENABLE ROW LEVEL SECURITY;

-- Usuario puede ver/gestionar duraciones de sus clientes
CREATE POLICY "Users can view own client durations" ON client_service_durations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = client_service_durations.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE client_service_durations IS 'Historial de duraciones por cliente-servicio para sugerencia adaptativa de duración';
COMMENT ON COLUMN client_service_durations.average_duration_minutes IS 'Duración promedio calculada de las citas completadas';
COMMENT ON COLUMN client_service_durations.total_appointments IS 'Número total de citas completadas para este cliente-servicio';
