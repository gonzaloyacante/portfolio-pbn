'use client'

import { useState, useRef, useEffect, useId } from 'react'
import { X, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  /** Options list */
  options: SelectOption[]
  /** Selected value */
  value: string
  /** Callback when value changes */
  onChange: (value: string) => void
  /** Placeholder text when nothing is selected */
  placeholder?: string
  /** Disable interaction */
  disabled?: boolean
  /** Show error state */
  error?: boolean | string
  /** Hidden input name (for forms) */
  name?: string
  /** Accessible id (paired with label) */
  id?: string
  /** Enable search filter inside the dropdown */
  searchable?: boolean
  /** Show clear (X) button when a value is selected */
  clearable?: boolean
  /** Label text displayed above the trigger */
  label?: string
  /** Visual variant — same set as `Input` */
  variant?: 'default' | 'filled' | 'ghost'
  /** Size variant — same set as `Input` */
  inputSize?: 'sm' | 'md' | 'lg'
  /** Container class name */
  containerClassName?: string
  /** Trigger class name (for page-specific overrides) */
  className?: string
  /** Mark field as required (shows asterisk) */
  required?: boolean
}

const sizeClasses = {
  sm: 'h-8 text-xs px-2.5',
  md: 'h-10 text-sm px-3',
  lg: 'h-12 text-base px-4',
}

const variantClasses = {
  default:
    'border border-input bg-background text-foreground hover:border-foreground/40 focus:border-ring focus:ring-2 focus:ring-ring/20',
  filled: 'border-0 bg-muted hover:bg-muted/80 focus:bg-background focus:ring-2 focus:ring-ring/20',
  ghost: 'border-0 bg-transparent hover:bg-muted focus:bg-muted focus:ring-2 focus:ring-ring/20',
}

/**
 * Reusable dropdown — does NOT use the native `<select>` element.
 * Follows the same pattern as `Input` and `Button`:
 * - Tailwind-only styling via `cn()` + `variantClasses` (no CSS file dependency).
 * - `variant` mirrors `Input` (`default | filled | ghost`).
 * - Page-specific overrides come through `className`, not via component variants.
 */
export const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Selecciona una opción',
  disabled = false,
  error = false,
  name,
  id,
  searchable = false,
  clearable = false,
  label,
  variant = 'default',
  inputSize = 'md',
  containerClassName,
  className = '',
  required,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const triggerId = id || `select-${generatedId}`
  const listboxId = `${triggerId}-listbox`

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options

  const selectedOption = options.find((option) => option.value === value)

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined

  return (
    <div ref={containerRef} className={cn('w-full', containerClassName)}>
      {label && (
        <label htmlFor={triggerId} className="text-foreground mb-2 block text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <button
        type="button"
        role="combobox"
        className={cn(
          'w-full rounded-lg transition-all duration-200 outline-none',
          'flex items-center justify-between text-left',
          'placeholder:text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50',
          sizeClasses[inputSize],
          variantClasses[variant],
          !disabled && 'cursor-pointer',
          hasError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        id={triggerId}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-expanded={isOpen}
        aria-invalid={hasError}
        aria-required={required}
      >
        <span className="min-w-0 flex-1 truncate">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          {clearable && value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
              }}
              className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
              aria-label="Limpiar selección"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'text-muted-foreground h-5 w-5 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </button>
      <input type="hidden" name={name} value={value} />

      {isOpen && (
        <ul
          id={listboxId}
          className={cn(
            'border-input bg-popover text-popover-foreground',
            'absolute right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border py-1 text-sm shadow-xl'
          )}
          role="listbox"
        >
          {searchable && (
            <li className="bg-popover sticky top-0 px-2 pt-1 pb-1">
              <input
                ref={inputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring/20 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                placeholder="Buscar..."
                aria-label="Buscar opción"
                autoFocus
              />
            </li>
          )}
          {filteredOptions.length === 0 && (
            <li className="text-muted-foreground px-4 py-2">Sin opciones</li>
          )}
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              className={cn(
                'mx-1 cursor-pointer rounded-md px-4 py-2 transition-colors',
                'hover:bg-muted',
                option.value === value && 'bg-primary text-primary-foreground font-semibold'
              )}
              onClick={() => handleOptionClick(option.value)}
              role="option"
              aria-selected={option.value === value}
            >
              <div className="flex items-center gap-2">
                {option.value === value && <Check className="h-4 w-4" />}
                <span className="truncate">{option.label}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {errorMessage && (
        <p className="text-destructive mt-1.5 text-xs font-medium">{errorMessage}</p>
      )}
    </div>
  )
}

Select.displayName = 'Select'

export default Select
