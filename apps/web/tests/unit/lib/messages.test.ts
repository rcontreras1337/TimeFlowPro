import { describe, it, expect, vi, beforeEach } from 'vitest'

import { getMessage, t, hasMessage, setMessages, getMessages } from '@/lib/messages'

/**
 * Tests unitarios para el sistema de mensajes i18n
 * @ticket T-0-06
 */
describe('Messages System (i18n)', () => {
  // Mock messages for testing
  const mockMessages = {
    common: {
      loading: 'Cargando...',
      error: 'Ha ocurrido un error',
    },
    auth: {
      login: {
        title: 'Iniciar sesión',
        success: '¡Bienvenido!',
      },
    },
    account: {
      trial: {
        daysRemaining: 'Te quedan {days} días de prueba',
      },
    },
    validation: {
      minLength: 'Mínimo {min} caracteres',
      range: 'Valor debe estar entre {min} y {max}',
    },
  }

  beforeEach(() => {
    // Reset messages before each test
    setMessages(mockMessages)
    vi.clearAllMocks()
  })

  describe('getMessage', () => {
    it('debe resolver paths simples correctamente', () => {
      expect(getMessage('common.loading')).toBe('Cargando...')
      expect(getMessage('common.error')).toBe('Ha ocurrido un error')
    })

    it('debe resolver paths anidados profundos', () => {
      expect(getMessage('auth.login.title')).toBe('Iniciar sesión')
      expect(getMessage('auth.login.success')).toBe('¡Bienvenido!')
    })

    it('debe retornar el path como fallback si no existe el mensaje', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = getMessage('non.existent.path')

      expect(result).toBe('non.existent.path')
      expect(consoleSpy).toHaveBeenCalledWith('[i18n] Message not found: non.existent.path')
    })

    it('debe retornar path si el resultado no es string', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // 'common' is an object, not a string
      const result = getMessage('common')

      expect(result).toBe('common')
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('interpolación de variables', () => {
    it('debe interpolar una variable correctamente', () => {
      const result = getMessage('account.trial.daysRemaining', { days: 5 })

      expect(result).toBe('Te quedan 5 días de prueba')
    })

    it('debe interpolar múltiples variables', () => {
      const result = getMessage('validation.range', { min: 1, max: 100 })

      expect(result).toBe('Valor debe estar entre 1 y 100')
    })

    it('debe mantener placeholder si variable no existe', () => {
      const result = getMessage('validation.minLength', {})

      expect(result).toBe('Mínimo {min} caracteres')
    })

    it('debe manejar variables numéricas y string', () => {
      const resultNumber = getMessage('account.trial.daysRemaining', { days: 14 })
      const resultString = getMessage('account.trial.daysRemaining', { days: 'catorce' })

      expect(resultNumber).toBe('Te quedan 14 días de prueba')
      expect(resultString).toBe('Te quedan catorce días de prueba')
    })
  })

  describe('alias t()', () => {
    it('debe funcionar igual que getMessage', () => {
      expect(t('common.loading')).toBe(getMessage('common.loading'))
      expect(t('auth.login.title')).toBe(getMessage('auth.login.title'))
    })

    it('debe soportar interpolación', () => {
      expect(t('account.trial.daysRemaining', { days: 7 })).toBe('Te quedan 7 días de prueba')
    })
  })

  describe('hasMessage', () => {
    it('debe retornar true para mensajes existentes', () => {
      expect(hasMessage('common.loading')).toBe(true)
      expect(hasMessage('auth.login.title')).toBe(true)
    })

    it('debe retornar false para mensajes inexistentes', () => {
      expect(hasMessage('non.existent.path')).toBe(false)
      expect(hasMessage('common.nonexistent')).toBe(false)
    })

    it('debe retornar false para paths que apuntan a objetos', () => {
      expect(hasMessage('common')).toBe(false)
      expect(hasMessage('auth')).toBe(false)
    })
  })

  describe('getMessages', () => {
    it('debe retornar todos los mensajes cargados', () => {
      const messages = getMessages()

      expect(messages).toEqual(mockMessages)
    })
  })
})
