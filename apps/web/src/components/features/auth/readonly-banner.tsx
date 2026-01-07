'use client'

import { AlertTriangle, Mail } from 'lucide-react'

import { getMessage } from '@/lib/messages/client'

/**
 * Banner shown when account is in readonly mode (trial expired)
 *
 * @ticket T-1-04
 */
export function ReadonlyBanner() {
  return (
    <div className="border-b border-yellow-200 bg-yellow-50 px-4 py-3 dark:border-yellow-800 dark:bg-yellow-900/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>{getMessage('account.trial.readOnlyMode')}:</strong>{' '}
            {getMessage('account.trial.expired')}. {getMessage('account.trial.contactAdmin')}.
          </p>
        </div>
        <a
          href="mailto:soporte@timeflowpro.app?subject=Activar cuenta"
          className="flex items-center gap-2 text-sm font-medium text-yellow-700 hover:text-yellow-900 dark:text-yellow-300 dark:hover:text-yellow-100"
        >
          <Mail className="h-4 w-4" />
          Contactar
        </a>
      </div>
    </div>
  )
}
