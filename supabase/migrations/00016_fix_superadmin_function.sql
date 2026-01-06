-- ============================================================================
-- Migración: 00016_fix_superadmin_function.sql
-- Descripción: Corrige la función is_superadmin() para evitar recursión en RLS
--              y configura el superadmin inicial
-- ============================================================================

-- ============================================================================
-- 1. CORREGIR FUNCIÓN is_superadmin()
-- ============================================================================
-- La versión anterior causaba recursión infinita al consultar la tabla profiles
-- durante el trigger handle_new_user. La nueva versión usa auth.jwt() directamente.

-- ============================================================================
-- 0. ASEGURAR EXISTENCIA DE SYSTEM_CONFIG (Fix para error de producción)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.system_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.system_config;
CREATE POLICY "Enable read access for all users" ON public.system_config
    FOR SELECT USING (true);

-- Insertar configuración por defecto si no existe
INSERT INTO public.system_config (key, value, description)
VALUES 
    ('trial_settings', '{"default_trial_days": 14}', 'Configuración de días de prueba')
ON CONFLICT (key) DO NOTHING;

-- Continuamos con el resto de la migración...

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean AS $$
BEGIN
  -- Usar auth.jwt() para evitar consultar la tabla profiles
  -- Esto evita recursión durante INSERT en profiles
  RETURN (auth.jwt() ->> 'role') = 'superadmin' 
     OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'superadmin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- 2. RECREAR POLÍTICAS DE SUPERADMIN (si existen las antiguas, eliminarlas)
-- ============================================================================

DROP POLICY IF EXISTS "Superadmin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Superadmin can update all profiles" ON profiles;

-- Crear nuevas políticas usando la función corregida
CREATE POLICY "Superadmin can view all profiles" ON profiles
  FOR SELECT USING (public.is_superadmin());

CREATE POLICY "Superadmin can update all profiles" ON profiles
  FOR UPDATE USING (public.is_superadmin());

-- ============================================================================
-- 3. CONFIGURAR SUPERADMIN INICIAL
-- ============================================================================
-- Nota: El superadmin debe existir primero como usuario en auth.users
-- Este script actualiza el perfil existente o lo marca para cuando se registre

-- Opción A: Si el usuario ya existe, actualizar su rol
UPDATE profiles 
SET role = 'superadmin', 
    account_status = 'active'
WHERE email = '4tipruben@gmail.com';

-- Opción B: Agregar configuración del superadmin en system_config
INSERT INTO system_config (key, value, description)
VALUES (
  'superadmin_email',
  '"4tipruben@gmail.com"',
  'Email del superadmin del sistema'
)
ON CONFLICT (key) DO UPDATE SET value = '"4tipruben@gmail.com"';

-- ============================================================================
-- 4. TRIGGER PARA AUTO-ASIGNAR SUPERADMIN AL REGISTRARSE
-- ============================================================================
-- Modificar handle_new_user para verificar si el email es el del superadmin

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_trial_days INTEGER;
  superadmin_email TEXT;
  new_role TEXT;
  new_status TEXT;
BEGIN
  -- Obtener email del superadmin de configuración
  SELECT REPLACE(value::TEXT, '"', '')
  INTO superadmin_email
  FROM system_config
  WHERE key = 'superadmin_email';

  -- Obtener días de trial de configuración del sistema
  SELECT (value->>'default_trial_days')::INTEGER
  INTO default_trial_days
  FROM system_config
  WHERE key = 'trial_settings';

  -- Default 7 días si no hay configuración
  IF default_trial_days IS NULL THEN
    default_trial_days := 7;
  END IF;

  -- Determinar rol y estado basado en email
  IF NEW.email = superadmin_email THEN
    new_role := 'superadmin';
    new_status := 'active';
  ELSE
    new_role := 'professional';
    new_status := 'trial';
  END IF;

  -- Insertar nuevo perfil
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    role,
    account_status,
    trial_expires_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    new_role::user_role,
    new_status::account_status,
    CASE WHEN new_role = 'superadmin' THEN NULL 
         ELSE NOW() + (default_trial_days || ' days')::INTERVAL 
    END
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix de seguridad: Asegurar search_path para que encuentre las tablas
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- ============================================================================
-- FIN DE MIGRACIÓN
-- ============================================================================
