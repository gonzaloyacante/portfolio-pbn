'use client'

import { useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/actions/auth.actions'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    const result = await requestPasswordReset(email)
    setMessage(result.message)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Tu email"
              required
              className="w-full rounded-md border border-gray-300 p-2"
            />
            <Button type="submit" className="w-full">
              Enviar enlace de recuperación
            </Button>
          </div>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </Card>
    </div>
  )
}
