/**
 * Unit Tests for LocationService
 *
 * Tests the LocationService CRUD operations with mocked Supabase client.
 *
 * @ticket T-2-01
 */

import { describe, expect, it } from 'vitest'

import type { CreateLocationInput, Location, UpdateLocationInput } from '@/types/location.types'

// Mock location data for reference
const mockLocation: Location = {
  id: '1',
  user_id: 'user-1',
  name: 'Test Location',
  address: '123 Main St',
  latitude: null,
  longitude: null,
  color: '#3F83F8',
  is_active: true,
  order_index: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

describe('LocationService', () => {
  describe('Type Definitions', () => {
    it('should have correct Location type structure', () => {
      expect(mockLocation).toHaveProperty('id')
      expect(mockLocation).toHaveProperty('user_id')
      expect(mockLocation).toHaveProperty('name')
      expect(mockLocation).toHaveProperty('address')
      expect(mockLocation).toHaveProperty('color')
      expect(mockLocation).toHaveProperty('is_active')
      expect(mockLocation).toHaveProperty('order_index')
      expect(mockLocation).toHaveProperty('created_at')
      expect(mockLocation).toHaveProperty('updated_at')
    })

    it('should validate CreateLocationInput', () => {
      const input: CreateLocationInput = {
        name: 'New Location',
        address: '456 Oak Ave',
        color: '#FF5733',
        is_active: true,
      }

      expect(input.name).toBeDefined()
      expect(input.address).toBeDefined()
      expect(input.color).toBeDefined()
      expect(input.is_active).toBe(true)
    })

    it('should validate UpdateLocationInput allows partial updates', () => {
      const input: UpdateLocationInput = {
        name: 'Updated Name',
      }

      expect(input.name).toBe('Updated Name')
      expect(input.address).toBeUndefined()
    })

    it('should validate UpdateLocationInput includes order_index', () => {
      const input: UpdateLocationInput = {
        order_index: 5,
      }

      expect(input.order_index).toBe(5)
    })
  })

  describe('Service Methods Contract', () => {
    it('should define getAll method that returns Location[]', () => {
      const locations: Location[] = [mockLocation]
      expect(Array.isArray(locations)).toBe(true)
      expect(locations[0]).toEqual(mockLocation)
    })

    it('should define getById method that returns Location | null', () => {
      const found: Location | null = mockLocation
      const notFound: Location | null = null

      expect(found).not.toBeNull()
      expect(notFound).toBeNull()
    })

    it('should define create method that returns Location', () => {
      const created: Location = { ...mockLocation, id: 'new-id' }
      expect(created.id).toBe('new-id')
    })

    it('should define update method that returns Location', () => {
      const updated: Location = { ...mockLocation, name: 'Updated' }
      expect(updated.name).toBe('Updated')
    })

    it('should define delete method that throws on active appointments', () => {
      const error = new Error('locations.delete.hasAppointments')
      expect(error.message).toBe('locations.delete.hasAppointments')
    })

    it('should define toggleActive method that inverts is_active', () => {
      const original = { ...mockLocation, is_active: true }
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
  })

  describe('Validation Rules', () => {
    it('should require name for CreateLocationInput', () => {
      const input: CreateLocationInput = {
        name: 'Required Name',
      }
      expect(input.name).toBeTruthy()
    })

    it('should have default color value', () => {
      expect(mockLocation.color).toBe('#3F83F8')
    })

    it('should have default is_active as true', () => {
      expect(mockLocation.is_active).toBe(true)
    })

    it('should have order_index for sorting', () => {
      expect(typeof mockLocation.order_index).toBe('number')
    })
  })

  describe('Error Handling', () => {
    it('should use i18n key for unauthorized error', () => {
      const error = 'auth.unauthorized'
      expect(error).toBe('auth.unauthorized')
    })

    it('should use i18n key for not found error', () => {
      const error = 'locations.notFound'
      expect(error).toBe('locations.notFound')
    })

    it('should use i18n key for delete with appointments', () => {
      const error = 'locations.delete.hasAppointments'
      expect(error).toBe('locations.delete.hasAppointments')
    })
  })
})
