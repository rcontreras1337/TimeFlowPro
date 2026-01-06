-- =============================================
-- MIGRACIÓN 00001: Extensiones y ENUMs
-- Ticket: T-1-01
-- Descripción: Extensiones PostgreSQL y tipos enumerados del sistema
-- =============================================

-- =============================================
-- EXTENSIONES
-- =============================================

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crypto functions (para encriptar tokens)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigram para búsqueda fuzzy de texto
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- TIPOS ENUMERADOS (ENUMs)
-- =============================================

-- Rol de usuario en el sistema
CREATE TYPE user_role AS ENUM (
  'professional',   -- Usuario profesional normal
  'superadmin'      -- Administrador del sistema
);

-- Estado de cuenta del profesional (modelo freemium)
CREATE TYPE account_status AS ENUM (
  'trial',              -- En período de prueba
  'active',             -- Cuenta activa (pagada o activada por admin)
  'readonly',           -- Trial expirado, solo lectura
  'suspended',          -- Suspendida por admin
  'pending_activation'  -- Esperando activación manual (trial=0)
);

-- Estado de una cita
CREATE TYPE appointment_status AS ENUM (
  'pending',    -- Pendiente de confirmación
  'confirmed',  -- Confirmada
  'completed',  -- Completada
  'cancelled',  -- Cancelada
  'no_show'     -- Cliente no se presentó
);

-- Origen de una cita
CREATE TYPE appointment_source AS ENUM (
  'manual',           -- Creada por el profesional
  'online_booking',   -- Reservada desde portal público
  'google_calendar'   -- Sincronizada desde Google Calendar
);

-- Origen de un cliente
CREATE TYPE client_source AS ENUM (
  'manual',         -- Creado manualmente por el profesional
  'online_booking', -- Creado desde reserva online
  'import'          -- Importado desde archivo/otra fuente
);

-- Tipo de bloqueo personal
CREATE TYPE block_type AS ENUM (
  'lunch',     -- Hora de almuerzo
  'vacation',  -- Vacaciones
  'personal',  -- Bloqueo personal genérico
  'other'      -- Otro tipo de bloqueo
);

-- Tipo de recurrencia para bloqueos
CREATE TYPE recurrence_type AS ENUM (
  'none',    -- Sin recurrencia (evento único)
  'daily',   -- Todos los días
  'weekly',  -- Cada semana (mismo día)
  'monthly'  -- Cada mes (mismo día del mes)
);

-- Estado de sincronización con Google Calendar
CREATE TYPE sync_status AS ENUM (
  'pending',  -- Pendiente de sincronizar
  'synced',   -- Sincronizado exitosamente
  'error'     -- Error en sincronización
);

-- Origen del cálculo de tiempo de traslado
CREATE TYPE travel_source AS ENUM (
  'manual',      -- Ingresado manualmente por el usuario
  'google_maps'  -- Calculado automáticamente por Google Maps API
);

-- =============================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =============================================

COMMENT ON TYPE user_role IS 'Rol del usuario: professional (usuario normal) o superadmin (administrador)';
COMMENT ON TYPE account_status IS 'Estado de la cuenta del profesional en el modelo freemium';
COMMENT ON TYPE appointment_status IS 'Estados posibles para una cita';
COMMENT ON TYPE appointment_source IS 'Origen de creación de una cita';
COMMENT ON TYPE client_source IS 'Origen del registro de cliente';
COMMENT ON TYPE block_type IS 'Tipos de bloqueos personales en el calendario';
COMMENT ON TYPE recurrence_type IS 'Tipos de recurrencia para bloqueos personales';
COMMENT ON TYPE sync_status IS 'Estado de sincronización con Google Calendar';
COMMENT ON TYPE travel_source IS 'Origen del cálculo de tiempo de traslado';
