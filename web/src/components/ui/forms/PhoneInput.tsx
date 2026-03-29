'use client'

import React, { forwardRef } from 'react'
import {
  PhoneInput as ReactInternationalPhone,
  PhoneInputProps as ReactPhoneInputProps,
} from 'react-international-phone'
import 'react-international-phone/style.css'
import { cn } from '@/lib/utils'

export interface PhoneInputProps extends Omit<ReactPhoneInputProps, 'onChange'> {
  label?: string
  error?: string | boolean
  required?: boolean
  containerClassName?: string
  onChange?: (value: string) => void
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      error,
      required,
      containerClassName,
      className,
      onChange,
      value,
      defaultCountry = 'es',
      ...rest
    },
    ref
  ) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="mb-2 block text-sm font-semibold text-(--foreground)">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <ReactInternationalPhone
            defaultCountry={defaultCountry}
            value={value}
            onChange={(phone) => onChange?.(phone)}
            inputRef={ref as React.MutableRefObject<HTMLInputElement>}
            inputProps={{
              className: cn(
                'w-full flex-1 rounded-r-xl border-2 border-l-0 border-(--primary)/20 bg-(--background) px-4 py-3 text-base text-(--foreground) transition-all focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 focus:outline-none placeholder:text-(--foreground)/50 disabled:cursor-not-allowed disabled:opacity-50'
              ),
              required,
              ...rest.inputProps,
            }}
            countrySelectorStyleProps={{
              buttonClassName: cn(
                'rounded-l-xl border-2 border-r border-(--primary)/20 bg-(--background) px-3 py-3 transition-all hover:bg-(--primary)/5 focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 focus:outline-none !h-auto'
              ),
              dropdownStyleProps: {
                className:
                  'rounded-xl border border-(--primary)/20 bg-(--card-bg) shadow-xl text-(--foreground)', // Z-index handled by library usually
              },
            }}
            className={cn('flex w-full', className)}
            {...rest}
          />
        </div>
        {error && typeof error === 'string' && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
export default PhoneInput
