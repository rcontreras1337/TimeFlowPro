import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { AlertTriangle } from 'lucide-react'

import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { getMessage } from '@/lib/messages'
import { createClient } from '@/lib/supabase/server'

interface ExpiringTrial {
  id: string
  email: string
  full_name: string
  trial_expires_at: string
}

interface TrialSettings {
  warning_days_before?: number
}

/**
 * Trials Expiring Card Component
 *
 * Server component que muestra trials próximos a expirar.
 *
 * @ticket T-1-07
 */
export async function TrialsExpiringCard() {
  const supabase = await createClient()

  // Obtener configuración de warning
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: configData } = (await supabase
    .from('system_config')
    .select('value')
    .eq('key', 'trial_settings')
    .single()) as { data: { value: TrialSettings } | null }

  const warningDays = configData?.value?.warning_days_before ?? 3

  // Calcular fecha límite
  const limitDate = new Date()
  limitDate.setDate(limitDate.getDate() + warningDays)

  // Obtener trials por expirar
  const { data: expiringTrials } = await supabase
    .from('profiles')
    .select('id, email, full_name, trial_expires_at')
    .eq('account_status', 'trial')
    .lte('trial_expires_at', limitDate.toISOString())
    .gt('trial_expires_at', new Date().toISOString())
    .order('trial_expires_at', { ascending: true })
    .limit(5)

  const trials = (expiringTrials ?? []) as ExpiringTrial[]

  if (trials.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
          <AlertTriangle className="h-5 w-5" />
          {getMessage('admin.dashboard.expiringTrials')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trials.map((trial) => (
            <div
              key={trial.id}
              className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{trial.full_name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{trial.email}</p>
              </div>
              <Badge variant="warning">
                {formatDistanceToNow(new Date(trial.trial_expires_at), {
                  addSuffix: true,
                  locale: es,
                })}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
