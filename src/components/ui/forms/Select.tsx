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
}

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

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {label && (
        <label htmlFor={id} className="text-foreground mb-2 block text-sm font-medium">
          {label}
        </label>
      )}
      <button
        type="button"
        className={cn(
          'flex h-10 w-full items-center justify-between px-3 py-2 text-left text-sm transition-all duration-200',
          'bg-background rounded-lg border',
          'border-input',
          'focus:ring-ring/20 focus:border-ring focus:ring-2 focus:outline-none',
          disabled && 'cursor-not-allowed opacity-60',
          error && 'border-destructive focus:border-destructive focus:ring-destructive/20'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="mr-2 min-w-0 flex-1 truncate">
          <span className={value ? '' : 'text-muted-foreground'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <div className="flex items-center gap-1">
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
              <X className="text-muted-foreground h-4 w-4" />
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
          className="border-border bg-popover absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border py-1 text-sm shadow-lg"
          role="listbox"
        >
          {searchable && (
            <li className="bg-background sticky top-0 px-2 pb-1">
              <input
                ref={inputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-ring/20 border-input bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
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
                'mx-1 cursor-pointer rounded px-4 py-2 transition-colors',
                option.value === value
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'hover:bg-muted'
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
      {error && typeof error === 'string' && (
        <p className="text-destructive mt-1 text-xs font-medium">{error}</p>
      )}
    </div>
  )
}

export default Select
