'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  error?: boolean | string
  name?: string
  id?: string
  searchable?: boolean
  clearable?: boolean
  label?: string
  /**
   * Variante visual. `default` usa los tokens genéricos `--public-select-*`.
   * `contact` usa los tokens específicos `--public-contact-select-*` para
   * matchear el look de los inputs del ContactForm.
   * Default: `'default'`.
   */
  variant?: 'default' | 'contact'
}

/**
 * Dropdown custom — NO usa el `<select>` nativo del browser.
 *
 * Estilos:
 * - `.public-select` (clase base) + `.public-select-dropdown` / `.public-select-option`
 *   / `.public-select-search` / `.public-select-error`
 * - Variante `contact`: agrega `.public-contact-select` (mismo prefijo que el resto
 *   del ContactForm) que re-mapea tokens a los de contact-field.
 */
export const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Selecciona una opción',
  disabled = false,
  className = '',
  error = false,
  name,
  id,
  searchable = false,
  clearable = false,
  label,
  variant = 'default',
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  const filteredOptions = options.filter((option) =>
    !searchable ? true : option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedOption = options.find((option) => option.value === value)

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined
  const variantClass = variant === 'contact' ? 'public-contact-select' : 'public-select'
  const dropdownVariantClass =
    variant === 'contact' ? 'public-contact-select-dropdown' : 'public-select-dropdown'
  const optionVariantClass =
    variant === 'contact' ? 'public-contact-select-option' : 'public-select-option'
  const errorVariantClass =
    variant === 'contact' ? 'public-contact-select-error' : 'public-select-error'

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {label && (
        <label htmlFor={id} className="public-contact-form-label mb-2 block text-sm font-semibold">
          {label}
        </label>
      )}
      <button
        type="button"
        className={cn(
          variantClass,
          'flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition-all sm:px-4',
          !disabled && 'cursor-pointer',
          disabled && 'cursor-not-allowed opacity-60'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        data-open={isOpen}
        data-state={hasError ? 'error' : undefined}
      >
        <span className="mr-2 min-w-0 flex-1 truncate">
          <span className={value ? '' : 'public-select-placeholder'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <div className="flex shrink-0 items-center gap-1">
          {clearable && value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
              }}
              className="hover:bg-muted rounded p-1"
              aria-label="Limpiar selección"
            >
              <X className="public-select-chevron h-4 w-4" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'public-select-chevron h-5 w-5 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </button>
      <input type="hidden" name={name} value={value} />

      {isOpen && (
        <ul
          className={cn(
            dropdownVariantClass,
            'absolute right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-xl border py-1 text-sm shadow-xl'
          )}
          role="listbox"
        >
          {searchable && (
            <li className="public-select-search sticky top-0 px-2 pt-1 pb-1">
              <input
                ref={inputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="public-select-search w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                placeholder="Buscar..."
                aria-label="Buscar opción"
                autoFocus
              />
            </li>
          )}
          {options.length === 0 && (
            <li className="text-muted-foreground px-4 py-2">Sin opciones</li>
          )}
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              className={cn(
                optionVariantClass,
                'mx-1 cursor-pointer rounded-lg px-4 py-2 transition-colors'
              )}
              onClick={() => handleOptionClick(option.value)}
              role="option"
              aria-selected={option.value === value}
              data-active={option.value === value}
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
        <p className={cn(errorVariantClass, 'mt-1 text-xs font-medium')}>{errorMessage}</p>
      )}
    </div>
  )
}

export default Select
