import { redirect } from 'next/navigation'

import { AdminSidebar } from '@/components/features/admin/admin-sidebar'
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
 *
 * @ticket T-1-07
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
    <div className="min-h-screen bg-gray-100 dark:bg-dark-100">
      <AdminSidebar />
      <main className="lg:pl-64">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
