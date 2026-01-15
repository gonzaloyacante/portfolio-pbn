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
      <h3 className="mb-2 text-xl font-semibold text-red-600 dark:text-red-400">{title}</h3>
      <p className="mb-6 max-w-sm text-gray-600 dark:text-gray-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-red-700"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
