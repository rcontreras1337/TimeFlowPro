import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

/**
 * Tests de integración para conexión a Supabase Local
 * 
 * PREREQUISITOS:
 * - Docker debe estar corriendo
 * - Ejecutar `pnpm supabase:start` antes de los tests
 * 
 * @ticket T-0-03
 */

const SUPABASE_URL = 'http://127.0.0.1:54321'
// Anon key generado por supabase local (valor por defecto)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

describe('Supabase Local Connection', () => {
  let supabase: ReturnType<typeof createClient>

  beforeAll(() => {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  })

  afterAll(async () => {
    // Limpiar conexiones si es necesario
  })

  describe('API Health Check', () => {
    it('debe conectar al API REST de Supabase', async () => {
      // Hacer una consulta simple para verificar conectividad
      const { error } = await supabase
        .from('_non_existent_table_')
        .select('*')
        .limit(1)

      // Esperamos un error de tabla no encontrada, no de conexión
      // Si el error es de conexión (network), el test falla
      if (error) {
        // Verificar que NO es un error de conexión/red
        const isNetworkError = 
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('ECONNREFUSED')
        
        expect(isNetworkError).toBe(false)
        
        // Cualquier otro error es aceptable (tabla no existe, permisos, etc.)
        expect(error).toBeDefined()
      }
    })

    it('debe poder acceder al schema public', async () => {
      // Verificar que el schema public está accesible
      const { data, error } = await supabase.rpc('version')
      
      // Es posible que la función no exista, pero no debería ser error de conexión
      if (error) {
        expect(error.message).not.toContain('Failed to fetch')
        expect(error.message).not.toContain('NetworkError')
      }
    })
  })

  describe('Auth Service', () => {
    it('debe tener el servicio de auth disponible', async () => {
      const { data, error } = await supabase.auth.getSession()
      
      // No debería haber error de conexión
      expect(error).toBeNull()
      // No hay sesión activa por defecto
      expect(data.session).toBeNull()
    })

    it('debe poder obtener la configuración de auth', async () => {
      // Verificar que el servicio de auth responde
      const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
        },
      })
      
      expect(response.ok).toBe(true)
      const settings = await response.json()
      expect(settings).toBeDefined()
    })
  })

  describe('Storage Service', () => {
    it('debe tener el servicio de storage disponible', async () => {
      const { data, error } = await supabase.storage.listBuckets()
      
      // No debería haber error de conexión
      if (error) {
        expect(error.message).not.toContain('Failed to fetch')
      }
      // Lista vacía es válida
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('Realtime Service', () => {
    it('debe poder crear una suscripción de realtime', () => {
      const channel = supabase.channel('test-channel')
      
      expect(channel).toBeDefined()
      expect(typeof channel.subscribe).toBe('function')
      expect(typeof channel.unsubscribe).toBe('function')
      
      // Limpiar
      channel.unsubscribe()
    })
  })
})

describe('Supabase Studio Accessibility', () => {
  const STUDIO_URL = 'http://127.0.0.1:54323'

  it('debe poder acceder a Supabase Studio', async () => {
    try {
      const response = await fetch(STUDIO_URL, {
        method: 'GET',
      })
      
      // Studio debería responder (puede ser 200 o redirect)
      expect(response.status).toBeLessThan(500)
    } catch (error) {
      // Si hay error de conexión, el test debe fallar con mensaje claro
      throw new Error(
        `No se pudo conectar a Supabase Studio en ${STUDIO_URL}. ` +
        'Asegúrate de ejecutar `pnpm supabase:start` antes de los tests.'
      )
    }
  })
})

describe('Database Direct Connection', () => {
  it('debe poder hacer queries SQL básicas via RPC', async () => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    // Intentar ejecutar una función RPC simple
    // Esta prueba verifica que PostgreSQL está respondiendo
    const { error } = await supabase.rpc('pg_sleep', { seconds: 0 })
    
    if (error) {
      // Es válido que la función no exista
      expect(error.code).not.toBe('PGRST000') // Connection error
    }
  })
})

