-- =============================================
-- TimeFlowPro - Seed Data for Local Development
-- =============================================
-- This file contains initial seed data for local development and testing.
-- It will be executed when running `supabase db reset`.
--
-- NOTE: Tables will be created in T-1-01 (Database Schema).
-- This seed file will be updated as tables are added.

-- =============================================
-- PLACEHOLDER SEED DATA
-- =============================================
-- Add seed data here after T-1-01 creates the tables.
-- Example:
--
-- INSERT INTO profiles (id, email, full_name, role, status)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000001', 'demo@timeflowpro.app', 'Usuario Demo', 'professional', 'active');
--
-- INSERT INTO locations (id, user_id, name, address, is_active)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Oficina Principal', 'Av. Principal 123', true);

-- For now, just log that seed was executed
DO $$
BEGIN
  RAISE NOTICE 'TimeFlowPro seed data loaded successfully';
END $$;



