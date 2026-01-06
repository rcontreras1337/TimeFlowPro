-- =============================================
-- MIGRACIÓN 00005: Tabla services
-- Ticket: T-1-01
-- Descripción: Servicios que ofrece el profesional
-- =============================================

-- =============================================
-- TABLA: services
-- =============================================

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Profesional dueño del servicio
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Nombre del servicio
  name TEXT NOT NULL,
  
  -- Descripción detallada
  description TEXT,
  
  -- Duración por defecto en minutos
  default_duration_minutes INTEGER NOT NULL DEFAULT 45,
  
  -- Precio del servicio (CLP u otra moneda local)
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  
  -- Color para visualización en calendario (hex)
  color TEXT DEFAULT '#0694A2',
  
  -- Estado activo/inactivo
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Permitir reservas online desde portal público
  allow_online_booking BOOLEAN NOT NULL DEFAULT true,
  
  -- Tiempo buffer después de la cita (minutos)
  buffer_time_minutes INTEGER NOT NULL DEFAULT 0,
  
  -- Orden de visualización en listas
  order_index INTEGER NOT NULL DEFAULT 0,
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Restricciones
  CONSTRAINT services_name_user_unique UNIQUE (user_id, name),
  CONSTRAINT services_duration_positive CHECK (default_duration_minutes > 0),
  CONSTRAINT services_price_non_negative CHECK (price >= 0),
  CONSTRAINT services_buffer_non_negative CHECK (buffer_time_minutes >= 0)
);

-- =============================================
-- ÍNDICES
-- =============================================

CREATE INDEX idx_services_user ON services(user_id);
CREATE INDEX idx_services_active ON services(user_id, is_active);
CREATE INDEX idx_services_bookable ON services(user_id, is_active, allow_online_booking)
  WHERE is_active = true AND allow_online_booking = true;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Usuario puede gestionar sus propios servicios
CREATE POLICY "Users can CRUD own services" ON services
  FOR ALL USING (auth.uid() = user_id);

-- Público puede ver servicios activos con reserva online habilitada
CREATE POLICY "Public can view bookable services" ON services
  FOR SELECT USING (
    is_active = true 
    AND allow_online_booking = true
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = services.user_id
      AND profiles.is_active = true
      AND profiles.account_status IN ('trial', 'active')
    )
  );

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE services IS 'Servicios que ofrece cada profesional';
COMMENT ON COLUMN services.default_duration_minutes IS 'Duración por defecto, puede ajustarse por cita';
COMMENT ON COLUMN services.allow_online_booking IS 'Si está habilitado, aparece en portal público de reservas';
COMMENT ON COLUMN services.buffer_time_minutes IS 'Tiempo de descanso/preparación después de cada cita de este servicio';
