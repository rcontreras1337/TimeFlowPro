/**
 * Service Service
 *
 * Service for managing user services following DDD and SOLID principles.
 *
 * @ticket T-2-03
 * @principle Single Responsibility - Only handles service operations
 * @principle Interface Segregation - Exposes only necessary methods
 */

import { createClient } from '@/lib/supabase/client'
import type {
  CreateServiceInput,
  Service,
  ServiceInsert,
  ServiceUpdate,
  UpdateServiceInput,
} from '@/types/service.types'

/**
 * Service class for service management
 */
export class ServiceService {
  private supabase = createClient()

  /**
   * Get all services for current user
   *
   * @returns Promise with array of services ordered by order_index
   */
  async getAll(): Promise<Service[]> {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) throw error
    return data ?? []
  }

  /**
   * Get a service by ID
   *
   * @param id - Service UUID
   * @returns Promise with service or null if not found
   */
  async getById(id: string): Promise<Service | null> {
    const { data, error } = await this.supabase.from('services').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }
    return data
  }

  /**
   * Create a new service with validations
   *
   * @param input - Service creation data
   * @returns Promise with created service
   * @throws Error if price < 0 or duration <= 0
   */
  async create(input: CreateServiceInput): Promise<Service> {
    // Validate price >= 0
    if (input.price !== undefined && input.price < 0) {
      throw new Error('services.validation.priceNegative')
    }

    // Validate duration > 0
    if (input.default_duration_minutes !== undefined && input.default_duration_minutes <= 0) {
      throw new Error('services.validation.durationInvalid')
    }

    // Get current user
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error('auth.unauthorized')

    // Get next order_index
    const { data: existing } = await this.supabase
      .from('services')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)
      .single()

    const nextIndex = ((existing as { order_index: number } | null)?.order_index ?? -1) + 1

    const insertData: ServiceInsert = {
      ...input,
      user_id: user.id,
      order_index: nextIndex,
    }

    const { data, error } = await this.supabase
      .from('services')
      .insert(insertData as unknown as never)
      .select()
      .single()

    if (error) throw error
    return data as Service
  }

  /**
   * Update an existing service
   *
   * @param id - Service UUID
   * @param input - Partial service data to update
   * @returns Promise with updated service
   * @throws Error if price < 0 or duration <= 0
   */
  async update(id: string, input: UpdateServiceInput): Promise<Service> {
    // Validate price >= 0
    if (input.price !== undefined && input.price < 0) {
      throw new Error('services.validation.priceNegative')
    }

    // Validate duration > 0
    if (input.default_duration_minutes !== undefined && input.default_duration_minutes <= 0) {
      throw new Error('services.validation.durationInvalid')
    }

    const updateData: ServiceUpdate = {
      ...input,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await this.supabase
      .from('services')
      .update(updateData as unknown as never)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Service
  }

  /**
   * Delete a service (checks for active appointments)
   *
   * @param id - Service UUID
   * @throws Error if service has active appointments
   */
  async delete(id: string): Promise<void> {
    // Check for active appointments
    const { count } = await this.supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('service_id', id)
      .in('status', ['pending', 'confirmed'])

    if (count && count > 0) {
      throw new Error('services.delete.hasAppointments')
    }

    const { error } = await this.supabase.from('services').delete().eq('id', id)

    if (error) throw error
  }

  /**
   * Toggle online booking availability
   *
   * @param id - Service UUID
   * @returns Promise with updated service
   */
  async toggleOnlineBooking(id: string): Promise<Service> {
    const service = await this.getById(id)
    if (!service) throw new Error('services.notFound')

    return this.update(id, { allow_online_booking: !service.allow_online_booking })
  }

  /**
   * Toggle service active/inactive status
   *
   * @param id - Service UUID
   * @returns Promise with updated service
   */
  async toggleActive(id: string): Promise<Service> {
    const service = await this.getById(id)
    if (!service) throw new Error('services.notFound')

    return this.update(id, { is_active: !service.is_active })
  }

  /**
   * Reorder services by updating order_index
   *
   * @param orderedIds - Array of service UUIDs in desired order
   */
  async reorder(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      const updateData: ServiceUpdate = {
        order_index: i,
        updated_at: new Date().toISOString(),
      }

      const { error } = await this.supabase
        .from('services')
        .update(updateData as unknown as never)
        .eq('id', orderedIds[i]!)

      if (error) throw error
    }
  }

  /**
   * Get services available for online booking
   *
   * @returns Promise with array of bookable services
   */
  async getAvailableForBooking(): Promise<Service[]> {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .eq('allow_online_booking', true)
      .order('order_index', { ascending: true })

    if (error) throw error
    return data ?? []
  }

  /**
   * Get only active services
   *
   * @returns Promise with array of active services
   */
  async getActive(): Promise<Service[]> {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) throw error
    return data ?? []
  }
}

/**
 * Singleton instance of ServiceService
 */
export const serviceService = new ServiceService()
