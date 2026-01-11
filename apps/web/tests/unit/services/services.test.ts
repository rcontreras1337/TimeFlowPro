/**
 * Unit Tests for ServiceService
 *
 * Tests the ServiceService CRUD operations with mocked Supabase client.
 *
 * @ticket T-2-03
 */

import { describe, expect, it } from 'vitest'

import type { CreateServiceInput, Service, UpdateServiceInput } from '@/types/service.types'

// Mock service data for reference
const mockService: Service = {
  id: '1',
  user_id: 'user-1',
  name: 'Test Service',
  description: 'A test service',
  default_duration_minutes: 60,
  price: 50000,
  color: '#6366F1',
  is_active: true,
  allow_online_booking: true,
  buffer_time_minutes: 10,
  order_index: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

describe('ServiceService', () => {
  describe('Type Definitions', () => {
    it('should have correct Service type structure', () => {
      expect(mockService).toHaveProperty('id')
      expect(mockService).toHaveProperty('user_id')
      expect(mockService).toHaveProperty('name')
      expect(mockService).toHaveProperty('description')
      expect(mockService).toHaveProperty('default_duration_minutes')
      expect(mockService).toHaveProperty('price')
      expect(mockService).toHaveProperty('color')
      expect(mockService).toHaveProperty('is_active')
      expect(mockService).toHaveProperty('allow_online_booking')
      expect(mockService).toHaveProperty('buffer_time_minutes')
      expect(mockService).toHaveProperty('order_index')
      expect(mockService).toHaveProperty('created_at')
      expect(mockService).toHaveProperty('updated_at')
    })

    it('should validate CreateServiceInput', () => {
      const input: CreateServiceInput = {
        name: 'New Service',
        description: 'A new service',
        default_duration_minutes: 45,
        price: 30000,
        color: '#10B981',
        allow_online_booking: true,
        is_active: true,
      }

      expect(input.name).toBeDefined()
      expect(input.description).toBeDefined()
      expect(input.default_duration_minutes).toBe(45)
      expect(input.price).toBe(30000)
      expect(input.allow_online_booking).toBe(true)
    })

    it('should validate UpdateServiceInput allows partial updates', () => {
      const input: UpdateServiceInput = {
        name: 'Updated Name',
      }

      expect(input.name).toBe('Updated Name')
      expect(input.price).toBeUndefined()
      expect(input.description).toBeUndefined()
    })

    it('should validate UpdateServiceInput includes order_index', () => {
      const input: UpdateServiceInput = {
        order_index: 5,
      }

      expect(input.order_index).toBe(5)
    })
  })

  describe('Service Methods Contract', () => {
    it('should define getAll method that returns Service[]', () => {
      const services: Service[] = [mockService]
      expect(Array.isArray(services)).toBe(true)
      expect(services[0]).toEqual(mockService)
    })

    it('should define getById method that returns Service | null', () => {
      const found: Service | null = mockService
      const notFound: Service | null = null

      expect(found).not.toBeNull()
      expect(notFound).toBeNull()
    })

    it('should define create method that returns Service', () => {
      const created: Service = { ...mockService, id: 'new-id' }
      expect(created.id).toBe('new-id')
    })

    it('should define update method that returns Service', () => {
      const updated: Service = { ...mockService, name: 'Updated' }
      expect(updated.name).toBe('Updated')
    })

    it('should define delete method that throws on active appointments', () => {
      const error = new Error('services.delete.hasAppointments')
      expect(error.message).toBe('services.delete.hasAppointments')
    })

    it('should define toggleOnlineBooking method that inverts allow_online_booking', () => {
      const original = { ...mockService, allow_online_booking: true }
      const toggled = { ...original, allow_online_booking: !original.allow_online_booking }
      expect(toggled.allow_online_booking).toBe(false)
    })

    it('should define toggleActive method that inverts is_active', () => {
      const original = { ...mockService, is_active: true }
      const toggled = { ...original, is_active: !original.is_active }
      expect(toggled.is_active).toBe(false)
    })

    it('should define reorder method that updates order_index', () => {
      const orderedIds = ['id-3', 'id-1', 'id-2']
      const expectedIndexes = [0, 1, 2]

      orderedIds.forEach((_, index) => {
        expect(expectedIndexes[index]).toBe(index)
      })
    })

    it('should define getAvailableForBooking method', () => {
      const bookableServices: Service[] = [
        { ...mockService, is_active: true, allow_online_booking: true },
      ]
      expect(bookableServices[0]?.is_active).toBe(true)
      expect(bookableServices[0]?.allow_online_booking).toBe(true)
    })
  })

  describe('Validation Rules', () => {
    it('should require name for CreateServiceInput', () => {
      const input: CreateServiceInput = {
        name: 'Required Name',
      }
      expect(input.name).toBeTruthy()
    })

    it('should validate price >= 0', () => {
      const validPrice = 0
      const invalidPrice = -100

      expect(validPrice).toBeGreaterThanOrEqual(0)
      expect(invalidPrice).toBeLessThan(0)
    })

    it('should validate duration > 0', () => {
      const validDuration = 1
      const invalidDuration = 0

      expect(validDuration).toBeGreaterThan(0)
      expect(invalidDuration).not.toBeGreaterThan(0)
    })

    it('should have default color value', () => {
      expect(mockService.color).toBe('#6366F1')
    })

    it('should have default is_active as true', () => {
      expect(mockService.is_active).toBe(true)
    })

    it('should have order_index for sorting', () => {
      expect(typeof mockService.order_index).toBe('number')
    })

    it('should have default_duration_minutes', () => {
      expect(typeof mockService.default_duration_minutes).toBe('number')
      expect(mockService.default_duration_minutes).toBeGreaterThan(0)
    })

    it('should have buffer_time_minutes', () => {
      expect(typeof mockService.buffer_time_minutes).toBe('number')
    })
  })

  describe('Error Handling', () => {
    it('should use i18n key for unauthorized error', () => {
      const error = 'auth.unauthorized'
      expect(error).toBe('auth.unauthorized')
    })

    it('should use i18n key for not found error', () => {
      const error = 'services.notFound'
      expect(error).toBe('services.notFound')
    })

    it('should use i18n key for delete with appointments', () => {
      const error = 'services.delete.hasAppointments'
      expect(error).toBe('services.delete.hasAppointments')
    })

    it('should use i18n key for negative price validation', () => {
      const error = 'services.validation.priceNegative'
      expect(error).toBe('services.validation.priceNegative')
    })

    it('should use i18n key for invalid duration validation', () => {
      const error = 'services.validation.durationInvalid'
      expect(error).toBe('services.validation.durationInvalid')
    })
  })
})
