'use client'

import { Save, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Switch,
} from '@/components/ui'
import { getMessage } from '@/lib/messages'
import { createClient } from '@/lib/supabase/client'

interface TrialConfig {
  default_trial_days: number
  warning_days_before: number
  extend_max_days: number
}

interface AdminConfig {
  notify_email: string
  notify_on_signup: boolean
  notify_on_trial_expire: boolean
}

/**
 * Admin Config Page
 *
 * Configuración de trial y notificaciones admin.
 *
 * @ticket T-1-07
 */
export default function AdminConfigPage() {
  const [trialConfig, setTrialConfig] = useState<TrialConfig>({
    default_trial_days: 14,
    warning_days_before: 3,
    extend_max_days: 30,
  })
  const [adminConfig, setAdminConfig] = useState<AdminConfig>({
    notify_email: '',
    notify_on_signup: true,
    notify_on_trial_expire: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    void (async () => {
      await fetchConfig()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchConfig = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: trialData } = (await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'trial_settings')
        .single()) as { data: { value: TrialConfig } | null }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: adminData } = (await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'admin_settings')
        .single()) as { data: { value: AdminConfig } | null }

      if (trialData?.value) {
        setTrialConfig({
          default_trial_days: trialData.value.default_trial_days ?? 14,
          warning_days_before: trialData.value.warning_days_before ?? 3,
          extend_max_days: trialData.value.extend_max_days ?? 30,
        })
      }

      if (adminData?.value) {
        setAdminConfig({
          notify_email: adminData.value.notify_email ?? '',
          notify_on_signup: adminData.value.notify_on_signup ?? true,
          notify_on_trial_expire: adminData.value.notify_on_trial_expire ?? true,
        })
      }
    } finally {
      setIsFetching(false)
    }
  }

  const saveConfig = async () => {
    setIsLoading(true)

    try {
      /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      const { error: trialError } = await (supabase.from('system_config') as any)
        .update({ value: trialConfig, updated_at: new Date().toISOString() })
        .eq('key', 'trial_settings')

      if (trialError) throw trialError

      const { error: adminError } = await (supabase.from('system_config') as any)
        .update({ value: adminConfig, updated_at: new Date().toISOString() })
        .eq('key', 'admin_settings')
      /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

      if (adminError) throw adminError

      toast.success(getMessage('admin.config.save.success'))
    } catch {
      toast.error(getMessage('admin.config.save.error'))
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {getMessage('admin.config.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Ajusta parámetros globales del sistema</p>
      </div>

      {/* Trial Config */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Trial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {getMessage('admin.config.trialDays')}
              </label>
              <Input
                type="number"
                value={trialConfig.default_trial_days}
                onChange={(e) =>
                  setTrialConfig((prev) => ({
                    ...prev,
                    default_trial_days: parseInt(e.target.value) || 0,
                  }))
                }
                min={1}
                max={90}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Días de advertencia
              </label>
              <Input
                type="number"
                value={trialConfig.warning_days_before}
                onChange={(e) =>
                  setTrialConfig((prev) => ({
                    ...prev,
                    warning_days_before: parseInt(e.target.value) || 0,
                  }))
                }
                min={1}
                max={30}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Máximo días extensión
              </label>
              <Input
                type="number"
                value={trialConfig.extend_max_days}
                onChange={(e) =>
                  setTrialConfig((prev) => ({
                    ...prev,
                    extend_max_days: parseInt(e.target.value) || 0,
                  }))
                }
                min={1}
                max={90}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Config */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email de notificaciones
            </label>
            <Input
              type="email"
              value={adminConfig.notify_email}
              onChange={(e) =>
                setAdminConfig((prev) => ({
                  ...prev,
                  notify_email: e.target.value,
                }))
              }
              placeholder="admin@timeflowpro.app"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Notificar nuevos registros
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recibir email cuando alguien se registra
              </p>
            </div>
            <Switch
              checked={adminConfig.notify_on_signup}
              onCheckedChange={(checked) =>
                setAdminConfig((prev) => ({
                  ...prev,
                  notify_on_signup: checked,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Notificar trials por expirar
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recibir resumen de trials próximos a expirar
              </p>
            </div>
            <Switch
              checked={adminConfig.notify_on_trial_expire}
              onCheckedChange={(checked) =>
                setAdminConfig((prev) => ({
                  ...prev,
                  notify_on_trial_expire: checked,
                }))
              }
            />
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Button onClick={() => void saveConfig()} isLoading={isLoading} className="ml-auto">
            <Save className="h-4 w-4 mr-2" />
            Guardar configuración
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
