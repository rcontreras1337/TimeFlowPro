-- =============================================
-- MIGRACIÓN 00004: Tabla locations
-- Ticket: T-1-01
-- Descripción: Ubicaciones donde el profesional ofrece servicios
-- =============================================

-- =============================================
-- TABLA: locations
-- =============================================

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Profesional dueño de la ubicación
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Nombre de la ubicación (ej: "Iron Gym", "Consultorio Centro")
  name TEXT NOT NULL,
  
  -- Dirección completa
  address TEXT,
  
  -- Coordenadas geográficas
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Color para visualización en calendario (hex)
  color TEXT DEFAULT '#3F83F8',
  
  -- Estado activo/inactivo
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Orden de visualización en listas
  order_index INTEGER NOT NULL DEFAULT 0,
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Restricción: nombre único por usuario
  CONSTRAINT locations_name_user_unique UNIQUE (user_id, name)
);

-- =============================================
-- ÍNDICES
-- =============================================

CREATE INDEX idx_locations_user ON locations(user_id);
CREATE INDEX idx_locations_active ON locations(user_id, is_active);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Usuario puede gestionar sus propias ubicaciones
CREATE POLICY "Users can CRUD own locations" ON locations
  FOR ALL USING (auth.uid() = user_id);

-- Público puede ver ubicaciones activas para portal de reservas
CREATE POLICY "Public can view active locations" ON locations
  FOR SELECT USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = locations.user_id
      AND profiles.is_active = true
      AND profiles.account_status IN ('trial', 'active')
    )
  );

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE locations IS 'Ubicaciones donde el profesional ofrece sus servicios';
COMMENT ON COLUMN locations.name IS 'Nombre descriptivo de la ubicación';
COMMENT ON COLUMN locations.color IS 'Color hexadecimal para visualización en calendario';
COMMENT ON COLUMN locations.order_index IS 'Orden de visualización en listas y selectores';
