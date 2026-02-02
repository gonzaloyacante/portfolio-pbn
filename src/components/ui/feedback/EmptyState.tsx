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
      <h3 className="text-foreground mb-2 text-xl font-semibold">{title}</h3>
      {description && <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-2 font-semibold transition-colors"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-2 font-semibold transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
