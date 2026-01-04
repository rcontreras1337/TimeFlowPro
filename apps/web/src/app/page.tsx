import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

/**
 * Landing page for TimeFlowPro
 */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.svg" alt="TimeFlowPro" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Time<span className="text-primary-500">Flow</span>
              <span className="font-medium text-gray-500">Pro</span>
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Iniciar Sesión
            </Link>
            <Button variant="primary" size="sm" asChild>
              <Link href="/login">Comenzar Gratis</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white py-20 dark:from-gray-800 dark:to-gray-900 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                La agenda que entiende que{' '}
                <span className="text-primary-500">te mueves</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                TimeFlowPro es la primera agenda digital diseñada para profesionales
                móviles. Calcula traslados, adapta duraciones por cliente y optimiza
                tu jornada automáticamente.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/login">Prueba Gratis 14 Días</Link>
                </Button>
                <Button variant="ghost" size="lg" asChild>
                  <Link href="#features">Ver Funcionalidades →</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Todo lo que necesitas para gestionar tu agenda
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Diseñado específicamente para profesionales que trabajan en múltiples
                ubicaciones.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Multi-ubicación
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Gestiona múltiples lugares de trabajo con horarios diferenciados.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-400">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Duración Adaptativa
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Ajusta automáticamente la duración según el historial del cliente.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-900 dark:text-accent-400">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Sync con Google
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Sincroniza con Google Calendar para recordatorios automáticos.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-100 text-success-600 dark:bg-success-700/20 dark:text-success-500">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Reservas Online
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Tus clientes reservan 24/7 sin necesidad de registrarse.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 py-16 dark:bg-primary-800">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ¿Listo para optimizar tu agenda?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
              Comienza tu prueba gratuita de 14 días. Sin tarjeta de crédito.
            </p>
            <div className="mt-8">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/login">Comenzar Ahora</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} TimeFlowPro. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

