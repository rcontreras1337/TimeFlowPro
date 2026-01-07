'use client'

import { Clock } from 'lucide-react'

import { getMessage } from '@/lib/messages/client'

interface TrialBannerProps {
  /** Days remaining in trial */
  daysLeft: number
}

/**
 * Banner shown when trial period is about to expire (≤3 days)
 *
 * @ticket T-1-04
 */
export function TrialBanner({ daysLeft }: TrialBannerProps) {
  const isUrgent = daysLeft <= 1

  const urgencyClasses = isUrgent
    ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200'
    : 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200'

  return (
    <div className={`border-b px-4 py-2 ${urgencyClasses}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-sm">
        <Clock className="h-4 w-4" />
        <span>
          {daysLeft === 0
            ? getMessage('account.trial.expired')
            : getMessage('account.trial.daysRemaining', { days: daysLeft })}
        </span>
      </div>
    </div>
  )
}
