/**
 * Trial Service Types
 *
 * @ticket T-1-06
 */

/**
 * Status of a user's trial period
 */
export interface TrialStatus {
  /** Whether user is currently in trial */
  isInTrial: boolean
  /** Whether trial has expired */
  isExpired: boolean
  /** Days remaining in trial (null if not in trial) */
  daysLeft: number | null
  /** Expiration date (null if not in trial) */
  expiresAt: Date | null
  /** Whether to show warning (daysLeft <= warningDays) */
  showWarning: boolean
}

/**
 * Trial configuration from system_config
 */
export interface TrialConfig {
  /** Default trial period in days */
  defaultDays: number
  /** Days before expiry to show warning */
  warningDays: number
  /** Maximum days a trial can be extended */
  extendMaxDays: number
}
