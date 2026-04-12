'use client'

import { Controller, useForm } from 'react-hook-form'
import { type ContactFormData } from '@/lib/validations'
import { PhoneInput } from '@/components/ui'

type ResponsePreference = 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'INSTAGRAM'

interface ContactFieldProps {
  preference: ResponsePreference
  register: ReturnType<typeof useForm<ContactFormData>>['register']
  control: ReturnType<typeof useForm<ContactFormData>>['control']
  errors: ReturnType<typeof useForm<ContactFormData>>['formState']['errors']
}

const inputClass =
  'w-full rounded-xl border-2 border-(--primary)/20 bg-(--background) px-4 py-3 text-(--foreground) transition-all placeholder:text-(--foreground)/50 focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 focus:outline-none'

export function ContactField({ preference, register, control, errors }: ContactFieldProps) {
  if (preference === 'INSTAGRAM') {
    return (
      <div>
        <label
          htmlFor="instagramUser"
          className="mb-2 block text-sm font-semibold text-(--foreground)"
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
          <p className="mt-1 text-sm text-red-500">{errors.instagramUser.message}</p>
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
          <PhoneInput
            label="Tu teléfono *"
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.phone?.message}
          />
        )}
      />
    )
  }

  // EMAIL
  return (
    <div>
      <label htmlFor="email" className="mb-2 block text-sm font-semibold text-(--foreground)">
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
      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
    </div>
  )
}
