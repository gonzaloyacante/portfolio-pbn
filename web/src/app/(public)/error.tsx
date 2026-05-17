'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'
import { ROUTES } from '@/config/routes'

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="public-error-page flex min-h-[60dvh] items-center justify-center p-4">
      <div className="public-error-card w-full max-w-lg rounded-2xl p-8 text-center shadow-lg">
        <h2 className="font-heading mb-4 text-2xl font-bold">Algo salió mal</h2>
        <p className="public-error-muted mb-6">
          Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="public-error-primary-button rounded-full px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          >
            Intentar de nuevo
          </button>
          <Link
            href={ROUTES.home}
            className="public-error-link text-sm underline transition-opacity hover:opacity-100"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
