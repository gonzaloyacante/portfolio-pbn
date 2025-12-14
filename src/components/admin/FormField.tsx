interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'textarea' | 'select' | 'number'
  required?: boolean
  placeholder?: string
  defaultValue?: string
  rows?: number
  options?: { value: string; label: string }[]
  className?: string
}

/**
 * Campo de formulario reutilizable
 */
export default function FormField({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  defaultValue,
  rows = 4,
  options,
  className = '',
}: FormFieldProps) {
  const baseClasses =
    'mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:border-gray-600 dark:bg-gray-700'

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>

      {type === 'textarea' ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          rows={rows}
          className={baseClasses}
        />
      ) : type === 'select' && options ? (
        <select name={name} defaultValue={defaultValue} className={baseClasses}>
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
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={baseClasses}
        />
      )}
    </div>
  )
}
