'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

import { GoogleIcon } from '@/components/icons/google'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { getMessage } from '@/lib/messages/client'

/**
 * Error codes mapped to YML message paths
 */
const ERROR_MESSAGE_PATHS: Record<string, string> = {
  auth_failed: 'auth.errors.invalidCredentials',
  account_suspended: 'account.status.suspended',
  profile_not_found: 'errors.404',
  no_code: 'auth.login.error',
  session_expired: 'auth.errors.sessionExpired',
}

/**
 * Login form component with Google OAuth
 *
 * @description Handles Google login flow with error display from URL params
 * @ticket T-1-03
 */
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const { signInWithGoogle, isLoading: authLoading } = useAuth()

  // Read error from URL params
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      const messagePath = ERROR_MESSAGE_PATHS[errorParam]
      if (messagePath) {
        setError(getMessage(messagePath))
      } else {
        setError(getMessage('auth.login.error'))
      }
    }
  }, [searchParams])

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      console.error('Error signing in with Google:', err)
      setError(getMessage('auth.login.error'))
      setIsLoading(false)
    }
  }

  const loading = isLoading || authLoading

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Button
        onClick={() => void handleGoogleLogin()}
        isLoading={loading}
        variant="outline"
        size="lg"
        fullWidth
        className="relative"
      >
        {!loading && <GoogleIcon className="absolute left-4 h-5 w-5" />}
        <span>{getMessage('auth.login.withGoogle')}</span>
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            Autenticación segura con OAuth 2.0
          </span>
        </div>
      </div>
    </div>
  )
}
