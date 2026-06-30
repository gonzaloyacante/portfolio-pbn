'use client'

import { useState, useRef, useEffect, useId, useLayoutEffect } from 'react'
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
  // Solo fallbacks neutros. NO incluimos `border` porque Tailwind utility
  // aplica `border-color: #e5e7eb` (gris) que pisa el `border-color` del
  // `className` del caller. El caller controla TODO lo relativo a border.
  default: 'bg-background text-foreground focus:ring-2 focus:ring-ring/20',
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
  // Coordenadas del dropdown relativas al viewport. Se recalculan al abrir
  // y se actualizan en scroll/resize para que `position: fixed` posicione
  // correctamente sin importar el stacking context del padre (framer-motion,
  // transforms, overflow:hidden de los forms públicos).
  const [dropdownPos, setDropdownPos] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const triggerId = id || `select-${generatedId}`
  const listboxId = `${triggerId}-listbox`

  const updatePosition = () => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    setDropdownPos({
      top: rect.bottom + 4, // 4px = mt-1
      left: rect.left,
      width: rect.width,
    })
  }

  useLayoutEffect(() => {
    if (!isOpen) {
      setDropdownPos(null)
      return
    }
    updatePosition()
    const handleScrollOrResize = () => updatePosition()
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const inTrigger = triggerRef.current?.contains(target)
      const inDropdown = containerRef.current?.contains(target)
      if (!inTrigger && !inDropdown) {
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
    <div ref={containerRef} className={cn('relative w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={triggerId}
          className="public-contact-form-label mb-2 block text-sm font-semibold"
        >
          {label}
          {required && <span className="public-contact-error ml-1">*</span>}
        </label>
      )}
      <button
        ref={triggerRef}
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
        <span className="min-w-0 flex-1 truncate !text-[var(--public-contact-field-text)]">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="!text-[var(--public-contact-field-placeholder)]">{placeholder}</span>
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

      {isOpen && dropdownPos && (
        <ul
          id={listboxId}
          className={cn(
            '!border !border-[var(--public-contact-field-border)] !bg-[var(--public-contact-field-bg)] !text-[var(--public-contact-field-text)]',
            'fixed z-50 max-h-60 overflow-auto rounded-xl text-base shadow-xl'
          )}
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
          }}
          role="listbox"
        >
          {searchable && (
            <li className="sticky top-0 bg-[var(--public-contact-field-bg)] px-2 pt-1 pb-1">
              <input
                ref={inputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md !border !border-[var(--public-contact-field-border)] !bg-[var(--public-contact-field-bg)] px-3 py-2 text-sm !text-[var(--public-contact-field-text)] placeholder:!text-[var(--public-contact-field-placeholder)] focus:ring-2 focus:ring-(--primary)/20 focus:outline-none"
                placeholder="Buscar..."
                aria-label="Buscar opción"
                autoFocus
              />
            </li>
          )}
          {filteredOptions.length === 0 && (
            <li className="px-4 py-2 text-[var(--public-contact-field-placeholder)]">
              Sin opciones
            </li>
          )}
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              className={cn(
                'cursor-pointer px-4 py-3 !text-[var(--public-contact-field-text)] transition-colors first:rounded-t-[calc(theme(borderRadius.xl)-2px)] last:rounded-b-[calc(theme(borderRadius.xl)-2px)]',
                'hover:bg-[var(--public-contact-option-active-bg)]',
                option.value === value &&
                  '!bg-[var(--public-contact-option-active-bg)] !font-semibold !text-[var(--public-contact-option-active-text)]'
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

      {errorMessage && <p className="public-contact-error mt-1 text-sm">{errorMessage}</p>}
    </div>
  )
}

Select.displayName = 'Select'

export default Select
