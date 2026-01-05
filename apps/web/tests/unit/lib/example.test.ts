import { describe, it, expect } from 'vitest'

/**
 * Tests de ejemplo para validar que el setup de vitest funciona correctamente
 * @ticket T-0-04
 */
describe('Example Tests', () => {
  describe('Operaciones basicas', () => {
    it('debe sumar correctamente', () => {
      expect(1 + 1).toBe(2)
    })

    it('debe comparar strings', () => {
      expect('TimeFlowPro').toContain('Flow')
    })

    it('debe verificar tipos', () => {
      expect(typeof 'string').toBe('string')
      expect(typeof 123).toBe('number')
      expect(typeof true).toBe('boolean')
    })
  })

  describe('Arrays y objetos', () => {
    it('debe verificar arrays', () => {
      const arr = [1, 2, 3]

      expect(arr).toHaveLength(3)
      expect(arr).toContain(2)
    })

    it('debe verificar objetos', () => {
      const obj = { name: 'TimeFlowPro', version: '0.1.0' }

      expect(obj).toHaveProperty('name')
      expect(obj.name).toBe('TimeFlowPro')
    })

    it('debe comparar objetos', () => {
      const obj1 = { a: 1, b: 2 }
      const obj2 = { a: 1, b: 2 }

      expect(obj1).toEqual(obj2)
    })
  })

  describe('Async operations', () => {
    it('debe manejar promesas', async () => {
      const promise = Promise.resolve('success')

      await expect(promise).resolves.toBe('success')
    })

    it('debe manejar rechazos', async () => {
      const promise = Promise.reject(new Error('failure'))

      await expect(promise).rejects.toThrow('failure')
    })
  })

  describe('Environment variables', () => {
    it('debe tener variables de entorno mockeadas', () => {
      expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe('http://127.0.0.1:54321')
      expect(process.env.NEXT_PUBLIC_APP_URL).toBe('http://localhost:3000')
    })
  })
})
