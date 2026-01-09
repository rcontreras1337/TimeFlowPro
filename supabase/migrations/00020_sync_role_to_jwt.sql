-- ============================================================================
-- Migración: 00020_sync_role_to_jwt.sql
-- Descripción: Sincroniza el rol de profiles a auth.users.raw_app_meta_data
--              para que is_superadmin() funcione correctamente con RLS
-- ============================================================================

-- ============================================================================
-- 1. FUNCIÓN PARA SINCRONIZAR ROL AL JWT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.sync_role_to_jwt()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar raw_app_meta_data con el rol del perfil
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role::TEXT)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Configurar search_path para seguridad
ALTER FUNCTION public.sync_role_to_jwt() SET search_path = public, auth;

COMMENT ON FUNCTION public.sync_role_to_jwt() IS 
  'Sincroniza el campo role de profiles a auth.users.raw_app_meta_data para que las políticas RLS funcionen correctamente';

-- ============================================================================
-- 2. TRIGGER PARA SINCRONIZAR EN INSERT Y UPDATE
-- ============================================================================

-- Trigger en INSERT: cuando se crea un nuevo perfil
DROP TRIGGER IF EXISTS sync_role_on_profile_insert ON profiles;
CREATE TRIGGER sync_role_on_profile_insert
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_role_to_jwt();

-- Trigger en UPDATE: cuando se cambia el rol de un perfil
DROP TRIGGER IF EXISTS sync_role_on_profile_update ON profiles;
CREATE TRIGGER sync_role_on_profile_update
  AFTER UPDATE OF role ON profiles
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role)
  EXECUTE FUNCTION public.sync_role_to_jwt();

-- ============================================================================
-- 3. SINCRONIZAR USUARIOS EXISTENTES
-- ============================================================================
-- Actualiza todos los usuarios existentes para que tengan el rol en su JWT

UPDATE auth.users u
SET raw_app_meta_data = COALESCE(u.raw_app_meta_data, '{}'::jsonb) || 
  jsonb_build_object('role', p.role::TEXT)
FROM profiles p
WHERE u.id = p.id;

-- ============================================================================
-- 4. VERIFICACIÓN
-- ============================================================================
-- Mensaje de confirmación (solo para logs)
DO $$
DECLARE
  sync_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO sync_count 
  FROM auth.users u
  JOIN profiles p ON u.id = p.id
  WHERE u.raw_app_meta_data->>'role' = p.role::TEXT;
  
  RAISE NOTICE 'Usuarios sincronizados: %', sync_count;
END;
$$;

-- ============================================================================
-- FIN DE MIGRACIÓN
-- ============================================================================
