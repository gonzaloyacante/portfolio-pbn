'use client'

import { useState } from 'react'
import { sendContactEmail } from '@/actions/contact.actions'
import Button from '@/components/ui/Button'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await sendContactEmail(formData)

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        // Reset form
        e.currentTarget.reset()
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error inesperado. Intenta de nuevo.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="dark:bg-purple-dark/30 rounded-4xl bg-white p-8 shadow-lg">
      <h2 className="font-primary text-name mb-6 text-2xl font-bold">Envíame un mensaje</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="text-body-text mb-2 block font-medium">
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            className="border-navlink-bg/20 bg-pink-light text-body-text placeholder:text-body-text/40 focus:border-navlink-bg focus:ring-navlink-bg/20 w-full rounded-2xl border-2 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="Tu nombre"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="text-body-text mb-2 block font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="border-navlink-bg/20 bg-pink-light text-body-text placeholder:text-body-text/40 focus:border-navlink-bg focus:ring-navlink-bg/20 w-full rounded-2xl border-2 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="tu@email.com"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="message" className="text-body-text mb-2 block font-medium">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            minLength={10}
            maxLength={1000}
            className="border-navlink-bg/20 bg-pink-light text-body-text placeholder:text-body-text/40 focus:border-navlink-bg focus:ring-navlink-bg/20 w-full resize-none rounded-2xl border-2 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="Escribe tu mensaje aquí..."
            disabled={isSubmitting}
          />
        </div>

        {/* Checkbox de Política de Privacidad (GDPR) */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="privacy"
            name="privacy"
            checked={acceptedPrivacy}
            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
            required
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

        {message && (
          <div
            className={`rounded-2xl p-4 ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <Button
          type="submit"
          disabled={!acceptedPrivacy}
          isLoading={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </Button>
      </form>
    </div>
  )
}
