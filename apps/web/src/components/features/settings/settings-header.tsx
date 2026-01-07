import { Settings } from 'lucide-react'

/**
 * Header component for settings page
 *
 * @ticket T-1-05
 */
export function SettingsHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
        <Settings className="h-5 w-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Administra tu perfil y preferencias de agenda
        </p>
      </div>
    </div>
  )
}
