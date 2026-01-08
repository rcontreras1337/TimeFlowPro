import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { getMessage } from '@/lib/messages'

/**
 * Custom 404 Page
 *
 * Página de error personalizada con reloj derretido chistoso.
 *
 * @ticket Sprint 1 - Refinamientos
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-500 px-4">
      <div className="text-center max-w-md">
        {/* Imagen del reloj derretido */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <Image
            src="/images/404-clock.png"
            alt="Reloj derretido - Página no encontrada"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-white mb-4">{getMessage('errors.404')}</h1>

        {/* Descripción */}
        <p className="text-gray-400 mb-8">
          Parece que el tiempo se derritió buscando esta página.
          <br />
          No te preocupes, te ayudamos a regresar.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg">
              Ir al inicio
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Ir al dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer sutil */}
      <p className="mt-12 text-sm text-gray-600">Error 404 - Página no encontrada</p>
    </div>
  )
}
