'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FadeIn, Button, Input } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations'
import { z } from 'zod'
import { showToast } from '@/lib/toast'
import { Mail, Lock } from 'lucide-react'

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      // 1. Verify existence first (Optimized: only checks DB existence, no bcrypt)
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok) {
        if (verifyData.code === 'USER_NOT_FOUND') {
          setError('email', {
            type: 'manual',
            message: 'No existe una cuenta con este correo',
          })
          return
        }

        showToast.error(verifyData.error || 'Error de servidores')
        return
      }

      // 2. Sign in with NextAuth
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('password', {
          type: 'manual',
          message: 'La contraseña es incorrecta',
        })
      } else {
        showToast.success('¡Bienvenida de nuevo!')
        router.push(ROUTES.admin.dashboard)
      }
    } catch {
      showToast.error('Error de conexión')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <FadeIn duration={0.5}>
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <span className="text-6xl">💄</span>
            <h1 className="font-script mt-4 text-4xl text-[var(--foreground)]">Panel Admin</h1>
            <p className="text-muted-foreground mt-2">Ingresa tus credenciales</p>
          </div>

          {/* Card - Matcha ContactForm style strict */}
          <div className="rounded-[2.5rem] bg-[var(--card)] p-8 shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="h-5 w-5" />}
                allowPasswordToggle
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="mt-2 text-right">
                <Link
                  href={ROUTES.auth.forgotPassword}
                  className="text-sm text-[var(--primary)] transition-colors hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isSubmitting}
                className="rounded-xl"
              >
                Iniciar Sesión
              </Button>
            </form>
          </div>

          {/* Link volver */}
          <div className="text-center">
            <Link
              href={ROUTES.home}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              ← Volver al sitio público
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
