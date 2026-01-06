import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { LoginForm } from '@/components/features/auth/login-form'

export const metadata: Metadata = {
  title: 'Iniciar Sesión | TimeFlowPro',
  description:
    'Accede a tu cuenta de TimeFlowPro - La agenda inteligente para profesionales móviles',
}

/**
 * Login page with premium design
 *
 * @ticket T-1-03
 */
export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-100 dark:via-dark-200 dark:to-dark-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl dark:bg-primary-500 dark:opacity-10" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full opacity-20 blur-3xl dark:bg-secondary-500 dark:opacity-10" />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 dark:bg-dark-300 dark:shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.svg" alt="TimeFlowPro" className="h-12 w-auto" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bienvenido a TimeFlowPro
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                La agenda inteligente para profesionales móviles
              </p>
            </div>
          </div>

          {/* Form */}
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Al continuar, aceptas nuestros{' '}
            <a href="/terms" className="text-primary-600 hover:underline dark:text-primary-400">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="/privacy" className="text-primary-600 hover:underline dark:text-primary-400">
              Política de Privacidad
            </a>
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <Feature icon="⏱️" text="Duración adaptativa" />
          <Feature icon="🗺️" text="Gestión de traslados" />
          <Feature icon="📅" text="Sync con Google" />
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <span className="text-2xl">{icon}</span>
      <span className="text-xs text-gray-600 dark:text-gray-400">{text}</span>
    </div>
  )
}

function LoginFormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-gray-200 rounded-lg dark:bg-gray-700" />
    </div>
  )
}
