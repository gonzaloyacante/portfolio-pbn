import { clsx } from 'clsx'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
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
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary text-secondary-foreground border-secondary/50',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
    danger: 'bg-destructive/10 text-destructive border-destructive/20',
    outline: 'text-foreground border-border',
    success: 'bg-success/15 text-success dark:text-success border-success/20',
    warning: 'bg-warning/15 text-warning dark:text-warning border-warning/20',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200', // Kept for legacy compatibility if needed
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200',
    info: 'bg-info/15 text-info dark:text-info border-info/20',
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
      {...props}
    >
      {children}
    </span>
  )
}
