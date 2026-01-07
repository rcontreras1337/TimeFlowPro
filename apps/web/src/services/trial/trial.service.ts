/**
 * Trial Service
 *
 * Servicio para consultar y gestionar el estado del período de prueba
 *
 * @description Expone el estado del trial al cliente
 * @principle Single Responsibility - Solo maneja lógica de trial
 * @principle Dependency Inversion - Depende de abstracciones (supabase client)
 *
 * @ticket T-1-06
 */

import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

import type { TrialConfig, TrialStatus } from './trial.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type SystemConfig = Database['public']['Tables']['system_config']['Row']

interface TrialSettingsValue {
  default_trial_days?: number
  warning_days_before?: number
  extend_max_days?: number
}

/**
 * Service for managing trial period status and configuration
 */
export class TrialService {
  private supabase = createClient()

  /**
   * Get the trial status for a specific user
   *
   * @param userId - The user's UUID
   * @returns TrialStatus object with trial information
   */
  async getTrialStatus(userId: string): Promise<TrialStatus> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('account_status, trial_expires_at')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return {
        isInTrial: false,
        isExpired: false,
        daysLeft: null,
        expiresAt: null,
        showWarning: false,
      }
    }

    const profile = data as Pick<Profile, 'account_status' | 'trial_expires_at'>
    const isInTrial = profile.account_status === 'trial'
    const expiresAt = profile.trial_expires_at ? new Date(profile.trial_expires_at) : null
    const now = new Date()
    const isExpired = profile.account_status === 'readonly' || (expiresAt ? expiresAt < now : false)

    // Calculate days left
    let daysLeft: number | null = null
    if (expiresAt && isInTrial) {
      daysLeft = Math.max(
        0,
        Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      )
    }

    // Get warning threshold from config
    const config = await this.getTrialConfig()
    const showWarning = isInTrial && daysLeft !== null && daysLeft <= config.warningDays

    return {
      isInTrial,
      isExpired,
      daysLeft,
      expiresAt,
      showWarning,
    }
  }

  /**
   * Get the trial configuration from system_config
   *
   * @returns TrialConfig with default values if not configured
   */
  async getTrialConfig(): Promise<TrialConfig> {
    const { data } = await this.supabase
      .from('system_config')
      .select('value')
      .eq('key', 'trial_settings')
      .single()

    // Type-safe access to JSONB value
    const configData = data as Pick<SystemConfig, 'value'> | null
    const value = configData?.value as TrialSettingsValue | null

    return {
      defaultDays: value?.default_trial_days ?? 7,
      warningDays: value?.warning_days_before ?? 3,
      extendMaxDays: value?.extend_max_days ?? 30,
    }
  }

  /**
   * Check if a user's account is in readonly mode
   *
   * @param userId - The user's UUID
   * @returns true if account is readonly (trial expired)
   */
  async isReadonly(userId: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('profiles')
      .select('account_status')
      .eq('id', userId)
      .single()

    const profile = data as Pick<Profile, 'account_status'> | null
    return profile?.account_status === 'readonly'
  }
}

/**
 * Singleton instance of TrialService
 */
export const trialService = new TrialService()
