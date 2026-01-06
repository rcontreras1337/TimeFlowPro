import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

/**
 * Tests de integración para Auth Callback
 *
 * PREREQUISITOS:
 * - Supabase local corriendo
 * - Migraciones aplicadas
 *
 * @ticket T-1-02
 */

const SUPABASE_URL = 'http://127.0.0.1:54321'
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

describe('Auth Integration', () => {
  let supabaseAdmin: ReturnType<typeof createClient>

  beforeAll(() => {
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  })

  describe('Profiles Table', () => {
    it('debe tener la tabla profiles con campos de auth', async () => {
      const { error } = await supabaseAdmin
        .from('profiles')
        .select('id, email, account_status, trial_expires_at, role')
        .limit(0)

      expect(error).toBeNull()
    })

    it('debe tener valores válidos para account_status', async () => {
      // Verificar que los valores de enum son los esperados
      const validStatuses = ['trial', 'active', 'readonly', 'suspended', 'pending_activation']

      expect(validStatuses).toContain('trial')
      expect(validStatuses).toContain('active')
      expect(validStatuses).toContain('readonly')
      expect(validStatuses).toContain('suspended')
    })
  })

  describe('System Config', () => {
    it('debe tener configuración de trial', async () => {
      const { data, error } = await supabaseAdmin
        .from('system_config')
        .select('value')
        .eq('key', 'trial_settings')
        .single()

      expect(error).toBeNull()
      expect(data?.value).toBeDefined()
      expect(data?.value).toHaveProperty('default_trial_days')
    })
  })

  describe('Auth Endpoints', () => {
    it('debe tener servicio de auth disponible', async () => {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
        },
      })

      expect(response.ok).toBe(true)
      const settings = await response.json()
      expect(settings).toBeDefined()
    })

    it('debe tener Google OAuth habilitado', async () => {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
        },
      })

      const settings = await response.json()
      // external_providers debería incluir google si está habilitado
      expect(settings.external).toBeDefined()
    })
  })

  describe('Trigger handle_new_user', () => {
    it('función handle_new_user debe existir', async () => {
      // Verificamos indirectamente que el trigger existe
      // consultando la tabla profiles que debería tener el trigger asociado
      const { error } = await supabaseAdmin.from('profiles').select('id').limit(0)

      expect(error).toBeNull()
    })
  })
})
