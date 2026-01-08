import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Política de Privacidad - TimeFlowPro',
  description: 'Política de privacidad y protección de datos de TimeFlowPro',
}

/**
 * Privacy Policy Page
 *
 * @ticket Sprint 1 - Refinamientos
 */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark-500 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Política de Privacidad</CardTitle>
            <p className="text-gray-400 text-sm">Última actualización: Enero 2026</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                1. Información que Recopilamos
              </h2>
              <p className="text-gray-300">
                TimeFlowPro recopila información que usted nos proporciona directamente, incluyendo:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Información de cuenta (nombre, email) a través de Google OAuth</li>
                <li>Información de perfil profesional que usted ingresa</li>
                <li>Datos de citas, clientes y servicios</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Uso de la Información</h2>
              <p className="text-gray-300">Utilizamos su información para:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Proveer y mantener el servicio</li>
                <li>Sincronizar con Google Calendar (con su autorización)</li>
                <li>Enviar notificaciones importantes sobre su cuenta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Protección de Datos</h2>
              <p className="text-gray-300">
                Sus datos están protegidos mediante encriptación y almacenados de forma segura en
                servidores de Supabase con políticas de seguridad a nivel de fila (RLS).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Contacto</h2>
              <p className="text-gray-300">
                Para consultas sobre privacidad: privacy@timeflowpro.app
              </p>
            </section>

            <div className="pt-6 border-t border-gray-700">
              <Link href="/login">
                <Button variant="outline">Volver al inicio</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
