import { cn } from '@/lib/utils'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  children: React.ReactNode
  fullWidth?: boolean
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cn('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      loading = false,
      children,
      fullWidth = false,
      asChild = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transform hover:scale-105 hover:shadow-lg'

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary',
      outline:
        'bg-background border border-input hover:bg-accent hover:text-accent-foreground text-foreground',
      ghost: 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
      destructive:
        'bg-transparent border border-destructive text-destructive hover:bg-destructive/10',
    } as const

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2 text-sm',
      lg: 'px-7 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    }

    const combinedClassName = cn(
      base,
      variants[variant],
      sizes[size],
      fullWidth ? 'w-full' : '',
      className
    )

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<Record<string, unknown>>
      return React.cloneElement(child, {
        className: cn(child.props.className as string, combinedClassName),
        'aria-disabled': props.disabled ? 'true' : undefined,
        ...('onClick' in child.props ? {} : { onClick: props.onClick }),
      })
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        aria-disabled={props.disabled ? 'true' : undefined}
        aria-busy={loading ? 'true' : undefined}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading && <Spinner className="h-4 w-4" />}
        {!loading && leftIcon}
        {loading ? 'Cargando...' : children}
        {!loading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
