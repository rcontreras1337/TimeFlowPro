/**
 * Location Types
 *
 * Types for Location management following DDD principles.
 *
 * @ticket T-2-01
 */

import type { Database } from './database.types'

/**
 * Location entity from database
 */
export type Location = Database['public']['Tables']['locations']['Row']

/**
 * Location insert payload
 */
export type LocationInsert = Database['public']['Tables']['locations']['Insert']

/**
 * Location update payload
 */
export type LocationUpdate = Database['public']['Tables']['locations']['Update']

/**
 * Input for creating a new location
 *
 * @interface CreateLocationInput
 */
export interface CreateLocationInput {
  name: string
  address?: string
  latitude?: number
  longitude?: number
  color?: string
  is_active?: boolean
}

/**
 * Input for updating an existing location
 *
 * @interface UpdateLocationInput
 */
export interface UpdateLocationInput extends Partial<CreateLocationInput> {
  order_index?: number
}

/**
 * Location with statistics (for dashboard views)
 *
 * @interface LocationWithStats
 */
export interface LocationWithStats extends Location {
  _count?: {
    appointments: number
    working_hours: number
  }
}
