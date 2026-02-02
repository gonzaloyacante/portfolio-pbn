import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'destructive' | 'outline'
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Badge para mostrar estados o etiquetas
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
    danger: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    outline: 'text-foreground border border-border',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
