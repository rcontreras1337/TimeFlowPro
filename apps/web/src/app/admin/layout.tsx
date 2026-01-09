import { redirect } from 'next/navigation'

import { AppSidebar } from '@/components/layout/app-sidebar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Admin - TimeFlowPro',
  description: 'Panel de administración de TimeFlowPro',
}

/**
 * Admin Layout
 *
 * Verifica que el usuario sea superadmin antes de mostrar el contenido.
 * Redirige a login si no hay sesión, o a dashboard si no es superadmin.
 * Uses unified AppSidebar and BottomNav for consistent navigation.
 *
 * @ticket T-1-07
 * @updated Sprint 1 Refinements - Unified navigation
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // Verificar autenticación
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar rol superadmin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const profileRole = (profile as { role: string } | null)?.role
  if (profileRole !== 'superadmin') {
    redirect('/dashboard?error=unauthorized')
  }

  return (
    <div className="min-h-screen bg-dark-500">
      {/* Desktop Sidebar - superadmin role */}
      <AppSidebar userRole="superadmin" />

      {/* Main content with sidebar offset on desktop */}
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-4 lg:p-6">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav userRole="superadmin" />
    </div>
  )
}
