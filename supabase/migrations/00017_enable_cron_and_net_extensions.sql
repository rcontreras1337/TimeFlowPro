-- =============================================
-- MIGRACIÓN 00017: Extensiones pg_cron y pg_net
-- Ticket: T-1-06
-- Descripción: Habilitar extensiones para cron jobs y HTTP requests
-- NOTA: Estas extensiones solo funcionan en Supabase Cloud, no en local
-- =============================================

-- =============================================
-- EXTENSIÓN: pg_cron
-- Permite programar jobs con sintaxis cron
-- =============================================

-- pg_cron requiere schema pg_catalog
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- =============================================
-- EXTENSIÓN: pg_net
-- Permite hacer HTTP requests desde SQL/triggers
-- =============================================

CREATE EXTENSION IF NOT EXISTS pg_net;

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON EXTENSION pg_cron IS 'Extensión para programar jobs con sintaxis cron (solo Supabase Cloud)';
COMMENT ON EXTENSION pg_net IS 'Extensión para hacer HTTP requests desde SQL (solo Supabase Cloud)';
