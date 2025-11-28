'use client'

import { useState } from 'react'
import { sendContactEmail } from '@/actions/contact.actions'

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
      <h2 className="font-primary text-wine dark:text-pink-light mb-6 text-2xl font-bold">
        Envíame un mensaje
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="text-wine dark:text-pink-light mb-2 block font-medium">
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            className="border-wine/20 bg-pink-light text-wine placeholder:text-wine/40 focus:border-wine focus:ring-wine/20 dark:border-pink-hot/20 dark:bg-purple-dark dark:text-pink-light dark:placeholder:text-pink-light/40 dark:focus:border-pink-hot w-full rounded-2xl border-2 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="Tu nombre"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="text-wine dark:text-pink-light mb-2 block font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="border-wine/20 bg-pink-light text-wine placeholder:text-wine/40 focus:border-wine focus:ring-wine/20 dark:border-pink-hot/20 dark:bg-purple-dark dark:text-pink-light dark:placeholder:text-pink-light/40 dark:focus:border-pink-hot w-full rounded-2xl border-2 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="tu@email.com"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="text-wine dark:text-pink-light mb-2 block font-medium"
          >
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            minLength={10}
            maxLength={1000}
            className="border-wine/20 bg-pink-light text-wine placeholder:text-wine/40 focus:border-wine focus:ring-wine/20 dark:border-pink-hot/20 dark:bg-purple-dark dark:text-pink-light dark:placeholder:text-pink-light/40 dark:focus:border-pink-hot w-full resize-none rounded-2xl border-2 px-4 py-3 transition-all focus:ring-2 focus:outline-none"
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
            className="border-wine/30 focus:ring-wine/20 dark:border-pink-hot/30 dark:focus:ring-pink-hot/20 text-wine mt-1 h-4 w-4 rounded border-2 focus:ring-2"
          />
          <label htmlFor="privacy" className="text-sm text-gray-700 dark:text-gray-300">
            He leído y acepto la{' '}
            <a
              href="/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-wine dark:text-pink-hot underline hover:no-underline"
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

        <button
          type="submit"
          disabled={isSubmitting || !acceptedPrivacy}
          className="bg-wine text-pink-light hover:bg-wine/90 dark:bg-purple-dark dark:text-pink-light dark:hover:bg-purple-dark/80 w-full rounded-2xl px-6 py-4 font-semibold shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Enviando...
            </span>
          ) : (
            'Enviar Mensaje'
          )}
        </button>
      </form>
    </div>
  )
}
