'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Public page error:', error)
  }, [error])

  return (
    <div className="bg-background text-foreground flex min-h-[60vh] items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl p-8 text-center shadow-lg">
        <h2 className="font-heading mb-4 text-2xl font-bold">Algo salió mal</h2>
        <p className="text-muted-foreground mb-6">
          Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm underline transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
