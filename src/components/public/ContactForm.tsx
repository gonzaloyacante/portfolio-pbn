'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/validations'
import { sendContactEmail } from '@/actions/contact.actions'
import { Button } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'

interface ContactFormProps {
  formTitle?: string
  successMessage?: string
}

export default function ContactForm({ formTitle, successMessage }: ContactFormProps) {
  const { show } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      privacy: false, // Initial value false, validation requires true
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Create FormData to keep compatibility with server action if it expects FormData
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('message', data.message)
      formData.append('privacy', data.privacy ? 'on' : 'off')

      const result = await sendContactEmail(formData)

      if (result.success) {
        show({
          type: 'success',
          message: successMessage || result.message || '¡Gracias! Tu mensaje ha sido enviado.',
        })
        reset()
      } else {
        show({ type: 'error', message: result.message || 'Error al enviar mensaje' })
      }
    } catch {
      show({ type: 'error', message: 'Error inesperado. Intenta de nuevo.' })
    }
  }

  return (
    <div className="dark:bg-purple-dark/30 rounded-4xl bg-white p-8 shadow-lg">
      <h2 className="font-primary text-name mb-6 text-2xl font-bold">
        {formTitle || 'Envíame un mensaje'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="text-body-text mb-2 block font-medium">
            Nombre completo
          </label>
          <input
            {...register('name')}
            id="name"
            className="border-navlink-bg/20 bg-pink-light text-body-text placeholder:text-body-text/40 focus:border-navlink-bg focus:ring-navlink-bg/20 w-full rounded-2xl border-2 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="Tu nombre"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="text-body-text mb-2 block font-medium">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="border-navlink-bg/20 bg-pink-light text-body-text placeholder:text-body-text/40 focus:border-navlink-bg focus:ring-navlink-bg/20 w-full rounded-2xl border-2 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="tu@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="message" className="text-body-text mb-2 block font-medium">
            Mensaje
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={6}
            className="border-navlink-bg/20 bg-pink-light text-body-text placeholder:text-body-text/40 focus:border-navlink-bg focus:ring-navlink-bg/20 w-full resize-none rounded-2xl border-2 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="Escribe tu mensaje aquí..."
          />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
        </div>

        {/* Checkbox de Política de Privacidad (GDPR) */}
        <div>
          <div className="flex items-start gap-3">
            <input
              {...register('privacy')}
              type="checkbox"
              id="privacy"
              className="border-navlink-bg/30 focus:ring-navlink-bg/20 text-navlink-bg mt-1 h-4 w-4 rounded border-2 focus:ring-2"
            />
            <label htmlFor="privacy" className="text-body-text/80 text-sm">
              He leído y acepto la{' '}
              <a
                href="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navlink-bg underline hover:no-underline"
              >
                Política de Privacidad
              </a>
              . Consiento el tratamiento de mis datos personales para responder a mi consulta.{' '}
              <span className="text-red-600 dark:text-red-400">*</span>
            </label>
          </div>
          {errors.privacy && <p className="mt-1 text-sm text-red-500">{errors.privacy.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </Button>
      </form>
    </div>
  )
}
