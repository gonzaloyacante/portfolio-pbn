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
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="mb-4 text-6xl">⚠️</span>
      <h3 className="text-destructive mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg px-6 py-2 font-semibold transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
