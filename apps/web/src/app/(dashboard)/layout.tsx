import type { ReactNode } from 'react'

import { AuthProvider } from '@/components/providers/auth-provider'

/**
 * Dashboard layout with AuthProvider
 *
 * This layout wraps all dashboard routes and:
 * - Shows readonly banner when trial has expired
 * - Shows trial banner when ≤3 days remaining
 * - Provides auth context to child components
 *
 * @ticket T-1-04
 * @updated Force reload
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
