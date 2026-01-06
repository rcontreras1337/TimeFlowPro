-- =============================================
-- MIGRACIÓN 00003: Tabla profiles
-- Ticket: T-1-01
-- Descripción: Tabla de perfiles de usuario (extiende auth.users)
-- =============================================

-- =============================================
-- TABLA: profiles
-- =============================================

CREATE TABLE profiles (
  -- PK que referencia auth.users
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Datos básicos
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  
  -- URL pública personalizada: /reservar/{slug}
  slug TEXT UNIQUE,
  
  -- Zona horaria del usuario
  timezone TEXT NOT NULL DEFAULT 'America/Santiago',
  
  -- Foto de perfil
  avatar_url TEXT,
  
  -- Rol del usuario
  role user_role NOT NULL DEFAULT 'professional',
  
  -- Estado de la cuenta (modelo freemium)
  account_status account_status NOT NULL DEFAULT 'trial',
  
  -- Fecha de expiración del período de prueba
  trial_expires_at TIMESTAMPTZ,
  
  -- Estado activo (legacy, preferir account_status)
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Configuraciones personalizadas del usuario (JSONB híbrido)
  settings JSONB NOT NULL DEFAULT '{
    "appointment": {
      "default_duration": 45,
      "buffer_minutes": 5
    },
    "cancellation": {
      "hours_before": 24,
      "allow_client": true
    },
    "reschedule": {
      "hours_before": 24,
      "allow_client": true
    },
    "terms": {
      "required": false,
      "text": ""
    },
    "refund_policy": "",
    "notifications": {
      "email_on_booking": true,
      "email_on_cancel": true
    }
  }'::jsonb,
  
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ÍNDICES
-- =============================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_slug ON profiles(slug);
CREATE INDEX idx_profiles_account_status ON profiles(account_status);
CREATE INDEX idx_profiles_trial_expires ON profiles(trial_expires_at)
  WHERE account_status = 'trial';

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Usuario puede ver su propio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Usuario puede actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para que el trigger handle_new_user pueda crear perfiles
-- El trigger usa SECURITY DEFINER y esta política permite INSERTs
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- Superadmin puede ver todos los perfiles
CREATE POLICY "Superadmin can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'superadmin'
    )
  );

-- Superadmin puede actualizar todos los perfiles
CREATE POLICY "Superadmin can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'superadmin'
    )
  );

-- Perfiles públicos visibles para portal de reservas
CREATE POLICY "Public can view active profiles for booking" ON profiles
  FOR SELECT USING (
    is_active = true 
    AND account_status IN ('trial', 'active')
    AND slug IS NOT NULL
  );

-- =============================================
-- TRIGGER: Crear perfil automáticamente al registrar usuario
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_trial_days INTEGER;
BEGIN
  -- Obtener días de trial de configuración del sistema
  SELECT (value->>'default_trial_days')::INTEGER
  INTO default_trial_days
  FROM system_config
  WHERE key = 'trial_settings';

  -- Default 7 días si no hay configuración
  IF default_trial_days IS NULL THEN
    default_trial_days := 7;
  END IF;

  -- Insertar nuevo perfil
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    account_status,
    trial_expires_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    'trial',
    NOW() + (default_trial_days || ' days')::INTERVAL
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta después de insertar en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE profiles IS 'Perfiles de usuario que extienden auth.users de Supabase';
COMMENT ON COLUMN profiles.slug IS 'URL pública única para portal de reservas: /reservar/{slug}';
COMMENT ON COLUMN profiles.settings IS 'Configuración personalizada del usuario en formato JSON';
COMMENT ON COLUMN profiles.trial_expires_at IS 'Fecha de expiración del período de prueba gratuito';
COMMENT ON FUNCTION public.handle_new_user() IS 'Crea automáticamente un perfil cuando se registra un usuario nuevo';
