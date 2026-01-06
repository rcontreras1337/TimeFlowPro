'use client'

import type { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

import { createClient } from '@/lib/supabase/client'
import type { AuthState, Profile } from '@/services/auth'

/**
 * Calcula los días restantes de trial
 */
function calculateTrialDaysLeft(expiresAt: string | null): number | null {
  if (!expiresAt) return null
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * Hook de autenticación con estado de cuenta
 *
 * @description Expone el estado de autenticación, perfil del usuario,
 *              y métodos para login/logout con Google OAuth.
 *
 * @example
 * const { user, profile, isReadonly, signInWithGoogle, signOut } = useAuth()
 *
 * @ticket T-1-02
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    isReadonly: false,
    isTrial: false,
    trialDaysLeft: null,
  })

  const router = useRouter()
  const supabase = createClient()

  /**
   * Obtiene el perfil del usuario desde la base de datos
   */
  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

      if (error) {
        console.error('Error fetching profile:', error.message)
        return null
      }

      return data as Profile
    },
    [supabase]
  )

  /**
   * Actualiza el estado de autenticación
   */
  const updateAuthState = useCallback(
    async (user: User | null, session: Session | null) => {
      if (user && session) {
        const profile = await fetchProfile(user.id)

        setState({
          user,
          profile,
          session,
          isLoading: false,
          isAuthenticated: true,
          isReadonly: profile?.account_status === 'readonly',
          isTrial: profile?.account_status === 'trial',
          trialDaysLeft: calculateTrialDaysLeft(profile?.trial_expires_at ?? null),
        })
      } else {
        setState({
          user: null,
          profile: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
          isReadonly: false,
          isTrial: false,
          trialDaysLeft: null,
        })
      }
    },
    [fetchProfile]
  )

  /**
   * Efecto para suscribirse a cambios de auth
   */
  useEffect(() => {
    // Obtener sesión inicial
    void supabase.auth.getSession().then(({ data: { session } }) => {
      void updateAuthState(session?.user ?? null, session)
    })

    // Suscribirse a cambios
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void updateAuthState(session?.user ?? null, session)
    })

    return () => subscription.unsubscribe()
  }, [supabase, updateAuthState])

  /**
   * Inicia sesión con Google
   */
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'openid email profile',
      },
    })

    if (error) {
      console.error('Error signing in with Google:', error.message)
      throw error
    }
  }

  /**
   * Cierra sesión
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error.message)
      throw error
    }

    router.push('/login')
  }

  /**
   * Refresca el perfil del usuario
   */
  const refreshProfile = async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id)
      if (profile) {
        setState((prev) => ({
          ...prev,
          profile,
          isReadonly: profile.account_status === 'readonly',
          isTrial: profile.account_status === 'trial',
          trialDaysLeft: calculateTrialDaysLeft(profile.trial_expires_at),
        }))
      }
    }
  }

  return {
    ...state,
    signInWithGoogle,
    signOut,
    refreshProfile,
  }
}
