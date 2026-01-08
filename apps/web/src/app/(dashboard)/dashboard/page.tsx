import { Briefcase, Calendar, MapPin, Settings, Shield, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Tu panel de control en TimeFlowPro',
}

/**
 * Dashboard principal - Placeholder hasta Sprint 3
 *
 * En Sprint 3 esto mostrará el calendario (US-09)
 *
 * @ticket T-0-02 (estructura de carpetas)
 */
export default async function DashboardPage() {
  // Verificar si el usuario es superadmin
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isSuperAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isSuperAdmin = (profile as { role: string } | null)?.role === 'superadmin'
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      {/* Admin Link - Solo para superadmin */}
      {isSuperAdmin && (
        <Link href="/admin" className="block">
          <Card
            variant="interactive"
            className="border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10"
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Panel de Administración
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Gestiona profesionales y configuración del sistema
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Header de bienvenida */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          ¡Bienvenido a TimeFlowPro!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tu agenda inteligente para profesionales móviles
        </p>
      </div>

      {/* Próximamente */}
      <Card className="border-primary-200 bg-primary-50/50 dark:border-primary-800 dark:bg-primary-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
            <Calendar className="h-5 w-5" />
            Próximamente: Tu Calendario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-primary-600 dark:text-primary-400">
            Aquí verás tu calendario con citas, traslados y disponibilidad. Esta funcionalidad
            estará disponible en el Sprint 3.
          </p>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLinkCard
          href="/settings"
          icon={Settings}
          title="Configuración"
          description="Edita tu perfil y preferencias"
          available
        />
        <QuickLinkCard
          href="/locations"
          icon={MapPin}
          title="Ubicaciones"
          description="Gestiona tus lugares de trabajo"
        />
        <QuickLinkCard
          href="/services"
          icon={Briefcase}
          title="Servicios"
          description="Define los servicios que ofreces"
        />
        <QuickLinkCard
          href="/clients"
          icon={Users}
          title="Clientes"
          description="Administra tu base de clientes"
        />
      </div>

      {/* Info de desarrollo */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <strong>Sprint 1:</strong> Autenticación y Perfil ✅ | <strong>Sprint 2:</strong>{' '}
          Ubicaciones y Servicios | <strong>Sprint 3:</strong> Calendario y Citas
        </p>
      </div>
    </div>
  )
}

interface QuickLinkCardProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  available?: boolean
}

function QuickLinkCard({
  href,
  icon: Icon,
  title,
  description,
  available = false,
}: QuickLinkCardProps) {
  const content = (
    <Card
      variant={available ? 'interactive' : 'default'}
      className={!available ? 'opacity-60' : undefined}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            available
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
              : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          {!available && (
            <span className="text-xs text-gray-400 dark:text-gray-500">Próximamente</span>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (!available) {
    return content
  }

  // Type assertion needed for dynamic href with typedRoutes
  return <Link href={href as '/settings'}>{content}</Link>
}
