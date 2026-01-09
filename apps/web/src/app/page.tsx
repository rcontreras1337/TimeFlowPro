import { MapPin, Clock, Users, ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

/**
 * Landing page for TimeFlowPro - Mobile-first dark design
 * Shows "Ir al Dashboard" for authenticated users
 */
export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  return (
    <div className="flex min-h-screen flex-col bg-dark-500">
      {/* Header - Sticky with blur */}
      <header className="sticky top-0 z-50 border-b border-dark-200/30 bg-dark-500/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Image
                src="/logo-icon.svg"
                alt="TimeFlowPro"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </div>
            <span className="text-lg font-bold text-white sm:text-xl">
              Time<span className="text-primary-500">Flow</span>
              <span className="font-medium text-gray-400">Pro</span>
            </span>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
            {isAuthenticated ? (
              <Button variant="primary" size="sm" asChild>
                <Link href="/dashboard">Ir al Dashboard</Link>
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden text-sm font-medium text-gray-400 transition-colors hover:text-white sm:block"
                >
                  Iniciar Sesión
                </Link>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/login">Comenzar</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Mobile optimized */}
        <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
          {/* Subtle decorative orb */}
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl sm:h-96 sm:w-96" />

          <div className="relative mx-auto max-w-3xl">
            <div className="text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-dark-200/50 bg-dark-400/50 px-3 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-sm sm:text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                Para profesionales móviles
              </div>

              {/* Headline */}
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                La agenda que entiende que <span className="text-primary-500">te mueves</span>
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400 sm:mt-6 sm:text-lg">
                Gestiona múltiples ubicaciones, adapta duraciones por cliente y optimiza tu jornada
                automáticamente.
              </p>

              {/* CTA Buttons - Stack on mobile */}
              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                <Button variant="primary" size="lg" className="w-full sm:w-auto" asChild>
                  <Link
                    href={isAuthenticated ? '/dashboard' : '/login'}
                    className="inline-flex items-center justify-center gap-2"
                  >
                    {isAuthenticated ? 'Ir al Dashboard' : 'Prueba Gratis 14 Días'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full text-gray-300 sm:w-auto"
                  asChild
                >
                  <Link href="#features">Ver Funcionalidades</Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500 sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary-500" />
                  Sin tarjeta de crédito
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary-500" />
                  Cancela cuando quieras
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Todo lo que necesitas
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400 sm:text-base">
                Diseñado para profesionales que trabajan en múltiples ubicaciones.
              </p>
            </div>

            {/* Feature Grid - 2 columns on mobile, 4 on desktop */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 sm:gap-6 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="group rounded-2xl border border-dark-200/30 bg-dark-400/30 p-5 backdrop-blur-sm transition-all hover:border-primary-500/30 hover:bg-dark-400/50 sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500 transition-colors group-hover:bg-primary-500/20 sm:h-12 sm:w-12">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white sm:text-base">
                  Multi-ubicación
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-400 sm:text-sm">
                  Gestiona múltiples lugares con horarios diferenciados.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-2xl border border-dark-200/30 bg-dark-400/30 p-5 backdrop-blur-sm transition-all hover:border-primary-500/30 hover:bg-dark-400/50 sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-500/10 text-secondary-500 transition-colors group-hover:bg-secondary-500/20 sm:h-12 sm:w-12">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white sm:text-base">
                  Duración Adaptativa
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-400 sm:text-sm">
                  Ajusta automáticamente según el historial del cliente.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-2xl border border-dark-200/30 bg-dark-400/30 p-5 backdrop-blur-sm transition-all hover:border-primary-500/30 hover:bg-dark-400/50 sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-500 transition-colors group-hover:bg-accent-500/20 sm:h-12 sm:w-12">
                  <Image
                    src="/logo-icon.svg"
                    alt="Sync"
                    width={24}
                    height={24}
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white sm:text-base">
                  Sync con Google
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-400 sm:text-sm">
                  Sincroniza con Google Calendar automáticamente.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group rounded-2xl border border-dark-200/30 bg-dark-400/30 p-5 backdrop-blur-sm transition-all hover:border-primary-500/30 hover:bg-dark-400/50 sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-500/10 text-success-500 transition-colors group-hover:bg-success-500/20 sm:h-12 sm:w-12">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white sm:text-base">
                  Reservas Online
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-400 sm:text-sm">
                  Tus clientes reservan 24/7 sin necesidad de registrarse.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-3xl border border-dark-200/30 bg-gradient-to-br from-dark-400/50 to-dark-500/50 p-8 text-center backdrop-blur-sm sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              ¿Listo para optimizar tu agenda?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-gray-400 sm:text-base">
              Comienza tu prueba gratuita de 14 días. Sin tarjeta de crédito.
            </p>
            <div className="mt-8">
              <Button variant="primary" size="lg" asChild>
                <Link
                  href={isAuthenticated ? '/dashboard' : '/login'}
                  className="inline-flex items-center gap-2"
                >
                  {isAuthenticated ? 'Ir al Dashboard' : 'Comenzar Ahora'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-200/30 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs text-gray-500 sm:text-sm">
            © {new Date().getFullYear()} TimeFlowPro. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
