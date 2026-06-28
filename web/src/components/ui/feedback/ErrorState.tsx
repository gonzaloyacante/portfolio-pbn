import { Button } from '@/components/ui'
import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

/**
 * Componente reutilizable para estados de error
 */
export default function ErrorState({
  title = 'Algo salió mal',
  message = 'Hubo un error al cargar los datos. Por favor, inténtalo de nuevo.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle
        className="text-destructive mb-4 h-16 w-16"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h3 className="text-destructive mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
