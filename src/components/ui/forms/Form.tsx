'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      />
    )
  }
)
FormLabel.displayName = 'FormLabel'

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { error?: string }
>(({ className, children, error, ...props }, ref) => {
  const body = error ? String(error) : children

  if (!body) {
    return null
  }

  return (
    <p ref={ref} className={cn('text-destructive text-[0.8rem] font-medium', className)} {...props}>
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

// Placeholder for full FormField implementation if needed,
// for now exposing the basic label/message parts used in refactor
const FormField = ({ children }: { children: React.ReactNode }) => <>{children}</>

export { FormLabel, FormMessage, FormField }
