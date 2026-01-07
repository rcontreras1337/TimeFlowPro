-- =============================================
-- MIGRACIÓN 00018: Cron Jobs para Trial Automation
-- Ticket: T-1-06
-- Descripción: Job diario para expirar trials automáticamente
-- NOTA: Solo funciona en Supabase Cloud con pg_cron habilitado
-- =============================================

-- =============================================
-- CRON JOB: Expirar trials diariamente
-- Ejecuta a las 00:00 UTC cada día
-- =============================================

DO $$
BEGIN
  -- Solo crear el job si pg_cron está disponible
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    -- Verificar si el job ya existe
    IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'expire-trials-daily') THEN
      PERFORM cron.schedule(
        'expire-trials-daily',
        '0 0 * * *',  -- Cada día a 00:00 UTC
        $$
        SELECT net.http_post(
          url := current_setting('app.settings.supabase_url', true) || '/functions/v1/expire-trials',
          headers := jsonb_build_object(
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
            'Content-Type', 'application/json'
          ),
          body := '{}'::jsonb
        );
        $$
      );
      RAISE NOTICE 'Cron job expire-trials-daily created successfully';
    ELSE
      RAISE NOTICE 'Cron job expire-trials-daily already exists';
    END IF;
  ELSE
    RAISE NOTICE 'pg_cron extension not available - cron job not created (this is normal in local development)';
  END IF;
END $$;

-- =============================================
-- CRON JOB: Notificar trials por expirar (warning)
-- Ejecuta a las 09:00 UTC cada día
-- =============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'warn-expiring-trials-daily') THEN
      PERFORM cron.schedule(
        'warn-expiring-trials-daily',
        '0 9 * * *',  -- Cada día a 09:00 UTC
        $$
        -- Obtener trials que expiran en warning_days_before días
        WITH trial_config AS (
          SELECT (value->>'warning_days_before')::INTEGER AS warning_days
          FROM system_config
          WHERE key = 'trial_settings'
        ),
        expiring_trials AS (
          SELECT p.id, p.email, p.full_name, p.trial_expires_at
          FROM profiles p, trial_config tc
          WHERE p.account_status = 'trial'
            AND p.trial_expires_at <= NOW() + (tc.warning_days || ' days')::INTERVAL
            AND p.trial_expires_at > NOW()
        )
        SELECT net.http_post(
          url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-admin',
          headers := jsonb_build_object(
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
            'Content-Type', 'application/json'
          ),
          body := jsonb_build_object(
            'type', 'trial_expiring',
            'professional_id', et.id,
            'professional_email', et.email,
            'professional_name', et.full_name,
            'trial_expires_at', et.trial_expires_at
          )
        )
        FROM expiring_trials et;
        $$
      );
      RAISE NOTICE 'Cron job warn-expiring-trials-daily created successfully';
    END IF;
  END IF;
END $$;

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON SCHEMA cron IS 'Schema para pg_cron jobs - gestión automática de trials';
