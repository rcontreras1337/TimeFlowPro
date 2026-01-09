import type { ReactNode } from 'react'

import { AppSidebar, type UserRole } from '@/components/layout/app-sidebar'
import { AuthProvider } from '@/components/providers/auth-provider'
import { BottomNav } from '@/components/ui/bottom-nav'
import { createClient } from '@/lib/supabase/server'

/**
 * Dashboard layout with AuthProvider, Sidebar and BottomNav
 *
 * This layout wraps all dashboard routes and:
 * - Shows readonly banner when trial has expired
 * - Shows trial banner when ≤3 days remaining
 * - Provides auth context to child components
 * - Shows AppSidebar on desktop, BottomNav on mobile
 *
 * @ticket T-1-04
 * @updated Sprint 1 Refinements - Added sidebar and bottom nav
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()

  // Get user session and role
  const {
    data: { session },
  } = await supabase.auth.getSession()

  let userRole: UserRole = 'professional'

  if (session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const profileRole = (profile as { role: string } | null)?.role
    if (profileRole === 'superadmin') {
      userRole = 'superadmin'
    }
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark-500">
        {/* Desktop Sidebar */}
        <AppSidebar userRole={userRole} />

        {/* Main content with sidebar offset on desktop */}
        <main className="lg:pl-64 pb-20 lg:pb-0">{children}</main>

        {/* Mobile Bottom Navigation */}
        <BottomNav userRole={userRole} />
      </div>
    </AuthProvider>
  )
}
