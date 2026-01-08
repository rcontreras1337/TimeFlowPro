import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Términos y Condiciones - TimeFlowPro',
  description: 'Términos y condiciones de uso de TimeFlowPro',
}

/**
 * Terms of Service Page
 *
 * @ticket Sprint 1 - Refinamientos
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark-500 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Términos y Condiciones</CardTitle>
            <p className="text-gray-400 text-sm">Última actualización: Enero 2026</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Aceptación de Términos</h2>
              <p className="text-gray-300">
                Al utilizar TimeFlowPro, usted acepta estos términos y condiciones en su totalidad.
                Si no está de acuerdo, no utilice el servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Uso del Servicio</h2>
              <p className="text-gray-300">
                TimeFlowPro es una plataforma de gestión de citas para profesionales móviles. Usted
                es responsable de:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Mantener la confidencialidad de su cuenta</li>
                <li>La exactitud de la información ingresada</li>
                <li>El uso apropiado del servicio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Período de Prueba</h2>
              <p className="text-gray-300">
                Ofrecemos un período de prueba gratuito de 14 días. Al finalizar, podrá:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Suscribirse a un plan de pago</li>
                <li>Continuar en modo solo lectura (sin crear nuevas citas)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                4. Limitación de Responsabilidad
              </h2>
              <p className="text-gray-300">
                TimeFlowPro no se hace responsable por pérdida de citas o datos debido a mal uso del
                servicio o problemas técnicos fuera de nuestro control.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Contacto</h2>
              <p className="text-gray-300">Para consultas: legal@timeflowpro.app</p>
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
