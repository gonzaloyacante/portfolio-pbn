'use client'

import React from 'react'
import PhoneInputLib from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { cn } from '@/lib/utils'
import type { Country, Value } from 'react-phone-number-input'

export interface PhoneInputProps {
  label?: string
  error?: string | boolean
  required?: boolean
  containerClassName?: string
  className?: string
  value?: string
  defaultCountry?: Country
  onChange?: (value: string) => void
}

export const PhoneInput = ({
  label,
  error,
  required,
  containerClassName,
  className,
  value,
  defaultCountry = 'ES',
  onChange,
}: PhoneInputProps) => {
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-(--foreground)">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <PhoneInputLib
        international
        defaultCountry={defaultCountry}
        value={(value as Value) || undefined}
        onChange={(v) => onChange?.(v ?? '')}
        className={cn('phone-input-container', className)}
      />
      {error && typeof error === 'string' && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

PhoneInput.displayName = 'PhoneInput'
export default PhoneInput
