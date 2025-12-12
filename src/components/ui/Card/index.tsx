import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export default function Card({ className, children, ...props }: CardProps) {
  const classes = clsx(
    'rounded-lg bg-white p-6 shadow-md',
    className
  )

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
