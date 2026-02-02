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
        // Si falla aquí, es porque el usuario NO existe (único chequeo que hace la API ahora)
        if (verifyData.code === 'USER_NOT_FOUND') {
          setError('email', {
            type: 'manual',
            message: 'No existe una cuenta con este correo',
          })
          return
        }

        // Error genérico de API
        show({
          type: 'error',
          message: verifyData.error || 'Error de servidores',
        })
        return
      }

      // 2. Sign in with NextAuth (Here is where bcrypt happens)
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        // SI llegamos aquí, el email EXISTE (pasó paso 1), así que el error ES la contraseña
        setError('password', {
          type: 'manual',
          message: 'La contraseña es incorrecta',
        })
      } else {
        show({ type: 'success', message: '¡Bienvenida de nuevo!' })
        router.push('/admin/dashboard')
        // Removed router.refresh() for instant navigation
      }
    } catch {
      show({ type: 'error', message: 'Error de conexión' })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <FadeIn duration={0.5}>
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Título */}
          <div className="text-center">
            <span className="text-6xl">💄</span>
            <h1 className="font-script mt-4 text-4xl text-[var(--foreground)]">Panel Admin</h1>
            <p className="text-muted-foreground mt-2">Ingresa tus credenciales</p>
          </div>

          {/* Card del formulario */}
          <div className="bg-card dark:bg-muted/10 border-primary rounded-2xl border-t-4 p-8 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label className="text-foreground mb-1 block text-sm font-medium" htmlFor="email">
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
                  className="text-foreground mb-1 block text-sm font-medium"
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
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
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
                className="w-full bg-[var(--foreground)] text-[var(--background)] hover:opacity-90"
              >
                Iniciar Sesión
              </Button>
            </form>

            {/* Link forgot password */}
            <div className="mt-6 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[var(--primary)] transition-colors hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          {/* Link volver */}
          <div className="text-center">
            <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
              ← Volver al sitio público
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
