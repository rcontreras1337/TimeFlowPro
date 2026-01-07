-- =============================================
-- MIGRACIÓN 00019: Trigger para notificar nuevo registro
-- Ticket: T-1-06
-- Descripción: Notifica al admin cuando un profesional se registra
-- NOTA: Requiere pg_net para llamadas HTTP (solo Supabase Cloud)
-- =============================================

-- =============================================
-- FUNCIÓN: Notificar al admin en nuevo registro
-- =============================================

CREATE OR REPLACE FUNCTION notify_new_registration()
RETURNS TRIGGER AS $$
DECLARE
  admin_config JSONB;
  should_notify BOOLEAN;
BEGIN
  -- Solo para profesionales
  IF NEW.role != 'professional' THEN
    RETURN NEW;
  END IF;

  -- Obtener configuración admin
  SELECT value INTO admin_config
  FROM system_config
  WHERE key = 'admin_settings';

  -- Verificar si notificaciones están habilitadas
  should_notify := COALESCE((admin_config->>'notify_on_signup')::boolean, false);

  -- Si notificaciones habilitadas y pg_net disponible
  IF should_notify AND EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') THEN
    -- Llamar Edge Function de forma asíncrona
    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-admin',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'type', 'new_registration',
        'professional_id', NEW.id,
        'professional_email', NEW.email,
        'professional_name', NEW.full_name,
        'trial_expires_at', NEW.trial_expires_at
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION notify_new_registration() IS 'Notifica al admin cuando un profesional se registra (requiere pg_net)';

-- =============================================
-- TRIGGER: Ejecutar después de crear perfil
-- =============================================

CREATE TRIGGER on_profile_created_notify
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_registration();

COMMENT ON TRIGGER on_profile_created_notify ON profiles IS 'Trigger para notificar al admin de nuevos registros';
