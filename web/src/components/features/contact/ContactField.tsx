'use client'

import { Controller, useForm, type UseFormSetValue } from 'react-hook-form'
import { type ContactFormData } from '@/lib/validations'
import { PhoneInput } from '@/components/ui'

type ResponsePreference = 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'INSTAGRAM'

interface ContactFieldProps {
  preference: ResponsePreference
  register: ReturnType<typeof useForm<ContactFormData>>['register']
  control: ReturnType<typeof useForm<ContactFormData>>['control']
  setValue: UseFormSetValue<ContactFormData>
  errors: ReturnType<typeof useForm<ContactFormData>>['formState']['errors']
}

const inputClass = 'public-contact-field w-full rounded-xl px-4 py-3 transition-all'

export function ContactField({
  preference,
  register,
  control,
  setValue,
  errors,
}: ContactFieldProps) {
  if (preference === 'INSTAGRAM') {
    return (
      <div>
        <label
          htmlFor="instagramUser"
          className="public-contact-form-label mb-2 block text-sm font-semibold"
        >
          Tu usuario de Instagram *
        </label>
        <input
          {...register('instagramUser')}
          id="instagramUser"
          className={inputClass}
          placeholder="@tu_usuario"
          autoComplete="off"
        />
        {errors.instagramUser && (
          <p className="public-contact-error mt-1 text-sm">{errors.instagramUser.message}</p>
        )}
      </div>
    )
  }

  if (preference === 'WHATSAPP' || preference === 'PHONE') {
    return (
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <div className="space-y-1">
            <PhoneInput
              label="Tu teléfono *"
              value={field.value || ''}
              onChange={field.onChange}
              onCountryChange={(dialCode) => {
                // La librería emite el dialCode SIN el "+" (ej: "34").
                // Lo normalizamos a "+34" antes de setearlo en el form
                // para que Zod (/^\+\d{1,4}$/) acepte.
                const normalized = dialCode?.startsWith('+') ? dialCode : `+${dialCode}`
                setValue('countryCode', normalized, { shouldValidate: true, shouldDirty: true })
              }}
            />
            {errors.phone && (
              <p className="public-contact-error mt-1 text-sm">{errors.phone?.message}</p>
            )}
            {errors.countryCode && (
              <p className="public-contact-error mt-1 text-sm">{errors.countryCode.message}</p>
            )}
          </div>
        )}
      />
    )
  }

  // EMAIL
  return (
    <div>
      <label htmlFor="email" className="public-contact-form-label mb-2 block text-sm font-semibold">
        Tu email *
      </label>
      <input
        {...register('email')}
        type="email"
        inputMode="email"
        id="email"
        className={inputClass}
        placeholder="tu@email.com"
        autoComplete="email"
      />
      {errors.email && <p className="public-contact-error mt-1 text-sm">{errors.email.message}</p>}
    </div>
  )
}
