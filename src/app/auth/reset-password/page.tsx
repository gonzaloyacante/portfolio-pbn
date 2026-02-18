'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { resetPassword } from '@/actions/user/auth'
import { FadeIn } from '@/components/ui'

import PasswordStrengthMeter from '@/components/ui/forms/PasswordStrengthMeter'

function ResetPasswordForm() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('') // Added state to track password for strength meter
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const submittedPassword = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (submittedPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      setStatus('error')
      setIsLoading(false)
      return
    }

    if (submittedPassword.length < 8) {
      setMessage('La contraseña debe tener al menos 8 caracteres.')
      setStatus('error')
      setIsLoading(false)
      return
    }

    if (!token) {
      setMessage('Token inválido o expirado.')
      setStatus('error')
      setIsLoading(false)
      return
    }

    try {
      const result = await resetPassword(token, submittedPassword)
      if (result.success) {
        setStatus('success')
        setMessage(result.message)
      } else {
        setStatus('error')
        setMessage(result.message)
      }
    } catch {
      setStatus('error')
      setMessage('Error al cambiar la contraseña. Inténtalo de nuevo.')
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
            <span className="text-6xl">🔑</span>
            <h1 className="font-script mt-4 text-4xl text-[var(--foreground)]">Nueva Contraseña</h1>
            <p className="text-muted-foreground mt-2">Ingresa tu nueva contraseña</p>
          </div>

          {/* Card */}
          <div className="bg-card dark:bg-muted/10 border-primary rounded-2xl border-t-4 p-8 shadow-xl">
            {status === 'success' ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg
                    className="h-8 w-8 text-green-600 dark:text-green-400"
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
                  <h3 className="text-foreground text-lg font-semibold">
                    ¡Contraseña actualizada!
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">{message}</p>
                </div>
                <Link
                  href="/auth/login"
                  className="inline-block cursor-pointer rounded-lg bg-[var(--foreground)] px-6 py-2 text-sm font-medium text-[var(--background)] transition-colors hover:opacity-90"
                >
                  Iniciar Sesión
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    ⚠️ {message}
                  </div>
                )}

                <div>
                  <label
                    className="text-foreground mb-1 block text-sm font-medium"
                    htmlFor="password"
                  >
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      placeholder="Mínimo 8 caracteres"
                      className="border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border p-3 pr-12 transition-colors focus:ring-2 focus:outline-none disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {/* Password Strength Meter */}
                  <div className="mt-2">
                    <PasswordStrengthMeter password={password} />
                  </div>
                </div>

                <div>
                  <label
                    className="text-foreground mb-1 block text-sm font-medium"
                    htmlFor="confirmPassword"
                  >
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    disabled={isLoading}
                    placeholder="Repite la contraseña"
                    className="border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border p-3 transition-colors focus:ring-2 focus:outline-none disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer rounded-lg bg-[var(--foreground)] py-3 font-semibold text-[var(--background)] transition-all hover:scale-[1.02] disabled:scale-100 disabled:opacity-50"
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
                      Guardando...
                    </span>
                  ) : (
                    'Guardar nueva contraseña'
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
          <span className="text-foreground">Cargando...</span>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
