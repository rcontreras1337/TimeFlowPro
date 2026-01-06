-- =============================================
-- MIGRACIÓN 00002: Tabla system_config
-- Ticket: T-1-01
-- Descripción: Configuración global del sistema (gestionada por superadmin)
-- Nota: Se crea primero porque el trigger de profiles la necesita
-- =============================================

-- =============================================
-- TABLA: system_config
-- =============================================

CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Clave única de configuración
  key VARCHAR(100) UNIQUE NOT NULL,
  
  -- Valor de configuración (JSON flexible)
  value JSONB NOT NULL,
  
  -- Descripción de la configuración
  description TEXT,
  
  -- Quién actualizó por última vez
  updated_by UUID,
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ÍNDICES
-- =============================================

CREATE INDEX idx_system_config_key ON system_config(key);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Todos pueden leer la configuración
CREATE POLICY "Anyone can read system config" ON system_config
  FOR SELECT USING (true);

-- Nota: La política de superadmin para INSERT/UPDATE/DELETE se agrega en
-- 00015_create_functions_and_triggers.sql después de que exista 'profiles'

-- =============================================
-- DATOS INICIALES
-- =============================================

INSERT INTO system_config (key, value, description) VALUES 
  (
    'trial_settings',
    '{
      "default_trial_days": 14,
      "warning_days_before": 3,
      "extend_max_days": 30
    }'::jsonb,
    'Configuración del período de prueba para nuevos usuarios'
  ),
  (
    'admin_settings',
    '{
      "notify_email": "admin@timeflowpro.com",
      "notify_on_signup": true,
      "notify_on_trial_expire": true
    }'::jsonb,
    'Configuración de notificaciones para administradores'
  );

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE system_config IS 'Configuración global del sistema TimeFlowPro';
COMMENT ON COLUMN system_config.key IS 'Clave única de configuración';
COMMENT ON COLUMN system_config.value IS 'Valor de configuración en formato JSON';
COMMENT ON COLUMN system_config.updated_by IS 'UUID del superadmin que actualizó';
