-- =============================================
-- MIGRACIÓN 00009: Tabla location_services
-- Ticket: T-1-01
-- Descripción: Relación N:M entre ubicaciones y servicios
-- =============================================

-- =============================================
-- TABLA: location_services
-- =============================================

CREATE TABLE location_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ubicación
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  
  -- Servicio
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  
  -- Estado de disponibilidad
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Restricción: par único ubicación-servicio
  CONSTRAINT location_services_unique UNIQUE (location_id, service_id)
);

-- =============================================
-- ÍNDICES
-- =============================================

CREATE INDEX idx_location_services_location ON location_services(location_id);
CREATE INDEX idx_location_services_service ON location_services(service_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE location_services ENABLE ROW LEVEL SECURITY;

-- Usuario puede gestionar relaciones de sus ubicaciones/servicios
CREATE POLICY "Users can CRUD own location services" ON location_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM locations
      WHERE locations.id = location_services.location_id
      AND locations.user_id = auth.uid()
    )
  );

-- Público puede ver relaciones activas
CREATE POLICY "Public can view active location services" ON location_services
  FOR SELECT USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM locations
      JOIN profiles ON profiles.id = locations.user_id
      WHERE locations.id = location_services.location_id
      AND locations.is_active = true
      AND profiles.is_active = true
      AND profiles.account_status IN ('trial', 'active')
    )
  );

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE location_services IS 'Relación N:M que define qué servicios están disponibles en cada ubicación';
COMMENT ON COLUMN location_services.is_active IS 'Si el servicio está actualmente disponible en esta ubicación';
