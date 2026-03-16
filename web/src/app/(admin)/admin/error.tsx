'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[AdminError]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center">
      <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-[2.5rem]">
        <AlertTriangle className="text-destructive h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Algo salió mal</h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          {error.message || 'Ocurrió un error inesperado. Por favor intentá de nuevo.'}
        </p>
      </div>
      <button
        onClick={reset}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-2.5 text-sm font-medium transition-colors"
      >
        Reintentar
      </button>
    </div>
  )
}
