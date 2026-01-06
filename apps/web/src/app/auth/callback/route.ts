import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { AUTH_ERRORS } from '@/services/auth'

// Tipo para el perfil parcial que necesitamos
interface ProfileData {
  account_status: string
  trial_expires_at: string | null
}

/**
 * OAuth Callback Handler
 *
 * @description Maneja el callback de Google OAuth.
 *              Intercambia el código por tokens y redirige según estado de cuenta.
 *
 * @ticket T-1-02
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    console.error('Auth callback: No code provided')
    return NextResponse.redirect(`${origin}/login?error=${AUTH_ERRORS.NO_CODE}`)
  }

  const supabase = await createClient()

  // Intercambiar código por sesión
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Auth callback error:', error.message)
    return NextResponse.redirect(`${origin}/login?error=${AUTH_ERRORS.AUTH_FAILED}`)
  }

  // Obtener perfil del usuario
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('account_status, trial_expires_at')
    .eq('id', data.user.id)
    .single()

  const profile = profileData as ProfileData | null

  if (profileError || !profile) {
    console.error('Auth callback: Profile not found', profileError?.message ?? 'unknown error')
    return NextResponse.redirect(`${origin}/login?error=${AUTH_ERRORS.PROFILE_NOT_FOUND}`)
  }

  // Verificar estado de cuenta
  switch (profile.account_status) {
    case 'suspended':
      // Cuenta suspendida - no permitir acceso
      await supabase.auth.signOut()
      return NextResponse.redirect(`${origin}/login?error=${AUTH_ERRORS.ACCOUNT_SUSPENDED}`)

    case 'readonly':
      // Modo solo lectura - permitir login pero mostrar banner
      return NextResponse.redirect(`${origin}/dashboard?readonly=true`)

    case 'pending_activation':
      // Esperando activación manual
      return NextResponse.redirect(`${origin}/dashboard?pending=true`)

    case 'trial':
      // Verificar si el trial expiró
      if (profile.trial_expires_at && new Date(profile.trial_expires_at) < new Date()) {
        // Actualizar a readonly
        await supabase
          .from('profiles')
          .update({ account_status: 'readonly' as const })
          .eq('id', data.user.id)

        return NextResponse.redirect(`${origin}/dashboard?trial_expired=true`)
      }
      return NextResponse.redirect(`${origin}${next}`)

    case 'active':
    default:
      // Cuenta activa - acceso completo
      return NextResponse.redirect(`${origin}${next}`)
  }
}
