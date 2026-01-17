'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { sendContactEmail } from '@/actions/contact.actions'
import { Button } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { Mail, Phone, MessageCircle, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Response preference type
type ResponsePreference = 'EMAIL' | 'PHONE' | 'WHATSAPP'

// Contact form schema with conditional phone validation
const contactFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  responsePreference: z.enum(['EMAIL', 'PHONE', 'WHATSAPP']),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar la política de privacidad',
  }),
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface ContactFormProps {
  // Labels (all from DB via ContactSettings)
  formTitle?: string | null
  nameLabel?: string | null
  emailLabel?: string | null
  phoneLabel?: string | null
  messageLabel?: string | null
  preferenceLabel?: string | null
  submitLabel?: string | null
  successTitle?: string | null
  successMessage?: string | null
  sendAnotherLabel?: string | null
}

export default function ContactForm({
  formTitle,
  nameLabel,
  emailLabel,
  phoneLabel,
  messageLabel,
  preferenceLabel,
  submitLabel,
  successTitle,
  successMessage,
  sendAnotherLabel,
}: ContactFormProps) {
  const { show } = useToast()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      responsePreference: 'EMAIL',
      privacy: false,
    },
  })

  const responsePreference = watch('responsePreference')

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Validate phone if preference requires it
      if ((data.responsePreference === 'PHONE' || data.responsePreference === 'WHATSAPP') && !data.phone?.trim()) {
        show({ type: 'error', message: 'Por favor, ingresa tu teléfono para poder contactarte' })
        return
      }

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('phone', data.phone || '')
      formData.append('message', data.message)
      formData.append('responsePreference', data.responsePreference)
      formData.append('privacy', data.privacy ? 'on' : 'off')

      const result = await sendContactEmail(formData)

      if (result.success) {
        setSubmitted(true)
        reset()
      } else {
        show({ type: 'error', message: result.message || 'Error al enviar mensaje' })
      }
    } catch {
      show({ type: 'error', message: 'Error inesperado. Intenta de nuevo.' })
    }
  }

  const handleSendAnother = () => {
    setSubmitted(false)
    reset()
  }

  const setPreference = (pref: ResponsePreference) => {
    setValue('responsePreference', pref)
  }

  // Success State
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[2.5rem] bg-[var(--card-bg)] p-8 text-center shadow-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <CheckCircle2 size={64} className="text-[var(--primary)]" />
        </motion.div>
        <h3 className="mb-3 font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--foreground)]">
          {successTitle || '¡Mensaje enviado!'}
        </h3>
        <p className="mb-6 text-[var(--text-body)]">
          {successMessage || 'Gracias por contactarme. Te responderé lo antes posible.'}
        </p>
        <Button onClick={handleSendAnother} variant="outline" className="rounded-xl">
          {sendAnotherLabel || 'Enviar otro mensaje'}
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[2.5rem] bg-[var(--card-bg)] p-8 shadow-lg"
    >
      <h2 className="mb-6 font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--foreground)]">
        {formTitle || 'Envíame un mensaje'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
              {nameLabel || 'Tu nombre'} *
            </label>
            <input
              {...register('name')}
              id="name"
              className="w-full rounded-xl border-2 border-[var(--primary)]/20 bg-[var(--background)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/50 transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              placeholder="Tu nombre completo"
              autoComplete="name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
              {emailLabel || 'Tu email'} *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full rounded-xl border-2 border-[var(--primary)]/20 bg-[var(--background)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/50 transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              placeholder="tu@email.com"
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
            {phoneLabel || 'Tu teléfono'}
            {(responsePreference === 'PHONE' || responsePreference === 'WHATSAPP') && ' *'}
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            className="w-full rounded-xl border-2 border-[var(--primary)]/20 bg-[var(--background)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/50 transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            placeholder="+34 600 000 000"
            autoComplete="tel"
          />
        </div>

        {/* Response Preference Selector */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-[var(--foreground)]">
            {preferenceLabel || '¿Cómo preferís que te contacte?'} *
          </label>
          <div className="grid grid-cols-3 gap-3">
            <PreferenceButton
              active={responsePreference === 'EMAIL'}
              onClick={() => setPreference('EMAIL')}
              icon={<Mail className="h-5 w-5" />}
              label="Email"
            />
            <PreferenceButton
              active={responsePreference === 'PHONE'}
              onClick={() => setPreference('PHONE')}
              icon={<Phone className="h-5 w-5" />}
              label="Teléfono"
            />
            <PreferenceButton
              active={responsePreference === 'WHATSAPP'}
              onClick={() => setPreference('WHATSAPP')}
              icon={<MessageCircle className="h-5 w-5" />}
              label="WhatsApp"
            />
          </div>
          <AnimatePresence>
            {(responsePreference === 'PHONE' || responsePreference === 'WHATSAPP') && !watch('phone') && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-2 text-xs text-amber-600"
              >
                * Para contactarte por {responsePreference === 'PHONE' ? 'teléfono' : 'WhatsApp'}, necesitamos tu número
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-semibold text-[var(--foreground)]">
            {messageLabel || 'Mensaje'} *
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={5}
            className="w-full resize-none rounded-xl border-2 border-[var(--primary)]/20 bg-[var(--background)] px-4 py-3 text-[var(--text-body)] placeholder:text-[var(--text-body)]/50 transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
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
            className="mt-1 h-4 w-4 rounded border-2 border-[var(--primary)]/30 text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          />
          <label htmlFor="privacy" className="text-sm text-[var(--text-body)]/80">
            He leído y acepto la{' '}
            <a
              href="/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] underline hover:no-underline"
            >
              Política de Privacidad
            </a>
            . <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.privacy && <p className="text-sm text-red-500">{errors.privacy.message}</p>}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[var(--primary)] py-4 text-[var(--background)] transition-all hover:opacity-90"
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
              {submitLabel || 'Enviar mensaje'}
            </span>
          )}
        </Button>

        <p className="text-center text-xs text-[var(--text-body)]/60">* Campos obligatorios</p>
      </form>
    </motion.div>
  )
}

// Preference Button Component
function PreferenceButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${active
        ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
        : 'border-[var(--primary)]/20 bg-[var(--background)] text-[var(--text-body)] hover:border-[var(--primary)]/50'
        }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}
