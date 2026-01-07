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
    <div className="space-y-6">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Button
        onClick={() => void handleGoogleLogin()}
        isLoading={loading}
        variant="primary"
        size="lg"
        fullWidth
        className="gap-3"
      >
        {!loading && <GoogleIcon className="h-5 w-5" />}
        <span>{getMessage('auth.login.withGoogle')}</span>
      </Button>

      <p className="text-center text-xs text-gray-400">🔒 Autenticación segura con OAuth 2.0</p>
    </div>
  )
}
