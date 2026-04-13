'use client'

import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import {
  PhoneInput as ReactInternationalPhone,
  getActiveFormattingMask,
  getCountry,
} from 'react-international-phone'
import type { ParsedCountry } from 'react-international-phone'
import 'react-international-phone/style.css'
import { cn } from '@/lib/utils'

function maskToPlaceholder(mask: string): string {
  let digit = 6
  return mask.replace(/\./g, () => {
    const d = digit.toString()
    digit = digit >= 9 ? 1 : digit + 1
    return d
  })
}

export interface PhoneInputProps {
  label?: string
  error?: string | boolean
  required?: boolean
  containerClassName?: string
  className?: string
  value?: string
  defaultCountry?: string
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
      value,
      defaultCountry = 'es',
      onChange,
    },
    _ref
  ) => {
    const [focused, setFocused] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [dropdownWidth, setDropdownWidth] = useState(320)
    const [currentCountry, setCurrentCountry] = useState<ParsedCountry | undefined>(() =>
      getCountry({ field: 'iso2', value: defaultCountry })
    )

    useLayoutEffect(() => {
      if (wrapperRef.current) {
        setDropdownWidth(wrapperRef.current.offsetWidth)
      }
    }, [])

    const placeholder = currentCountry
      ? maskToPlaceholder(getActiveFormattingMask({ phone: '', country: currentCountry }))
      : 'Ej: 612 345 678'

    return (
      <div ref={wrapperRef} className={cn('w-full', containerClassName)}>
        {label && (
          <label className="mb-2 block text-sm font-semibold text-(--foreground)">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <ReactInternationalPhone
          defaultCountry={defaultCountry}
          value={value}
          disableDialCodeAndPrefix
          showDisabledDialCodeAndPrefix
          onChange={(phone, meta) => {
            setCurrentCountry(meta.country)
            onChange?.(phone)
          }}
          inputProps={{
            required,
            placeholder,
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            className: cn(
              'w-full flex-1 !rounded-r-xl !border-2 !border-l-0 !border-(--primary)/20 !bg-(--background) !px-4 !py-3 !text-base !text-(--foreground) transition-all focus:!border-(--primary) focus:!ring-2 focus:!ring-(--primary)/20 focus:!outline-none placeholder:!text-(--foreground)/40 disabled:!cursor-not-allowed disabled:!opacity-50'
            ),
          }}
          countrySelectorStyleProps={{
            buttonClassName: cn(
              '!rounded-l-xl !border-2 !border-r-0 !bg-(--background) !px-3 !py-3 transition-all hover:!bg-(--primary)/5 focus:!outline-none !h-auto',
              focused ? '!border-(--primary)' : '!border-(--primary)/20'
            ),
            dropdownStyleProps: {
              style: { width: dropdownWidth, maxHeight: '300px' },
              className:
                '!rounded-xl !border !border-(--primary)/20 !bg-(--card) !shadow-xl !text-(--foreground)',
              listItemStyle: { fontSize: '0.95rem', minHeight: '40px' },
              listItemClassName: '!text-(--foreground) hover:!bg-muted/80 !transition-colors',
              listItemSelectedClassName: '!bg-(--primary)/10 !text-(--primary)',
              listItemFocusedClassName: '!bg-muted/80',
              listItemFlagStyle: { fontSize: '1.3rem', marginRight: '10px' },
              listItemDialCodeClassName: '!text-(--foreground)/60',
            },
          }}
          dialCodePreviewStyleProps={{
            className: cn(
              '!border-y-2 !border-x-0 !bg-(--background) !px-2 !text-base !text-(--foreground) transition-all',
              focused ? '!border-(--primary)' : '!border-(--primary)/20'
            ),
          }}
          className={cn('flex w-full', className)}
        />
        {error && typeof error === 'string' && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
export default PhoneInput
