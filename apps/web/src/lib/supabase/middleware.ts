import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import type { Database } from '@/types/database'

// Fallback URLs for build time (never used at runtime)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'

interface CookieToSet {
  name: string
  value: string
  options: CookieOptions
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/auth/callback', '/terms', '/privacy']

// Admin routes that require superadmin role
const ADMIN_ROUTES = ['/admin']

// Pattern for public booking pages (slug-based)
const PUBLIC_SLUG_PATTERN = /^\/reservar\//

/**
 * Update Supabase session in middleware
 *
 * This middleware:
 * 1. Refreshes the user's session
 * 2. Protects routes based on authentication
 * 3. Verifies account status (suspended, readonly)
 * 4. Restricts admin routes to superadmin role
 *
 * @ticket T-1-04
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // === PUBLIC ROUTES ===
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || PUBLIC_SLUG_PATTERN.test(pathname)

  if (isPublicRoute) {
    // Redirect authenticated users from login to dashboard
    if (user && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return supabaseResponse
  }

  // === PROTECTED ROUTES ===
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Get user profile to check account status
  type ProfileData = {
    role: Database['public']['Enums']['user_role']
    account_status: Database['public']['Enums']['account_status']
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, account_status')
    .eq('id', user.id)
    .single<ProfileData>()

  if (!profile) {
    // Profile not found - sign out and redirect
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login?error=profile_not_found', request.url))
  }

  // === SUSPENDED ACCOUNT ===
  if (profile.account_status === 'suspended') {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login?error=account_suspended', request.url))
  }

  // === ADMIN ROUTES ===
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (profile.role !== 'superadmin') {
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url))
    }
  }

  // === READONLY MODE ===
  if (profile.account_status === 'readonly') {
    // Block mutations (non-GET requests) for readonly accounts
    if (request.method !== 'GET') {
      return NextResponse.json(
        { error: 'Account is in readonly mode. Trial has expired.' },
        { status: 403 }
      )
    }

    // Add header so frontend knows about readonly state
    supabaseResponse.headers.set('X-Account-Status', 'readonly')
  }

  // Add account status header for all authenticated requests
  supabaseResponse.headers.set('X-Account-Status', profile.account_status)

  return supabaseResponse
}
