'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui'

export default function AdminError({
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
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center">
      <div className="bg-destructive/10 rounded-card flex h-16 w-16 items-center justify-center">
        <AlertTriangle className="text-destructive h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Algo salió mal</h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          {error.message || 'Ocurrió un error inesperado. Por favor intentá de nuevo.'}
        </p>
      </div>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  )
}
