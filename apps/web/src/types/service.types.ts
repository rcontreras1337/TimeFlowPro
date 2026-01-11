/**
 * Service Types
 *
 * Types for Service management following DDD principles.
 *
 * @ticket T-2-03
 */

import type { Database } from './database.types'

/**
 * Service entity from database
 */
export type Service = Database['public']['Tables']['services']['Row']

/**
 * Service insert payload
 */
export type ServiceInsert = Database['public']['Tables']['services']['Insert']

/**
 * Service update payload
 */
export type ServiceUpdate = Database['public']['Tables']['services']['Update']

/**
 * Input for creating a new service
 *
 * @interface CreateServiceInput
 */
export interface CreateServiceInput {
  name: string
  description?: string
  default_duration_minutes?: number
  price?: number
  color?: string
  allow_online_booking?: boolean
  buffer_time_minutes?: number
  is_active?: boolean
}

/**
 * Input for updating an existing service
 *
 * @interface UpdateServiceInput
 */
export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  order_index?: number
}

/**
 * Service with statistics (for dashboard views)
 *
 * @interface ServiceWithStats
 */
export interface ServiceWithStats extends Service {
  _count?: {
    appointments: number
  }
}
