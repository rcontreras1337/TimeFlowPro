import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Tests unitarios para AuthService
 *
 * @ticket T-1-02
 */

// Definir mocks antes del vi.mock
const mockAuth = {
  signInWithOAuth: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
  getUser: vi.fn(),
  onAuthStateChange: vi.fn(),
}

// Mock del cliente de Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: mockAuth,
  }),
}))

describe('AuthService', () => {
  // Importar dentro del describe para que el mock esté activo
  let AuthService: typeof import('@/services/auth').AuthService

  beforeEach(async () => {
    vi.clearAllMocks()
    // Importar dinámicamente después del mock
    const authModule = await import('@/services/auth')
    AuthService = authModule.AuthService
  })

  describe('signInWithGoogle', () => {
    it('debe llamar a signInWithOAuth con provider google', async () => {
      mockAuth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://google.com/auth' },
        error: null,
      })

      const service = new AuthService()
      await service.signInWithGoogle()

      expect(mockAuth.signInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: 'google',
        })
      )
    })

    it('debe incluir scope de Calendar cuando se solicita', async () => {
      mockAuth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://google.com/auth' },
        error: null,
      })

      const service = new AuthService()
      await service.signInWithGoogle(true)

      expect(mockAuth.signInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: 'google',
          options: expect.objectContaining({
            scopes: expect.stringContaining('calendar'),
          }),
        })
      )
    })

    it('debe lanzar error si OAuth falla', async () => {
      mockAuth.signInWithOAuth.mockResolvedValue({
        data: null,
        error: new Error('OAuth error'),
      })

      const service = new AuthService()
      await expect(service.signInWithGoogle()).rejects.toThrow('OAuth error')
    })
  })

  describe('signOut', () => {
    it('debe cerrar sesión correctamente', async () => {
      mockAuth.signOut.mockResolvedValue({ error: null })

      const service = new AuthService()
      await service.signOut()

      expect(mockAuth.signOut).toHaveBeenCalled()
    })

    it('debe lanzar error si logout falla', async () => {
      mockAuth.signOut.mockResolvedValue({ error: new Error('Logout error') })

      const service = new AuthService()
      await expect(service.signOut()).rejects.toThrow('Logout error')
    })
  })

  describe('getSession', () => {
    it('debe retornar la sesión actual', async () => {
      const mockSession = { access_token: 'token123', user: { id: 'user-1' } }
      mockAuth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null })

      const service = new AuthService()
      const session = await service.getSession()

      expect(session).toEqual(mockSession)
    })

    it('debe retornar null si no hay sesión', async () => {
      mockAuth.getSession.mockResolvedValue({ data: { session: null }, error: null })

      const service = new AuthService()
      const session = await service.getSession()

      expect(session).toBeNull()
    })
  })

  describe('getUser', () => {
    it('debe retornar el usuario actual', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' }
      mockAuth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null })

      const service = new AuthService()
      const user = await service.getUser()

      expect(user).toEqual(mockUser)
    })
  })

  describe('onAuthStateChange', () => {
    it('debe suscribirse a cambios de auth', async () => {
      const callback = vi.fn()
      const mockUnsubscribe = vi.fn()
      mockAuth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      })

      const service = new AuthService()
      service.onAuthStateChange(callback)

      expect(mockAuth.onAuthStateChange).toHaveBeenCalledWith(callback)
    })
  })
})
