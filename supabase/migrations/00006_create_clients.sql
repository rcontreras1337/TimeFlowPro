-- =============================================
-- MIGRACIÓN 00006: Tabla clients
-- Ticket: T-1-01
-- Descripción: Clientes del profesional con soft delete
-- =============================================

-- =============================================
-- TABLA: clients
-- =============================================

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Profesional dueño del cliente
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Datos del cliente
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  
  -- Fecha de nacimiento (opcional)
  birthdate DATE,
  
  -- Notas internas del profesional sobre el cliente
  notes TEXT,
  
  -- Origen del cliente
  source client_source NOT NULL DEFAULT 'manual',
  
  -- Campos personalizados (flexibles por profesional)
  custom_fields JSONB DEFAULT '{}'::jsonb,
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  
  -- Restricción: email único por usuario (cuando no está eliminado)
  CONSTRAINT clients_email_user_unique UNIQUE (user_id, email)
);

-- =============================================
-- ÍNDICES
-- =============================================

-- Índice principal por usuario (excluyendo eliminados)
CREATE INDEX idx_clients_user ON clients(user_id)
  WHERE deleted_at IS NULL;

-- Índice para búsqueda por email
CREATE INDEX idx_clients_email ON clients(user_id, email)
  WHERE deleted_at IS NULL;

-- Índice para búsqueda por teléfono
CREATE INDEX idx_clients_phone ON clients(user_id, phone)
  WHERE deleted_at IS NULL;

-- Índice para soft delete
CREATE INDEX idx_clients_deleted ON clients(user_id, deleted_at)
  WHERE deleted_at IS NULL;

-- Índice GIN para búsqueda de texto (trigram)
CREATE INDEX idx_clients_search ON clients
  USING gin(to_tsvector('spanish', name || ' ' || COALESCE(email, '') || ' ' || COALESCE(phone, '')));

-- Índice trigram para búsqueda fuzzy por nombre
CREATE INDEX idx_clients_name_trgm ON clients
  USING gin(name gin_trgm_ops)
  WHERE deleted_at IS NULL;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Usuario puede gestionar sus propios clientes
CREATE POLICY "Users can CRUD own clients" ON clients
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE clients IS 'Clientes de cada profesional con soporte para soft delete';
COMMENT ON COLUMN clients.source IS 'Origen del registro: manual, online_booking o import';
COMMENT ON COLUMN clients.custom_fields IS 'Campos personalizados definidos por el profesional en formato JSON';
COMMENT ON COLUMN clients.deleted_at IS 'Timestamp de eliminación lógica (soft delete)';
