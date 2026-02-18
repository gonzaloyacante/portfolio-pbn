'use client'

import { useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/actions/user/auth'
import { FadeIn, Button, Input } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

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
            <p className="text-muted-foreground mt-2">Te enviaremos un enlace a tu email</p>
          </div>

          {/* Card */}
          <div className="rounded-[2.5rem] bg-[var(--card)] p-8 shadow-lg">
            {status === 'success' ? (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-foreground text-lg font-semibold">¡Email enviado!</h3>
                  <p className="text-muted-foreground mt-2 text-sm">{message}</p>
                </div>
                <Button asChild variant="primary" className="rounded-xl">
                  <Link href={ROUTES.auth.login}>Volver a Iniciar Sesión</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
                    ⚠️ {message}
                  </div>
                )}

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="tu@email.com"
                  leftIcon={<Mail className="h-5 w-5" />}
                  containerClassName="w-full"
                />

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={isLoading}
                  className="rounded-xl"
                >
                  Enviar enlace
                </Button>
              </form>
            )}

            {status !== 'success' && (
              <div className="mt-6 text-center">
                <Link
                  href={ROUTES.auth.login}
                  className="inline-flex items-center gap-2 text-sm text-[var(--primary)] transition-colors hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" /> Volver a Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
