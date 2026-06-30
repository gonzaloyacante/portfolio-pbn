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
  /**
   * Se invoca cada vez que cambia el país seleccionado en el dropdown,
   * INCLUIDO el inicial al montar el componente (con el país por defecto).
   * El argumento es el dial code SIN el "+" (ej: "34", "54", "1").
   * El consumidor debe normalizarlo a "+34" antes de guardarlo si lo necesita.
   */
  onCountryChange?: (dialCode: string) => void
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
      onCountryChange,
    },
    _ref
  ) => {
    const [_focused, setFocused] = useState(false)
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
          <label className="public-contact-form-label mb-2 block text-sm font-semibold">
            {label}
            {required && <span className="public-contact-error ml-1">*</span>}
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
            onCountryChange?.(meta.country.dialCode)
          }}
          inputProps={{
            required,
            placeholder,
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            className: cn(
              'w-full flex-1 !rounded-r-xl !border !border-l-0 !border-[var(--public-contact-field-border)] !bg-[var(--public-contact-field-bg)] !px-4 !py-3 !text-base !text-[var(--public-contact-field-text)] transition-all focus:!border-[var(--public-contact-field-border)] focus:!outline-none placeholder:!text-[var(--public-contact-field-placeholder)] disabled:!cursor-not-allowed disabled:!opacity-50'
            ),
          }}
          countrySelectorStyleProps={{
            buttonClassName: cn(
              '!rounded-l-xl !border !border-r-0 !border-[var(--public-contact-field-border)] !bg-[var(--public-contact-field-bg)] !px-3 !py-3 transition-all hover:!bg-[var(--public-contact-option-active-bg)] focus:!outline-none !h-auto'
            ),
            dropdownStyleProps: {
              style: { width: dropdownWidth, maxHeight: '300px' },
              className:
                '!rounded-xl !border !border-[var(--public-contact-field-border)] !bg-[var(--public-contact-field-bg)] !shadow-xl !text-[var(--public-contact-field-text)]',
              listItemStyle: { fontSize: '0.95rem', minHeight: '40px' },
              listItemClassName:
                '!text-[var(--public-contact-field-text)] hover:!bg-[var(--public-contact-option-active-bg)] !transition-colors',
              listItemSelectedClassName:
                '!bg-[var(--public-contact-option-active-bg)] !text-[var(--public-contact-option-active-text)]',
              listItemFocusedClassName: '!bg-[var(--public-contact-option-active-bg)]',
              listItemFlagStyle: { fontSize: '1.3rem', marginRight: '10px' },
              listItemDialCodeClassName: '!text-[var(--public-contact-field-placeholder)]',
            },
          }}
          dialCodePreviewStyleProps={{
            className: cn(
              '!border-y !border-x-0 !border-[var(--public-contact-field-border)] !bg-[var(--public-contact-field-bg)] !px-2 !text-base !text-[var(--public-contact-field-text)] transition-all'
            ),
          }}
          className={cn('flex w-full', className)}
        />
        {error && typeof error === 'string' && (
          <p className="public-contact-error mt-1 text-sm">{error}</p>
        )}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
export default PhoneInput
