import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Tests unitarios para TrialService
 *
 * @ticket T-1-06
 */

// Mock data
const mockProfileInTrial = {
  account_status: 'trial',
  trial_expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
}

const mockProfileExpired = {
  account_status: 'readonly',
  trial_expires_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
}

const mockProfileActive = {
  account_status: 'active',
  trial_expires_at: null,
}

const mockTrialSettings = {
  value: {
    default_trial_days: 14,
    warning_days_before: 3,
    extend_max_days: 30,
  },
}

// Define mocks before vi.mock
const mockFrom = vi.fn()
const mockSelect = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
  }),
}))

describe('TrialService', () => {
  let TrialService: typeof import('@/services/trial').TrialService

  beforeEach(async () => {
    vi.clearAllMocks()

    // Setup mock chain
    mockFrom.mockReturnValue({ select: mockSelect })
    mockSelect.mockReturnValue({ eq: mockEq })
    mockEq.mockReturnValue({ single: mockSingle })

    // Import dynamically after mock
    const trialModule = await import('@/services/trial')
    TrialService = trialModule.TrialService
  })

  describe('getTrialStatus', () => {
    it('debe retornar estado de trial activo con días restantes', async () => {
      // Mock para profile query
      mockSingle.mockResolvedValueOnce({
        data: mockProfileInTrial,
        error: null,
      })
      // Mock para config query
      mockSingle.mockResolvedValueOnce({
        data: mockTrialSettings,
        error: null,
      })

      const service = new TrialService()
      const status = await service.getTrialStatus('user-123')

      expect(status.isInTrial).toBe(true)
      expect(status.isExpired).toBe(false)
      expect(status.daysLeft).toBeGreaterThan(0)
      expect(status.daysLeft).toBeLessThanOrEqual(5)
      expect(status.expiresAt).toBeInstanceOf(Date)
    })

    it('debe retornar trial expirado cuando account_status es readonly', async () => {
      mockSingle.mockResolvedValueOnce({
        data: mockProfileExpired,
        error: null,
      })
      mockSingle.mockResolvedValueOnce({
        data: mockTrialSettings,
        error: null,
      })

      const service = new TrialService()
      const status = await service.getTrialStatus('user-456')

      expect(status.isInTrial).toBe(false)
      expect(status.isExpired).toBe(true)
      expect(status.daysLeft).toBeNull()
    })

    it('debe retornar showWarning cuando quedan pocos días', async () => {
      const expiresIn2Days = {
        account_status: 'trial',
        trial_expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      }

      mockSingle.mockResolvedValueOnce({
        data: expiresIn2Days,
        error: null,
      })
      mockSingle.mockResolvedValueOnce({
        data: mockTrialSettings, // warning_days_before = 3
        error: null,
      })

      const service = new TrialService()
      const status = await service.getTrialStatus('user-789')

      expect(status.showWarning).toBe(true)
      expect(status.daysLeft).toBeLessThanOrEqual(3)
    })

    it('debe manejar usuario no encontrado', async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'Not found' },
      })

      const service = new TrialService()
      const status = await service.getTrialStatus('nonexistent')

      expect(status.isInTrial).toBe(false)
      expect(status.isExpired).toBe(false)
      expect(status.daysLeft).toBeNull()
      expect(status.expiresAt).toBeNull()
    })

    it('debe retornar sin trial para cuentas activas', async () => {
      mockSingle.mockResolvedValueOnce({
        data: mockProfileActive,
        error: null,
      })
      mockSingle.mockResolvedValueOnce({
        data: mockTrialSettings,
        error: null,
      })

      const service = new TrialService()
      const status = await service.getTrialStatus('active-user')

      expect(status.isInTrial).toBe(false)
      expect(status.isExpired).toBe(false)
    })
  })

  describe('getTrialConfig', () => {
    it('debe retornar configuración desde system_config', async () => {
      mockSingle.mockResolvedValueOnce({
        data: mockTrialSettings,
        error: null,
      })

      const service = new TrialService()
      const config = await service.getTrialConfig()

      expect(config.defaultDays).toBe(14)
      expect(config.warningDays).toBe(3)
      expect(config.extendMaxDays).toBe(30)
    })

    it('debe usar valores por defecto si no hay configuración', async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      })

      const service = new TrialService()
      const config = await service.getTrialConfig()

      expect(config.defaultDays).toBe(7)
      expect(config.warningDays).toBe(3)
      expect(config.extendMaxDays).toBe(30)
    })
  })

  describe('isReadonly', () => {
    it('debe retornar true para cuentas readonly', async () => {
      mockSingle.mockResolvedValueOnce({
        data: { account_status: 'readonly' },
        error: null,
      })

      const service = new TrialService()
      const isReadonly = await service.isReadonly('user-readonly')

      expect(isReadonly).toBe(true)
    })

    it('debe retornar false para cuentas activas', async () => {
      mockSingle.mockResolvedValueOnce({
        data: { account_status: 'active' },
        error: null,
      })

      const service = new TrialService()
      const isReadonly = await service.isReadonly('user-active')

      expect(isReadonly).toBe(false)
    })
  })
})
