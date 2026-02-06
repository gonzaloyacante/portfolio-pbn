import { TextareaHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

/**
 * TextArea reutilizable con label y error
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="text-foreground mb-1 block text-sm font-medium">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full rounded-lg border px-3 py-2 text-sm transition-colors',
            'focus:ring-2 focus:outline-none',
            'min-h-[100px] resize-y',
            error
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
              : 'border-input bg-background text-foreground focus:border-ring focus:ring-ring/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        {error && <p className="text-destructive mt-1 text-sm">{error}</p>}
        {helperText && !error && <p className="text-muted-foreground mt-1 text-sm">{helperText}</p>}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
export default TextArea
