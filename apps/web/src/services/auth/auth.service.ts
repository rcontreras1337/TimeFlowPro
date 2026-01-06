import type { Provider } from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/client'

/**
 * Servicio de autenticación
 *
 * @description Maneja la autenticación con OAuth providers
 * @principle Single Responsibility - Solo maneja auth
 * @principle Dependency Inversion - Depende de abstracciones (supabase client)
 *
 * @ticket T-1-02
 */
export class AuthService {
  private supabase = createClient()

  /**
   * Inicia sesión con proveedor OAuth (Google)
   *
   * @param provider - Proveedor OAuth ('google')
   * @param scopes - Scopes adicionales para solicitar
   * @returns Datos de autenticación
   */
  async signInWithProvider(provider: Provider, scopes?: string) {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: scopes ?? 'openid email profile',
      },
    })

    if (error) throw error
    return data
  }

  /**
   * Inicia sesión con Google
   *
   * @param includeCalendarScope - Si incluir scope de Google Calendar
   */
  async signInWithGoogle(includeCalendarScope = false) {
    const scopes = includeCalendarScope
      ? 'openid email profile https://www.googleapis.com/auth/calendar'
      : 'openid email profile'

    return this.signInWithProvider('google', scopes)
  }

  /**
   * Cierra sesión del usuario
   */
  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  /**
   * Obtiene la sesión actual
   *
   * @returns Sesión actual o null
   */
  async getSession() {
    const { data, error } = await this.supabase.auth.getSession()
    if (error) throw error
    return data.session
  }

  /**
   * Obtiene el usuario actual
   *
   * @returns Usuario actual o null
   */
  async getUser() {
    const { data, error } = await this.supabase.auth.getUser()
    if (error) throw error
    return data.user
  }

  /**
   * Suscribe a cambios de estado de autenticación
   *
   * @param callback - Función a ejecutar en cambios de auth
   * @returns Objeto con método unsubscribe
   */
  onAuthStateChange(
    callback: (event: string, session: import('@supabase/supabase-js').Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback)
  }
}

/**
 * Instancia singleton del servicio de autenticación
 */
export const authService = new AuthService()
