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
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <button
        type="button"
        className={cn(
          'flex h-10 w-full items-center justify-between px-3 py-2 text-left text-sm transition-all duration-200',
          'rounded-lg border bg-white dark:bg-gray-800',
          'border-gray-300 dark:border-gray-600',
          'focus:ring-primary/20 focus:border-primary focus:ring-2 focus:outline-none',
          disabled && 'cursor-not-allowed opacity-60',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-200'
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="mr-2 min-w-0 flex-1 truncate">
          <span className={value ? '' : 'text-gray-400'}>
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
              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Limpiar selección"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'h-5 w-5 text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </button>
      <input type="hidden" name={name} value={value} />

      {isOpen && (
        <ul
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-800"
          role="listbox"
        >
          {searchable && (
            <li className="sticky top-0 bg-white px-2 pb-1 dark:bg-gray-800">
              <input
                ref={inputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-primary/20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none dark:border-gray-600"
                placeholder="Buscar..."
                aria-label="Buscar opción"
                autoFocus
              />
            </li>
          )}
          {options.length === 0 && <li className="px-4 py-2 text-gray-400">Sin opciones</li>}
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              className={cn(
                'mx-1 cursor-pointer rounded px-4 py-2 transition-colors',
                option.value === value
                  ? 'bg-primary font-semibold text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
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
        <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  )
}

export default Select
