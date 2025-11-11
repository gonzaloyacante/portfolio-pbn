/**
 * UNIFIED FORM COMPONENTS
 * Portfolio PBN - Single source of truth for all form elements
 * 
 * This file consolidates all form-related components into one place:
 * - Input (with icons, validation, helper text)
 * - Textarea (with char count, auto-resize)
 * - Select (simple options array)
 * - Checkbox (with label integration)
 * - RadioGroup (with options array)
 * - Switch (with label and description)
 * - Button (with all variants, sizes, loading state)
 * - Card (with padding variants, hover effects)
 * - Badge (with semantic variants)
 * - EmptyState (with icon, title, description, action)
 * - Loading (with spinner and text)
 */

import { cn } from "@/lib/utils"
import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode, ButtonHTMLAttributes } from "react"
import { LucideIcon } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"

// ==================== INPUT ====================
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: LucideIcon
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon: Icon, fullWidth = true, ...props }, ref) => {
    return (
      <div className={cn("space-y-1.5", fullWidth && "w-full")}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600",
              "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-500 focus:ring-red-500",
              Icon && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

// ==================== TEXTAREA ====================
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  showCharCount?: boolean
  maxLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, fullWidth = true, showCharCount, maxLength, value, ...props }, ref) => {
    const charCount = value ? String(value).length : 0
    
    return (
      <div className={cn("space-y-1.5", fullWidth && "w-full")}>
        {label && (
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {showCharCount && maxLength && (
              <span className={cn(
                "text-xs",
                charCount > maxLength ? "text-red-500" : "text-gray-500 dark:text-gray-400"
              )}>
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          maxLength={maxLength}
          value={value}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "transition-all duration-200 resize-y",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

// ==================== SELECT ====================
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
  fullWidth?: boolean
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, fullWidth = true, placeholder, ...props }, ref) => {
    return (
      <div className={cn("space-y-1.5", fullWidth && "w-full")}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "transition-all duration-200 cursor-pointer",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
      </div>
    )
  }
)
Select.displayName = "Select"

// ==================== CHECKBOX ====================
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              "h-4 w-4 rounded border-gray-300 dark:border-gray-600",
              "text-blue-600 focus:ring-2 focus:ring-blue-500",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-500",
              className
            )}
            {...props}
          />
          {label && (
            <span className="text-sm text-gray-700 dark:text-gray-200 select-none">
              {label}
            </span>
          )}
        </label>
        {error && <p className="text-sm text-red-600 dark:text-red-400 ml-6">{error}</p>}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

// ==================== RADIO GROUP ====================
interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface RadioGroupProps {
  label?: string
  name: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  className?: string
}

export function RadioGroup({ label, name, options, value, onChange, error, className }: RadioGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700",
              "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
              value === option.value && "bg-blue-50 dark:bg-blue-950/30 border-blue-500",
              option.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={option.disabled}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </div>
              {option.description && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {option.description}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

// ==================== SWITCH ====================
interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <div className="flex-1">
          {label && (
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {label}
            </div>
          )}
          {description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </div>
          )}
        </div>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div className={cn(
            "w-11 h-6 rounded-full transition-colors",
            "bg-gray-200 dark:bg-gray-700",
            "peer-checked:bg-blue-600",
            "peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
            className
          )} />
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
        </div>
      </label>
    )
  }
)
Switch.displayName = "Switch"

// ==================== CARD ====================
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
  hover?: boolean
}

export function Card({ children, className, padding = "md", hover = false, ...props }: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-gray-800 shadow-sm",
        "transition-all duration-200",
        hover && "hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ==================== BUTTON ====================
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "link"
  size?: "sm" | "md" | "lg" | "icon"
  icon?: LucideIcon
  loading?: boolean
  fullWidth?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = "primary", size = "md", icon: Icon, loading, fullWidth, disabled, asChild = false, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow focus:ring-blue-500",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-sm hover:shadow focus:ring-gray-500",
      outline: "border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500",
      ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500",
      danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow focus:ring-red-500",
      link: "text-blue-600 hover:text-blue-700 hover:underline focus:ring-blue-500",
    }
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
      icon: "p-2",
    }

    const Comp = asChild ? Slot : "button"
    
    // When asChild, disabled must be passed through props, not directly
    const buttonProps = asChild 
      ? { ...props } 
      : { ...props, disabled: disabled || loading }

    return (
      <Comp
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...buttonProps}
      >
        {loading ? (
          <>
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          <>
            {Icon && <Icon className="h-4 w-4" />}
            {children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// ==================== BADGE ====================
interface BadgeProps {
  children: ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

// ==================== EMPTY STATE ====================
interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="mb-4 p-3 rounded-full bg-gray-100 dark:bg-gray-800">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm">{description}</p>}
      {action}
    </div>
  )
}

// ==================== LOADING ====================
export function Loading({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  )
}
