import { createBrowserClient } from '@supabase/ssr'

import type { Database } from '@/types/database.types'

// Fallback URLs for build time (never used at runtime)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'

/**
 * Create a Supabase client for browser/client-side usage
 *
 * @returns Supabase client instance
 */
export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
}
