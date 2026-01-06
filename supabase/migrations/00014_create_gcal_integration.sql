-- =============================================
-- MIGRACIÓN 00014: Tablas de integración con Google Calendar
-- Ticket: T-1-01
-- Descripción: Tokens OAuth y tracking de eventos sincronizados
-- =============================================

-- =============================================
-- TABLA: google_calendar_tokens
-- =============================================

CREATE TABLE google_calendar_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Usuario (relación 1:1)
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Tokens OAuth (encriptados)
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  
  -- Expiración del token
  token_expires_at TIMESTAMPTZ NOT NULL,
  
  -- Configuración del calendario
  calendar_id VARCHAR(255) NOT NULL DEFAULT 'primary',
  
  -- Token de sincronización incremental
  sync_token TEXT,
  
  -- Estado de sincronización
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Última sincronización exitosa
  last_sync_at TIMESTAMPTZ,
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLA: google_calendar_events
-- =============================================

CREATE TABLE google_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Usuario
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Cita vinculada (relación 1:1)
  appointment_id UUID UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  
  -- ID del evento en Google Calendar
  google_event_id VARCHAR(255) UNIQUE NOT NULL,
  
  -- ID del calendario
  calendar_id VARCHAR(255) NOT NULL,
  
  -- Estado de sincronización
  sync_status sync_status NOT NULL DEFAULT 'pending',
  
  -- Último error
  last_error TEXT,
  
  -- Última sincronización exitosa
  synced_at TIMESTAMPTZ,
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ÍNDICES
-- =============================================

-- google_calendar_tokens
CREATE INDEX idx_gcal_tokens_user ON google_calendar_tokens(user_id);
CREATE INDEX idx_gcal_tokens_active ON google_calendar_tokens(is_active)
  WHERE is_active = true;

-- google_calendar_events
CREATE INDEX idx_gcal_events_user ON google_calendar_events(user_id);
CREATE INDEX idx_gcal_events_appointment ON google_calendar_events(appointment_id);
CREATE INDEX idx_gcal_events_status ON google_calendar_events(user_id, sync_status);
CREATE INDEX idx_gcal_events_google_id ON google_calendar_events(google_event_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE google_calendar_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_calendar_events ENABLE ROW LEVEL SECURITY;

-- Usuario puede gestionar su token
CREATE POLICY "Users can CRUD own google calendar tokens" ON google_calendar_tokens
  FOR ALL USING (auth.uid() = user_id);

-- Usuario puede ver sus eventos sincronizados
CREATE POLICY "Users can CRUD own google calendar events" ON google_calendar_events
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE google_calendar_tokens IS 'Tokens OAuth para sincronización con Google Calendar';
COMMENT ON COLUMN google_calendar_tokens.access_token IS 'Token de acceso OAuth (debe encriptarse en producción)';
COMMENT ON COLUMN google_calendar_tokens.refresh_token IS 'Token de refresh OAuth (debe encriptarse en producción)';
COMMENT ON COLUMN google_calendar_tokens.sync_token IS 'Token para sincronización incremental de cambios';

COMMENT ON TABLE google_calendar_events IS 'Tracking de eventos sincronizados con Google Calendar';
COMMENT ON COLUMN google_calendar_events.sync_status IS 'Estado: pending, synced, error';
COMMENT ON COLUMN google_calendar_events.last_error IS 'Mensaje del último error de sincronización';
