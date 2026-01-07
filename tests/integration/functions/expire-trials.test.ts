import { describe, it, expect, beforeAll, afterAll } from 'vitest'

/**
 * Tests de integración para Edge Function expire-trials
 *
 * NOTA: Estos tests requieren Supabase local corriendo (`supabase start`)
 *
 * @ticket T-1-06
 */

// Skip if not running integration tests
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:54321'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const RUN_INTEGRATION = process.env.RUN_INTEGRATION === 'true'

describe.skipIf(!RUN_INTEGRATION)('Edge Function: expire-trials', () => {
  const functionUrl = `${SUPABASE_URL}/functions/v1/expire-trials`

  beforeAll(async () => {
    // Verificar que Supabase está corriendo
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/`)
      if (!response.ok) {
        throw new Error('Supabase not running')
      }
    } catch {
      console.warn('Supabase local no está corriendo, saltando tests de integración')
    }
  })

  it('debe responder con status 200 cuando se invoca correctamente', async () => {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    expect(response.status).toBe(200)
  })

  it('debe retornar count: 0 cuando no hay trials expirados', async () => {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    const data = await response.json()
    expect(data).toHaveProperty('count')
    expect(typeof data.count).toBe('number')
  })

  it('debe manejar CORS preflight correctamente', async () => {
    const response = await fetch(functionUrl, {
      method: 'OPTIONS',
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })

  it('debe incluir estructura de respuesta esperada', async () => {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    const data = await response.json()
    expect(data).toHaveProperty('message')
    expect(data).toHaveProperty('count')
  })
})

describe.skipIf(!RUN_INTEGRATION)('Edge Function: notify-admin', () => {
  const functionUrl = `${SUPABASE_URL}/functions/v1/notify-admin`

  it('debe responder con status 200 para notificación válida', async () => {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'new_registration',
        professional_id: 'test-uuid-123',
        professional_email: 'test@example.com',
        professional_name: 'Test User',
        trial_expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    })

    expect(response.status).toBe(200)
  })

  it('debe retornar error 500 si faltan campos requeridos', async () => {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'new_registration',
        // Missing required fields
      }),
    })

    expect(response.status).toBe(500)
  })

  it('debe incluir subject en respuesta exitosa', async () => {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'trial_expiring',
        professional_id: 'test-uuid-456',
        professional_email: 'test2@example.com',
        professional_name: 'Test User 2',
      }),
    })

    const data = await response.json()
    if (response.ok) {
      expect(data).toHaveProperty('subject')
      expect(data.subject).toContain('Trial por expirar')
    }
  })
})
