/**
 * Edge Function: notify-admin
 *
 * Envía notificaciones al administrador del sistema para eventos como:
 * - Nuevo registro de profesional
 * - Trial por expirar
 * - Trial expirado
 *
 * @ticket T-1-06
 * @trigger Llamado desde triggers de BD o cron jobs
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type NotificationType = 'new_registration' | 'trial_expiring' | 'trial_expired'

interface NotifyPayload {
  type: NotificationType
  professional_id: string
  professional_email: string
  professional_name: string
  trial_expires_at?: string
}

interface NotifyResponse {
  success: boolean
  to?: string
  subject?: string
  message?: string
  error?: string
}

/**
 * Build notification content based on type
 */
function buildNotification(payload: NotifyPayload): { subject: string; body: string } {
  switch (payload.type) {
    case 'new_registration':
      return {
        subject: `🆕 Nuevo registro: ${payload.professional_name}`,
        body: `Un nuevo profesional se ha registrado en TimeFlowPro:

Nombre: ${payload.professional_name}
Email: ${payload.professional_email}
Trial expira: ${payload.trial_expires_at ?? 'N/A'}

Accede al panel de admin para revisar: https://timeflowpro.app/admin`,
      }

    case 'trial_expiring':
      return {
        subject: `⚠️ Trial por expirar: ${payload.professional_name}`,
        body: `El trial de un profesional está por expirar:

Nombre: ${payload.professional_name}
Email: ${payload.professional_email}
Expira: ${payload.trial_expires_at ?? 'N/A'}

Considera contactar al profesional para retención.`,
      }

    case 'trial_expired':
      return {
        subject: `🔒 Trial expirado: ${payload.professional_name}`,
        body: `El trial de un profesional ha expirado:

Nombre: ${payload.professional_name}
Email: ${payload.professional_email}

La cuenta está ahora en modo solo lectura.`,
      }

    default:
      return {
        subject: `Notificación TimeFlowPro`,
        body: `Evento: ${payload.type}\nProfesional: ${payload.professional_name}`,
      }
  }
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const payload: NotifyPayload = await req.json()

    // Validate required fields
    if (!payload.type || !payload.professional_id || !payload.professional_email) {
      throw new Error('Missing required fields: type, professional_id, professional_email')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get admin settings
    const { data: adminConfig } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'admin_settings')
      .single()

    const adminEmail = adminConfig?.value?.notify_email
    if (!adminEmail) {
      const response: NotifyResponse = {
        success: false,
        message: 'No admin email configured in system_config',
      }
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Build notification content
    const { subject, body } = buildNotification(payload)

    // TODO: Integrate with actual email service (Resend, SendGrid, etc.)
    // For now, we just log the notification
    console.log(`[notify-admin] Sending to ${adminEmail}:`)
    console.log(`  Subject: ${subject}`)
    console.log(`  Body: ${body}`)

    // In production, you would call your email service here:
    // await resend.emails.send({
    //   from: 'TimeFlowPro <noreply@timeflowpro.app>',
    //   to: adminEmail,
    //   subject,
    //   text: body,
    // })

    const response: NotifyResponse = {
      success: true,
      to: adminEmail,
      subject,
      message: 'Notification logged (email integration pending)',
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[notify-admin] Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const response: NotifyResponse = {
      success: false,
      error: errorMessage,
    }

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
