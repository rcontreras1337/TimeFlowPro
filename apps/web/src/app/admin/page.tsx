import { Suspense } from 'react'

import { AdminStats } from '@/components/features/admin/admin-stats'
import { ProfessionalsTable } from '@/components/features/admin/professionals-table'
import { TrialsExpiringCard } from '@/components/features/admin/trials-expiring-card'
import { getMessage } from '@/lib/messages'

/**
 * Admin Dashboard Page
 *
 * Muestra estadísticas, trials por expirar y tabla de profesionales.
 *
 * @ticket T-1-07
 */
export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {getMessage('admin.dashboard.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona profesionales y configuración del sistema
        </p>
      </div>

      {/* Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <AdminStats />
      </Suspense>

      {/* Trials por expirar */}
      <Suspense fallback={<CardSkeleton />}>
        <TrialsExpiringCard />
      </Suspense>

      {/* Tabla de profesionales */}
      <Suspense fallback={<TableSkeleton />}>
        <ProfessionalsTable />
      </Suspense>
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
      ))}
    </div>
  )
}

function CardSkeleton() {
  return <div className="h-48 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
}

function TableSkeleton() {
  return <div className="h-96 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
}
