'use client'

import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/validations'
import { sendContactEmail } from '@/actions/user/contact'
import { Button, PhoneInput } from '@/components/ui'
import { showToast } from '@/lib/toast'
import { Mail, Phone, MessageCircle, Send, Loader2, CheckCircle2, Instagram } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

type ResponsePreference = 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'INSTAGRAM'

const PREFERENCES: { id: ResponsePreference; icon: React.ReactNode; label: string }[] = [
  { id: 'INSTAGRAM', icon: <Instagram className="h-5 w-5" />, label: 'Instagram' },
  { id: 'WHATSAPP', icon: <MessageCircle className="h-5 w-5" />, label: 'WhatsApp' },
  { id: 'PHONE', icon: <Phone className="h-5 w-5" />, label: 'Teléfono' },
  { id: 'EMAIL', icon: <Mail className="h-5 w-5" />, label: 'Email' },
]

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const searchParams = useSearchParams()
  const serviceName = searchParams.get('service')
  const { executeRecaptcha } = useGoogleReCaptcha()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      responsePreference: 'INSTAGRAM',
      instagramUser: '',
      privacy: false,
    },
  })

  useEffect(() => {
    if (serviceName) {
      setValue(
        'message',
        `Hola, estoy interesado/a en recibir más información sobre el servicio de "${serviceName}".`
      )
    }
  }, [serviceName, setValue])

  const responsePreference = useWatch({ control, name: 'responsePreference' })

  const onSubmit = async (data: ContactFormData) => {
    try {
      const token = executeRecaptcha ? await executeRecaptcha('contact_form') : ''

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email ?? '')
      formData.append('phone', data.phone || '')
      formData.append('message', data.message)
      formData.append('responsePreference', data.responsePreference)
      formData.append('instagramUser', data.instagramUser || '')
      formData.append('privacy', data.privacy ? 'on' : 'off')
      formData.append('recaptchaToken', token)

      const result = await sendContactEmail(formData)

      if (result.success) {
        setSubmitted(true)
        reset()
      } else {
        showToast.error(result.message || 'Error al enviar mensaje')
      }
    } catch {
      showToast.error('Error inesperado. Intenta de nuevo.')
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[2.5rem] bg-(--card) p-8 text-center shadow-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <CheckCircle2 size={64} className="text-(--primary)" />
        </motion.div>
        <h3 className="font-heading mb-3 text-2xl font-bold text-(--foreground)">
          ¡Mensaje enviado!
        </h3>
        <p className="mb-6 text-(--foreground)/80">
          Gracias por contactarme. Te responderé lo antes posible.
        </p>
        <Button onClick={() => { setSubmitted(false); reset() }} variant="outline" className="rounded-xl">
          Enviar otro mensaje
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[2.5rem] bg-(--card) p-8 shadow-lg"
    >
      <h2 className="font-heading mb-6 text-2xl font-bold text-(--foreground)">
        Envíame un mensaje
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold text-(--foreground)">
            Tu nombre *
          </label>
          <input
            {...register('name')}
            id="name"
            className="w-full rounded-xl border-2 border-(--primary)/20 bg-(--background) px-4 py-3 text-(--foreground) transition-all placeholder:text-(--foreground)/50 focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 focus:outline-none"
            placeholder="Tu nombre completo"
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Response Preference Selector */}
        <fieldset>
          <legend className="mb-3 block text-sm font-semibold text-(--foreground)">
            ¿Cómo preferís que te contacte? *
          </legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PREFERENCES.map(({ id, icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setValue('responsePreference', id, { shouldValidate: false })}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                  responsePreference === id
                    ? 'border-(--primary) bg-(--primary)/10 text-(--primary)'
                    : 'border-(--primary)/20 bg-(--background) text-(--foreground) hover:border-(--primary)/50'
                }`}
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Animated conditional contact field — opacity-only to prevent layout shift */}
          <AnimatePresence mode="wait">
            <motion.div
              key={responsePreference}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-3"
            >
              <ContactField
                preference={responsePreference}
                register={register}
                control={control}
                errors={errors}
              />
            </motion.div>
          </AnimatePresence>
        </fieldset>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-semibold text-(--foreground)">
            Mensaje *
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={5}
            className="w-full resize-none rounded-xl border-2 border-(--primary)/20 bg-(--background) px-4 py-3 text-(--foreground) transition-all placeholder:text-(--foreground)/50 focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 focus:outline-none"
            placeholder="Escribe tu mensaje aquí..."
            autoComplete="off"
          />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
        </div>

        {/* Privacy Checkbox */}
        <div className="flex items-start gap-3">
          <input
            {...register('privacy')}
            type="checkbox"
            id="privacy"
            className="mt-1 h-4 w-4 rounded border-2 border-(--primary)/30 text-(--primary) focus:ring-2 focus:ring-(--primary)/20"
          />
          <label htmlFor="privacy" className="text-sm text-(--foreground)/80">
            He leído y acepto la{' '}
            <Link
              href={ROUTES.public.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--primary) underline hover:no-underline"
            >
              Política de Privacidad
            </Link>
            . <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.privacy && <p className="text-sm text-red-500">{errors.privacy.message}</p>}

        {/* Submit — uses Button directly (RHF form, not Server Action) */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-(--primary) py-4 text-(--background) transition-all hover:opacity-90"
          size="lg"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={20} className="animate-spin" />
              Enviando...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Send size={20} />
              Enviar mensaje
            </span>
          )}
        </Button>

        <p className="text-center text-xs text-(--foreground)/60">* Campos obligatorios</p>
      </form>
    </motion.div>
  )
}

const inputClass =
  'w-full rounded-xl border-2 border-(--primary)/20 bg-(--background) px-4 py-3 text-(--foreground) transition-all placeholder:text-(--foreground)/50 focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20 focus:outline-none'

function ContactField({
  preference,
  register,
  control,
  errors,
}: {
  preference: ResponsePreference
  register: ReturnType<typeof useForm<ContactFormData>>['register']
  control: ReturnType<typeof useForm<ContactFormData>>['control']
  errors: ReturnType<typeof useForm<ContactFormData>>['formState']['errors']
}) {
  if (preference === 'INSTAGRAM') {
    return (
      <div>
        <label htmlFor="instagramUser" className="mb-2 block text-sm font-semibold text-(--foreground)">
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
