import type { Session, User } from '@supabase/supabase-js'

import type { Tables } from '@/types/database.types'

/**
 * Profile from database
 */
export type Profile = Tables<'profiles'>

/**
 * Account status enum values
 */
export type AccountStatus = 'trial' | 'active' | 'readonly' | 'suspended' | 'pending_activation'

/**
 * Auth state for the useAuth hook
 */
export interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  isReadonly: boolean
  isTrial: boolean
  trialDaysLeft: number | null
}

/**
 * Auth error codes
 */
export const AUTH_ERRORS = {
  AUTH_FAILED: 'auth_failed',
  PROFILE_NOT_FOUND: 'profile_not_found',
  ACCOUNT_SUSPENDED: 'account_suspended',
  NO_CODE: 'no_code',
} as const

export type AuthErrorCode = (typeof AUTH_ERRORS)[keyof typeof AUTH_ERRORS]
