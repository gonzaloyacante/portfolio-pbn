'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { resetPassword } from '@/actions/auth.actions'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function ResetPasswordPage() {
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('')
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    if (!token) {
      setMessage('Token inválido o expirado.')
      return
    }

    const result = await resetPassword(token, password)
    setMessage(result.message)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Nueva Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="password"
              name="password"
              placeholder="Nueva contraseña"
              required
              className="w-full rounded-md border border-gray-300 p-2"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar nueva contraseña"
              required
              className="w-full rounded-md border border-gray-300 p-2"
            />
            <Button type="submit" className="w-full">
              Guardar nueva contraseña
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
