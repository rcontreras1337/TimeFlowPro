'use client'

import { createContext, useContext, type ReactNode } from 'react'

import { ReadonlyBanner } from '@/components/features/auth/readonly-banner'
import { TrialBanner } from '@/components/features/auth/trial-banner'
import { useAuth } from '@/hooks/use-auth'

interface AuthContextType {
  /** Account is in readonly mode (trial expired) */
  isReadonly: boolean
  /** Account is in trial period */
  isTrial: boolean
  /** Days left in trial (null if not in trial) */
  trialDaysLeft: number | null
  /** Whether the user can perform mutations (create, update, delete) */
  canMutate: boolean
}

const AuthContext = createContext<AuthContextType>({
  isReadonly: false,
  isTrial: false,
  trialDaysLeft: null,
  canMutate: true,
})

/**
 * Auth provider that exposes account status and shows status banners
 *
 * @description Wrap dashboard layouts with this provider to:
 * - Show readonly banner when trial has expired
 * - Show trial banner when ≤3 days remaining
 * - Provide canMutate flag for disabling UI actions
 *
 * @ticket T-1-04
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const { profile, isReadonly, isTrial, trialDaysLeft, isLoading } = useAuth()

  // Check if user can perform mutations
  const canMutate = !isReadonly && profile?.account_status !== 'suspended'

  if (isLoading) {
    return <AuthLoadingSkeleton />
  }

  return (
    <AuthContext.Provider value={{ isReadonly, isTrial, trialDaysLeft, canMutate }}>
      {/* Status banners */}
      {isReadonly && <ReadonlyBanner />}
      {isTrial && trialDaysLeft !== null && trialDaysLeft <= 3 && (
        <TrialBanner daysLeft={trialDaysLeft} />
      )}

      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access auth context
 *
 * @example
 * const { canMutate, isReadonly } = useAuthContext()
 * if (!canMutate) {
 *   toast.error('Tu cuenta está en modo solo lectura')
 * }
 */
export const useAuthContext = () => useContext(AuthContext)

function AuthLoadingSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-500" />
    </div>
  )
}
