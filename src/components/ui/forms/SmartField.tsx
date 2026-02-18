import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
> {
  label: string
  name: string
  type?: 'text' | 'email' | 'textarea' | 'select' | 'number' | 'password' | 'date'
  rows?: number
  options?: { value: string; label: string }[]
  className?: string
  // Extend standard props
}

export default function FormField({
  label,
  name,
  type = 'text',
  rows = 4,
  options,
  className = '',
  ...props
}: FormFieldProps) {
  const baseClasses =
    'mt-1 block w-full rounded-md border border-input p-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background text-foreground'

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[var(--foreground)] opacity-90">
        {label}
      </label>

      {type === 'textarea' ? (
        <textarea
          name={name}
          rows={rows}
          className={baseClasses}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : type === 'select' && options ? (
        <select
          name={name}
          className={baseClasses}
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
          name={name}
          className={baseClasses}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </div>
  )
}
