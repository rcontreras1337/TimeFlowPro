'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

/**
 * Login page with Google OAuth
 *
 * @ticket T-1-03
 */
export default function LoginPage() {
  const { signInWithGoogle, isLoading } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleGoogleLogin = () => {
    setIsSigningIn(true)
    signInWithGoogle().catch((error: unknown) => {
      console.error('Error al iniciar sesión con Google:', error)
      setIsSigningIn(false)
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.svg" alt="TimeFlowPro" className="mx-auto h-16 w-16" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Accede a tu cuenta de TimeFlowPro
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Button
            variant="outline"
            fullWidth
            className="gap-3"
            onClick={handleGoogleLogin}
            disabled={isLoading || isSigningIn}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading || isSigningIn ? 'Cargando...' : 'Continuar con Google'}
          </Button>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            ¿Nuevo aquí? Obtén 14 días de prueba gratis
          </p>
        </div>

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
