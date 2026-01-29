import Link from 'next/link'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

/**
 * Componente reutilizable para estados vacíos
 */
export default function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="mb-4 text-6xl">{icon}</span>
      <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 font-semibold text-white transition-colors"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 font-semibold text-white transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
