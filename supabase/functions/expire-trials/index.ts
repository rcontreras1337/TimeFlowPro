/**
 * Edge Function: expire-trials
 *
 * Expira los trials que han pasado su fecha de expiración,
 * cambiando account_status de 'trial' a 'readonly'.
 *
 * @ticket T-1-06
 * @trigger Cron job diario a las 00:00 UTC
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExpiredTrial {
  id: string
  email: string
  full_name: string
  trial_expires_at: string
}

interface ExpireTrialsResponse {
  message: string
  count: number
  emails?: string[]
  error?: string
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const now = new Date().toISOString()

    // 1. Get expired trials that are still in 'trial' status
    const { data: expiredTrials, error: selectError } = await supabase
      .from('profiles')
      .select('id, email, full_name, trial_expires_at')
      .eq('account_status', 'trial')
      .lt('trial_expires_at', now)

    if (selectError) {
      throw new Error(`Error querying expired trials: ${selectError.message}`)
    }

    // No expired trials found
    if (!expiredTrials || expiredTrials.length === 0) {
      const response: ExpireTrialsResponse = {
        message: 'No expired trials found',
        count: 0,
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Update expired trials to 'readonly' status
    const expiredIds = (expiredTrials as ExpiredTrial[]).map((p) => p.id)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        account_status: 'readonly',
        updated_at: now,
      })
      .in('id', expiredIds)

    if (updateError) {
      throw new Error(`Error updating trials: ${updateError.message}`)
    }

    // 3. Notify admin about expired trials (optional - via notify-admin function)
    const { data: adminConfig } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'admin_settings')
      .single()

    if (adminConfig?.value?.notify_on_trial_expire) {
      // Log for now - in production would call notify-admin for each
      console.log(
        `[expire-trials] Notifying admin about ${expiredTrials.length} expired trials:`,
        (expiredTrials as ExpiredTrial[]).map((p) => p.email)
      )
    }

    // 4. Return success response
    const response: ExpireTrialsResponse = {
      message: 'Trials expired successfully',
      count: expiredTrials.length,
      emails: (expiredTrials as ExpiredTrial[]).map((p) => p.email),
    }

    console.log(`[expire-trials] Successfully expired ${expiredTrials.length} trials`)

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[expire-trials] Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const response: ExpireTrialsResponse = {
      message: 'Error expiring trials',
      count: 0,
      error: errorMessage,
    }

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
