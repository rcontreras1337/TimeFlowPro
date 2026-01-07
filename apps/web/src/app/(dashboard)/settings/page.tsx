import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ProfileForm } from '@/components/features/settings/profile-form'
import { SettingsHeader } from '@/components/features/settings/settings-header'

export const metadata: Metadata = {
  title: 'Configuración',
  description: 'Administra tu perfil y preferencias de agenda en TimeFlowPro',
}

/**
 * Settings page for user profile management
 *
 * @ticket T-1-05
 */
export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <SettingsHeader />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<FormSkeleton />}>
            <ProfileForm />
          </Suspense>
        </div>

        <div className="space-y-6">
          <SlugPreview />
        </div>
      </div>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-6 rounded-xl border bg-white p-6 dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-48 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SlugPreview() {
  return (
    <div className="rounded-xl border bg-white p-6 dark:bg-gray-800">
      <h3 className="font-medium text-gray-900 dark:text-white">Tu página pública</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Comparte este enlace con tus clientes para que puedan agendar citas contigo.
      </p>
      <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
        <code className="text-sm text-primary-600 dark:text-primary-400">
          timeflowpro.app/tu-slug
        </code>
      </div>
    </div>
  )
}
