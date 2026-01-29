'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FadeIn, Button, Input } from '@/components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations'
import { z } from 'zod'
import { useToast } from '@/components/ui'

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { show } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
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
      // 1. Verify with custom API first (legacy/specific error handling)
      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok) {
        show({
          type: 'error',
          message:
            verifyData.error ||
            (verifyData.code === 'USER_NOT_FOUND' ? 'No existe cuenta' : 'Error de verificación'),
        })
        return
      }

      // 2. Sign in with NextAuth
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        show({ type: 'error', message: 'Error al iniciar sesión' })
      } else {
        show({ type: 'success', message: '¡Bienvenida de nuevo!' })
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch {
      show({ type: 'error', message: 'Error de conexión' })
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4"
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
            <p className="text-wine/70 dark:text-pink-light/70 mt-2">Ingresa tus credenciales</p>
          </div>

          {/* Card del formulario */}
          <div
            className="dark:bg-wine/30 rounded-2xl bg-white p-8 shadow-xl"
            style={{ borderTop: '4px solid var(--color-primary, #ffaadd)' }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  className="text-wine dark:text-pink-light mb-1 block text-sm font-medium"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input {...register('email')} id="email" type="email" placeholder="tu@email.com" />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  className="text-wine dark:text-pink-light mb-1 block text-sm font-medium"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-wine/50 hover:text-wine dark:text-pink-light/50 dark:hover:text-pink-light absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Botón submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full"
                style={{ backgroundColor: 'var(--color-text-primary, #6c0a0a)' }}
              >
                Iniciar Sesión
              </Button>
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
              className="text-wine/70 hover:text-wine dark:text-pink-light/70 dark:hover:text-pink-light text-sm"
            >
              ← Volver al sitio público
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
