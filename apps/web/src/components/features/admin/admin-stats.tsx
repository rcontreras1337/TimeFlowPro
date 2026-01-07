import { AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react'

import { Card, CardContent } from '@/components/ui'
import { getMessage } from '@/lib/messages'
import { createClient } from '@/lib/supabase/server'

interface StatItem {
  label: string
  value: number
  icon: React.ElementType
  colorClass: string
}

/**
 * Admin Stats Component
 *
 * Server component que muestra estadísticas de usuarios.
 *
 * @ticket T-1-07
 */
export async function AdminStats() {
  const supabase = await createClient()

  // Obtener estadísticas
  const { count: totalProfessionals } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'professional')

  const { count: trialsActive } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('account_status', 'trial')

  const { count: activeAccounts } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('account_status', 'active')

  const { count: readonlyAccounts } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('account_status', 'readonly')

  const stats: StatItem[] = [
    {
      label: getMessage('admin.dashboard.totalProfessionals'),
      value: totalProfessionals ?? 0,
      icon: Users,
      colorClass: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
    },
    {
      label: getMessage('admin.dashboard.activeTrials'),
      value: trialsActive ?? 0,
      icon: Clock,
      colorClass: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
    },
    {
      label: 'Activos',
      value: activeAccounts ?? 0,
      icon: CheckCircle,
      colorClass: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
    },
    {
      label: 'Solo lectura',
      value: readonlyAccounts ?? 0,
      icon: AlertTriangle,
      colorClass: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.colorClass}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
