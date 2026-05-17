'use client'

import { useForm } from 'react-hook-form'
import { type ContactFormData } from '@/lib/validations'

type ResponsePreference = 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'INSTAGRAM'

interface ContactFieldProps {
  preference: ResponsePreference
  register: ReturnType<typeof useForm<ContactFormData>>['register']
  errors: ReturnType<typeof useForm<ContactFormData>>['formState']['errors']
}

const inputClass = 'public-contact-field w-full rounded-xl px-4 py-3 transition-all'

export function ContactField({ preference, register, errors }: ContactFieldProps) {
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
      <div>
        <label
          htmlFor="phone"
          className="public-contact-form-label mb-2 block text-sm font-semibold"
        >
          Tu teléfono *
        </label>
        <input
          {...register('phone')}
          type="tel"
          inputMode="tel"
          id="phone"
          className={inputClass}
          placeholder="+34 612 345 678"
          autoComplete="tel"
        />
        {errors.phone && (
          <p className="public-contact-error mt-1 text-sm">{errors.phone.message}</p>
        )}
      </div>
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
