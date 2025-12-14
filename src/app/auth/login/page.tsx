'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FadeIn } from '@/components/ui/Animations'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [errorField, setErrorField] = useState<'email' | 'password' | 'general' | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setErrorField(null)

    try {
      // Primero verificar con nuestra API para obtener errores específicos
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok) {
        // Mostrar error específico
        if (verifyData.code === 'USER_NOT_FOUND') {
          setError('No existe una cuenta con este correo')
          setErrorField('email')
        } else if (verifyData.code === 'INVALID_PASSWORD') {
          setError('La contraseña es incorrecta')
          setErrorField('password')
        } else {
          setError(verifyData.error || 'Error al iniciar sesión')
          setErrorField('general')
        }
        setIsLoading(false)
        return
      }

      // Si la verificación pasó, hacer login con NextAuth
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Error al iniciar sesión. Inténtalo de nuevo.')
        setErrorField('general')
      } else {
        toast.success('¡Bienvenida de nuevo!')
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch {
      setError('Error de conexión. Verifica tu internet.')
      setErrorField('general')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-background, #fff1f9)' }}
    >
      <FadeIn duration={0.5}>
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Título */}
          <div className="text-center">
            <span className="text-6xl">💄</span>
            <h1
              className="font-script mt-4 text-4xl"
              style={{ color: 'var(--color-text-primary, #6c0a0a)' }}
            >
              Panel Admin
            </h1>
            <p className="mt-2 text-gray-600">Ingresa tus credenciales</p>
          </div>

          {/* Card del formulario */}
          <div
            className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800"
            style={{ borderTop: '4px solid var(--color-primary, #ffaadd)' }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error global */}
              {error && errorField === 'general' && (
                <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  ⚠️ {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errorField === 'email') {
                      setError('')
                      setErrorField(null)
                    }
                  }}
                  required
                  disabled={isLoading}
                  placeholder="tu@email.com"
                  className={`w-full rounded-lg border p-3 transition-colors focus:ring-2 focus:outline-none disabled:opacity-50 dark:bg-gray-700 dark:text-white ${
                    errorField === 'email'
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                      : 'focus:border-primary focus:ring-primary/20 border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errorField === 'email' && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>

              {/* Password con toggle */}
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errorField === 'password') {
                        setError('')
                        setErrorField(null)
                      }
                    }}
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    className={`w-full rounded-lg border p-3 pr-12 transition-colors focus:ring-2 focus:outline-none disabled:opacity-50 dark:bg-gray-700 dark:text-white ${
                      errorField === 'password'
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'focus:border-primary focus:ring-primary/20 border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errorField === 'password' && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>

              {/* Botón submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg py-3 font-semibold text-white transition-all hover:scale-[1.02] disabled:scale-100 disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-text-primary, #6c0a0a)' }}
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
                    Iniciando...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Link forgot password */}
            <div className="mt-6 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm transition-colors hover:underline"
                style={{ color: 'var(--color-accent, #7a2556)' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          {/* Link volver */}
          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ← Volver al sitio público
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
