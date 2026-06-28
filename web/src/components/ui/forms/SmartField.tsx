import { InputHTMLAttributes, TextareaHTMLAttributes, useId } from 'react'

interface FormFieldProps extends InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
> {
  label: string
  name: string
  type?: 'text' | 'email' | 'textarea' | 'select' | 'number' | 'password' | 'date'
  rows?: number
  options?: { value: string; label: string }[]
  className?: string
  required?: boolean
}

export default function FormField({
  label,
  name,
  type = 'text',
  rows = 4,
  options,
  className = '',
  required,
  ...props
}: FormFieldProps) {
  const reactId = useId()
  const inputId = props.id ?? `field-${name}-${reactId}`
  const labelId = `${inputId}-label`

  const baseClasses =
    'mt-1 block w-full rounded-md border border-input p-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background text-foreground'

  const a11yProps = {
    id: inputId,
    name,
    required,
    'aria-labelledby': labelId,
    'aria-required': required || undefined,
  }

  return (
    <div className={className}>
      <label
        id={labelId}
        htmlFor={inputId}
        className="text-foreground block text-sm font-medium opacity-90"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {type === 'textarea' ? (
        <textarea
          rows={rows}
          className={baseClasses}
          {...a11yProps}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : type === 'select' && options ? (
        <select
          className={baseClasses}
          {...a11yProps}
          {...(props as InputHTMLAttributes<HTMLSelectElement>)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className={baseClasses}
          {...a11yProps}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </div>
  )
}
