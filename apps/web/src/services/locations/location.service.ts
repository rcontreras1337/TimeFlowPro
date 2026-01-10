/**
 * Location Service
 *
 * Service for managing user locations following DDD and SOLID principles.
 *
 * @ticket T-2-01
 * @principle Single Responsibility - Only handles location operations
 * @principle Interface Segregation - Exposes only necessary methods
 */

import { createClient } from '@/lib/supabase/client'
import type {
  CreateLocationInput,
  Location,
  LocationInsert,
  LocationUpdate,
  UpdateLocationInput,
} from '@/types/location.types'

/**
 * Service class for location management
 */
export class LocationService {
  private supabase = createClient()

  /**
   * Get all locations for current user
   *
   * @returns Promise with array of locations ordered by order_index
   */
  async getAll(): Promise<Location[]> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) throw error
    return data ?? []
  }

  /**
   * Get a location by ID
   *
   * @param id - Location UUID
   * @returns Promise with location or null if not found
   */
  async getById(id: string): Promise<Location | null> {
    const { data, error } = await this.supabase.from('locations').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  }

  /**
   * Create a new location
   *
   * @param input - Location creation data
   * @returns Promise with created location
   */
  async create(input: CreateLocationInput): Promise<Location> {
    // Get current user
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error('auth.unauthorized')

    // Get next order_index
    const { data: existing } = await this.supabase
      .from('locations')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)
      .single()

    const nextIndex = ((existing as { order_index: number } | null)?.order_index ?? -1) + 1

    const insertData: LocationInsert = {
      ...input,
      user_id: user.id,
      order_index: nextIndex,
    }

    const { data, error } = await this.supabase
      .from('locations')
      .insert(insertData as unknown as never)
      .select()
      .single()

    if (error) throw error
    return data as Location
  }

  /**
   * Update an existing location
   *
   * @param id - Location UUID
   * @param input - Partial location data to update
   * @returns Promise with updated location
   */
  async update(id: string, input: UpdateLocationInput): Promise<Location> {
    const updateData: LocationUpdate = {
      ...input,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await this.supabase
      .from('locations')
      .update(updateData as unknown as never)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Location
  }

  /**
   * Delete a location (checks for active appointments)
   *
   * @param id - Location UUID
   * @throws Error if location has active appointments
   */
  async delete(id: string): Promise<void> {
    // Check for active appointments
    const { count } = await this.supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('location_id', id)
      .in('status', ['pending', 'confirmed'])

    if (count && count > 0) {
      throw new Error('locations.delete.hasAppointments')
    }

    const { error } = await this.supabase.from('locations').delete().eq('id', id)

    if (error) throw error
  }

  /**
   * Reorder locations by updating order_index
   *
   * @param orderedIds - Array of location UUIDs in desired order
   */
  async reorder(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      const updateData: LocationUpdate = {
        order_index: i,
        updated_at: new Date().toISOString(),
      }

      const { error } = await this.supabase
        .from('locations')
        .update(updateData as unknown as never)
        .eq('id', orderedIds[i]!)

      if (error) throw error
    }
  }

  /**
   * Toggle location active/inactive status
   *
   * @param id - Location UUID
   * @returns Promise with updated location
   */
  async toggleActive(id: string): Promise<Location> {
    const location = await this.getById(id)
    if (!location) throw new Error('locations.notFound')

    return this.update(id, { is_active: !location.is_active })
  }

  /**
   * Get only active locations
   *
   * @returns Promise with array of active locations
   */
  async getActive(): Promise<Location[]> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) throw error
    return data ?? []
  }
}

/**
 * Singleton instance of LocationService
 */
export const locationService = new LocationService()
