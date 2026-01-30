'use client'

import { useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/actions/auth.actions'
import { FadeIn } from '@/components/ui'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus('idle')

    try {
      const result = await requestPasswordReset(email)
      if (result.success) {
        setStatus('success')
        setMessage(result.message)
      } else {
        setStatus('error')
        setMessage(result.message || 'Error desconocido')
      }
    } catch {
      setStatus('error')
      setMessage('Error al enviar el email. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <FadeIn duration={0.5}>
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <span className="text-6xl">🔐</span>
            <h1 className="font-script mt-4 text-4xl text-[var(--foreground)]">
              Recuperar Contraseña
            </h1>
            <p className="text-wine/70 dark:text-pink-light/70 mt-2">
              Te enviaremos un enlace a tu email
            </p>
          </div>

          {/* Card */}
          <div className="dark:bg-wine/30 rounded-2xl border-t-4 border-[var(--primary)] bg-[var(--card-bg)] p-8 shadow-xl">
            {status === 'success' ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-wine dark:text-pink-light text-lg font-semibold">
                    ¡Email enviado!
                  </h3>
                  <p className="text-wine/70 dark:text-pink-light/70 mt-2 text-sm">{message}</p>
                </div>
                <Link
                  href="/auth/login"
                  className="inline-block rounded-lg bg-[var(--foreground)] px-6 py-2 text-sm font-medium text-[var(--background)] transition-colors hover:opacity-90"
                >
                  Volver a Iniciar Sesión
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
                    ⚠️ {message}
                  </div>
                )}

                <div>
                  <label
                    className="text-wine dark:text-pink-light mb-1 block text-sm font-medium"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="tu@email.com"
                    className="focus:border-primary focus:ring-primary/20 border-pink-hot/30 dark:border-pink-light/30 dark:bg-wine/30 dark:text-pink-light w-full rounded-lg border p-3 transition-colors focus:ring-2 focus:outline-none disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-[var(--foreground)] py-3 font-semibold text-[var(--background)] transition-all hover:scale-[1.02] disabled:scale-100 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar enlace de recuperación'
                  )}
                </button>
              </form>
            )}

            {status !== 'success' && (
              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-[var(--primary)] transition-colors hover:underline"
                >
                  ← Volver a Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
