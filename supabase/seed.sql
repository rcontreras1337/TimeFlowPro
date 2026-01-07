-- =============================================
-- TimeFlowPro - Seed Data for Local Development
-- =============================================
-- This file contains initial seed data for local development and testing.
-- It will be executed when running `supabase db reset`.
--
-- Ticket: T-1-06 - Sistema de Trial Automático
-- =============================================

-- =============================================
-- CONFIGURACIÓN ADICIONAL DEL SISTEMA
-- =============================================
-- Nota: trial_settings y admin_settings ya están en 00002_create_system_config.sql
-- Aquí agregamos booking_settings que no estaba incluido

INSERT INTO system_config (key, value, description) VALUES
  (
    'booking_settings',
    '{
      "default_cancellation_hours": 24,
      "default_reschedule_hours": 24,
      "terms_required": false
    }'::jsonb,
    'Configuración de reservas públicas'
  )
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- VERIFICACIÓN
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'TimeFlowPro seed data loaded successfully';
  RAISE NOTICE 'System config entries: trial_settings, admin_settings, booking_settings';
END $$;




