import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils/cn'

/**
 * Tests unitarios para la utilidad cn (classnames)
 * @ticket T-0-04
 */
describe('cn utility', () => {
  describe('Combinacion basica', () => {
    it('debe combinar multiples clases', () => {
      const result = cn('class1', 'class2', 'class3')
      
      expect(result).toBe('class1 class2 class3')
    })

    it('debe filtrar valores falsy', () => {
      const result = cn('class1', null, undefined, false, 'class2')
      
      expect(result).toBe('class1 class2')
    })

    it('debe manejar strings vacios', () => {
      const result = cn('class1', '', 'class2')
      
      expect(result).toBe('class1 class2')
    })
  })

  describe('Clases condicionales', () => {
    it('debe manejar objetos de clases', () => {
      const result = cn({
        'class1': true,
        'class2': false,
        'class3': true,
      })
      
      expect(result).toBe('class1 class3')
    })

    it('debe combinar strings y objetos', () => {
      const result = cn('base', { 'conditional': true, 'not-applied': false })
      
      expect(result).toBe('base conditional')
    })
  })

  describe('Tailwind Merge', () => {
    it('debe resolver conflictos de clases Tailwind', () => {
      const result = cn('px-4', 'px-6')
      
      // tailwind-merge deberia mantener solo la ultima
      expect(result).toBe('px-6')
    })

    it('debe resolver conflictos de colores', () => {
      const result = cn('text-red-500', 'text-blue-500')
      
      expect(result).toBe('text-blue-500')
    })

    it('debe mantener clases no conflictivas', () => {
      const result = cn('px-4', 'py-2', 'text-white')
      
      expect(result).toBe('px-4 py-2 text-white')
    })

    it('debe resolver conflictos de padding', () => {
      const result = cn('p-4', 'px-6')
      
      // px-6 deberia sobrescribir el padding horizontal de p-4
      expect(result).toContain('px-6')
    })
  })

  describe('Arrays', () => {
    it('debe manejar arrays de clases', () => {
      const result = cn(['class1', 'class2'], 'class3')
      
      expect(result).toBe('class1 class2 class3')
    })

    it('debe manejar arrays anidados', () => {
      const result = cn(['class1', ['class2', 'class3']])
      
      expect(result).toBe('class1 class2 class3')
    })
  })
})

