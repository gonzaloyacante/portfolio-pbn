import { TextareaHTMLAttributes, forwardRef, useId } from 'react'
import { clsx } from 'clsx'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helpText?: string
}

/**
 * TextArea reutilizable con label y error
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helpText, required, className, id, ...props }, ref) => {
    const reactId = useId()
    const inputId = id || `textarea-${reactId}`
    const helpId = `${inputId}-help`

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="text-foreground mb-1 block text-sm font-medium">
            {label}
            {required && (
              <span className="text-destructive ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={helpText || error ? helpId : undefined}
          aria-required={required || undefined}
          className={clsx(
            'w-full rounded-lg border px-3 py-2 text-sm transition-colors',
            'focus:ring-2 focus:outline-none',
            'min-h-[100px] resize-y',
            'hover:border-foreground/40',
            error
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
              : 'border-input bg-background text-foreground focus:border-ring focus:ring-ring/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        {error && (
          <p id={helpId} className="text-destructive mt-1 text-sm">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={helpId} className="text-muted-foreground mt-1 text-sm">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
export default TextArea
