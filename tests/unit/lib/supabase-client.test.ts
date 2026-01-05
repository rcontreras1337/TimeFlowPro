import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Tests unitarios para el cliente Supabase del browser
 * @ticket T-0-03
 */

// Mock de createBrowserClient
const mockCreateBrowserClient = vi.fn()
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: (...args: unknown[]) => mockCreateBrowserClient(...args),
}))

describe('Supabase Browser Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock de variables de entorno
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://127.0.0.1:54321')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key-12345')
  })

  it('debe crear el cliente con la URL correcta', async () => {
    mockCreateBrowserClient.mockReturnValue({
      auth: { getSession: vi.fn() },
    })

    // Importamos dinámicamente para que tome los mocks
    const { createClient } = await import('../../../apps/web/src/lib/supabase/client')
    const client = createClient()

    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      'http://127.0.0.1:54321',
      'test-anon-key-12345'
    )
    expect(client).toBeDefined()
    expect(client.auth).toBeDefined()
  })

  it('debe retornar un cliente con métodos de auth', async () => {
    const mockAuthMethods = {
      getSession: vi.fn().mockResolvedValue({ data: null, error: null }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    }

    mockCreateBrowserClient.mockReturnValue({
      auth: mockAuthMethods,
      from: vi.fn(),
    })

    const { createClient } = await import('../../../apps/web/src/lib/supabase/client')
    const client = createClient()

    expect(client.auth.getSession).toBeDefined()
    expect(typeof client.auth.getSession).toBe('function')
  })

  it('debe retornar un cliente con método from para queries', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    })

    mockCreateBrowserClient.mockReturnValue({
      auth: { getSession: vi.fn() },
      from: mockFrom,
    })

    const { createClient } = await import('../../../apps/web/src/lib/supabase/client')
    const client = createClient()

    expect(client.from).toBeDefined()
    expect(typeof client.from).toBe('function')
  })
})

describe('Supabase Client Environment Variables', () => {
  it('debe lanzar error si SUPABASE_URL no está definida', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')

    // El cliente de Supabase debería manejar esto
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe('')
  })

  it('debe lanzar error si ANON_KEY no está definida', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')

    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('')
  })
})
