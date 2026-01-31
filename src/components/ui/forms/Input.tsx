'use client'

import React, { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, X } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input */
  label?: string
  /** Error message or boolean to show error state */
  error?: boolean | string
  /** Help text displayed below the input */
  helpText?: string
  /** Icon displayed on the left side */
  leftIcon?: React.ReactNode
  /** Icon displayed on the right side */
  rightIcon?: React.ReactNode
  /** Visual variant */
  variant?: 'default' | 'filled' | 'ghost'
  /** Size variant */
  inputSize?: 'sm' | 'md' | 'lg'
  /** Callback when clear button is clicked */
  onClear?: () => void
  /** Show password toggle button for password inputs */
  allowPasswordToggle?: boolean
  /** Mark field as required (shows asterisk) */
  required?: boolean
  /** Container class name */
  containerClassName?: string
}

const sizeClasses = {
  sm: 'h-8 text-xs px-2.5',
  md: 'h-10 text-sm px-3',
  lg: 'h-12 text-base px-4',
}

const variantClasses = {
  default:
    'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20',
  filled:
    'border-0 bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20',
  ghost:
    'border-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-primary/20',
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helpText,
      leftIcon,
      rightIcon,
      variant = 'default',
      inputSize = 'md',
      onClear,
      allowPasswordToggle,
      required,
      className = '',
      containerClassName,
      value,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId()
    const {
      id: restId,
      type: restType,
      onChange: restOnChange,
      ['aria-label']: restAria,
      disabled,
      ...restProps
    } = rest || {}

    const id = restId || `input-${generatedId}`
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = restType === 'password'
    const showToggle = isPassword && allowPasswordToggle
    const effectiveType = showToggle && showPassword ? 'text' : restType
    const ariaLabel = restAria || (!label && isPassword ? 'password' : undefined)

    const hasLeftIcon = !!leftIcon
    const hasRightIcon = !!rightIcon
    const showClearButton = onClear && value && !disabled

    const leftPadding = hasLeftIcon ? 'pl-10' : ''
    const rightPaddingNeeds = [
      hasRightIcon && 'pr-10',
      showClearButton && 'pr-10',
      showToggle && 'pr-12',
      showClearButton && showToggle && 'pr-20',
    ].filter(Boolean)
    const rightPadding = rightPaddingNeeds[rightPaddingNeeds.length - 1] || ''

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {hasLeftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            type={effectiveType}
            value={value}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-invalid={!!error}
            aria-describedby={helpText || error ? `${id}-help` : undefined}
            aria-required={required}
            onChange={(e) => {
              if (typeof restOnChange === 'function') {
                restOnChange(e)
              }
            }}
            className={cn(
              'w-full rounded-lg transition-all duration-200 outline-none',
              'placeholder:text-gray-400',
              'disabled:cursor-not-allowed disabled:opacity-50',
              sizeClasses[inputSize],
              variantClasses[variant],
              leftPadding,
              rightPadding,
              error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
              className
            )}
            {...restProps}
          />

          {hasRightIcon && !showClearButton && !showToggle && (
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {rightIcon}
            </span>
          )}

          {showClearButton && (
            <button
              type="button"
              aria-label="Limpiar"
              onClick={onClear}
              className={cn(
                'absolute inset-y-0 flex items-center justify-center p-0',
                'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200',
                'transition-colors focus:outline-none',
                showToggle ? 'right-10' : 'right-3'
              )}
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {showToggle && (
            <button
              type="button"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 transition-colors hover:text-gray-600 focus:outline-none dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>

        {error && typeof error === 'string' && (
          <p id={`${id}-help`} className="mt-1.5 text-xs font-medium text-red-500">
            {error}
          </p>
        )}

        {helpText && !error && (
          <p id={`${id}-help`} className="mt-1.5 text-xs text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
