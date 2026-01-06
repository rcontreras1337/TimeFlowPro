-- =============================================
-- MIGRACIÓN 00015: Funciones y Triggers de auditoría
-- Ticket: T-1-01
-- Descripción: Funciones auxiliares y triggers para updated_at, duraciones, traslados
-- =============================================

-- =============================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 'Actualiza automáticamente la columna updated_at en cada UPDATE';

-- =============================================
-- APLICAR TRIGGER updated_at A TODAS LAS TABLAS
-- =============================================

-- profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- locations
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- services
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- clients
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- appointments
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- working_hours
CREATE TRIGGER update_working_hours_updated_at
  BEFORE UPDATE ON working_hours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- personal_blocks
CREATE TRIGGER update_personal_blocks_updated_at
  BEFORE UPDATE ON personal_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- system_config
CREATE TRIGGER update_system_config_updated_at
  BEFORE UPDATE ON system_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- google_calendar_tokens
CREATE TRIGGER update_gcal_tokens_updated_at
  BEFORE UPDATE ON google_calendar_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- google_calendar_events
CREATE TRIGGER update_gcal_events_updated_at
  BEFORE UPDATE ON google_calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCIÓN: Actualizar historial de duraciones cuando cita se completa
-- =============================================

CREATE OR REPLACE FUNCTION update_client_service_duration()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo ejecutar cuando status cambia a 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO client_service_durations (
      client_id,
      service_id,
      average_duration_minutes,
      min_duration_minutes,
      max_duration_minutes,
      total_appointments,
      last_appointment_at
    )
    VALUES (
      NEW.client_id,
      NEW.service_id,
      NEW.duration_minutes,
      NEW.duration_minutes,
      NEW.duration_minutes,
      1,
      NEW.end_time
    )
    ON CONFLICT (client_id, service_id) DO UPDATE SET
      average_duration_minutes = (
        (client_service_durations.average_duration_minutes * client_service_durations.total_appointments + NEW.duration_minutes)
        / (client_service_durations.total_appointments + 1)
      ),
      min_duration_minutes = LEAST(client_service_durations.min_duration_minutes, NEW.duration_minutes),
      max_duration_minutes = GREATEST(client_service_durations.max_duration_minutes, NEW.duration_minutes),
      total_appointments = client_service_durations.total_appointments + 1,
      last_appointment_at = NEW.end_time,
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_client_service_duration() IS 'Actualiza estadísticas de duración cuando una cita se completa';

-- Aplicar trigger
CREATE TRIGGER trigger_update_client_service_duration
  AFTER UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_client_service_duration();

-- =============================================
-- FUNCIÓN: Crear bloque de traslado automático
-- =============================================

CREATE OR REPLACE FUNCTION create_travel_block_if_needed()
RETURNS TRIGGER AS $$
DECLARE
  prev_appointment RECORD;
  travel_time INTEGER;
BEGIN
  -- Buscar cita anterior del mismo día en diferente ubicación
  SELECT * INTO prev_appointment
  FROM appointments
  WHERE user_id = NEW.user_id
    AND DATE(start_time AT TIME ZONE 'America/Santiago') = DATE(NEW.start_time AT TIME ZONE 'America/Santiago')
    AND end_time <= NEW.start_time
    AND id != NEW.id
    AND deleted_at IS NULL
    AND status NOT IN ('cancelled', 'no_show')
  ORDER BY end_time DESC
  LIMIT 1;

  -- Si hay cita anterior y es en ubicación diferente
  IF FOUND AND prev_appointment.location_id != NEW.location_id THEN
    -- Buscar tiempo de traslado configurado
    SELECT ltt.travel_time_minutes INTO travel_time
    FROM location_travel_times ltt
    WHERE ltt.from_location_id = prev_appointment.location_id
      AND ltt.to_location_id = NEW.location_id
      AND ltt.user_id = NEW.user_id;

    -- Si hay tiempo configurado, crear travel_block
    IF travel_time IS NOT NULL AND travel_time > 0 THEN
      INSERT INTO travel_blocks (
        user_id,
        appointment_id,
        from_location_id,
        to_location_id,
        start_time,
        end_time,
        travel_time_minutes,
        source
      ) VALUES (
        NEW.user_id,
        NEW.id,
        prev_appointment.location_id,
        NEW.location_id,
        prev_appointment.end_time,
        prev_appointment.end_time + (travel_time || ' minutes')::INTERVAL,
        travel_time,
        'manual'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION create_travel_block_if_needed() IS 'Crea automáticamente un bloque de traslado cuando hay cambio de ubicación';

-- Aplicar trigger
CREATE TRIGGER trigger_create_travel_block
  AFTER INSERT ON appointments
  FOR EACH ROW EXECUTE FUNCTION create_travel_block_if_needed();

-- =============================================
-- FUNCIÓN: Eliminar bloque de traslado al cancelar/eliminar cita
-- =============================================

CREATE OR REPLACE FUNCTION delete_travel_block_on_appointment_cancel()
RETURNS TRIGGER AS $$
BEGIN
  -- Si la cita se cancela o elimina, eliminar el bloque de traslado asociado
  IF NEW.status IN ('cancelled', 'no_show') OR NEW.deleted_at IS NOT NULL THEN
    DELETE FROM travel_blocks WHERE appointment_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION delete_travel_block_on_appointment_cancel() IS 'Elimina bloque de traslado cuando cita se cancela';

-- Aplicar trigger
CREATE TRIGGER trigger_delete_travel_block_on_cancel
  AFTER UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION delete_travel_block_on_appointment_cancel();

-- =============================================
-- POLÍTICA RLS PARA SYSTEM_CONFIG (diferida)
-- Se crea aquí porque profiles no existía cuando se creó system_config
-- =============================================

CREATE POLICY "Superadmin can manage system config" ON system_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- =============================================
-- FIN DE MIGRACIONES
-- =============================================

COMMENT ON SCHEMA public IS 'TimeFlowPro - Esquema principal con todas las tablas y funciones del sistema';
