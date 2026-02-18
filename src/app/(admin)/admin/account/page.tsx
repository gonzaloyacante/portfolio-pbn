'use client'

import { useState } from 'react'
import { Button, SmartField as FormField } from '@/components/ui'
import { Section, PageHeader } from '@/components/layout'
import { showToast } from '@/lib/toast'
import { calculatePasswordStrength } from '@/lib/password'

export default function MiCuentaPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState({ score: 0, label: '', color: '' })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value
    setPassword(newVal)
    setStrength(calculatePasswordStrength(newVal))
  }

  async function handleChangePassword(formData: FormData) {
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast.error('Todos los campos son obligatorios')
      return
    }

    if (newPassword !== confirmPassword) {
      showToast.error('Las contraseñas nuevas no coinciden')
      return
    }

    if (newPassword.length < 8) {
      showToast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al cambiar contraseña')
      }

      showToast.success('Contraseña actualizada correctamente')
      // Reset form
      const form = document.getElementById('password-form') as HTMLFormElement
      form?.reset()
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Error al cambiar contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader title="🔐 Mi Cuenta" description="Administra la seguridad de tu cuenta" />

      <Section title="Cambiar Contraseña">
        <form id="password-form" action={handleChangePassword} className="space-y-4">
          <FormField
            label="Contraseña actual"
            name="currentPassword"
            type="password"
            required
            placeholder="Ingresa tu contraseña actual"
          />

          <div className="border-border border-t pt-4">
            <FormField
              label="Nueva contraseña"
              name="newPassword"
              type="password"
              required
              placeholder="Mínimo 8 caracteres"
              onChange={handlePasswordChange}
            />
            {/* Password Strength Meter */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[var(--foreground)]">
                    Fortaleza: {strength.label}
                  </span>
                </div>
                <div className="bg-muted flex h-1.5 w-full gap-1 overflow-hidden rounded-full">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-full flex-1 transition-all duration-300 ${i < strength.score ? strength.color : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <FormField
            label="Confirmar nueva contraseña"
            name="confirmPassword"
            type="password"
            required
            placeholder="Repite la nueva contraseña"
          />

          <Button type="submit" loading={isLoading}>
            Cambiar Contraseña
          </Button>
        </form>
      </Section>

      <div className="border-border bg-card rounded-2xl border p-4">
        <h4 className="text-foreground mb-2 font-semibold">🔒 Consejos de seguridad</h4>
        <ul className="text-muted-foreground space-y-1 text-sm">
          <li>• Usa al menos 8 caracteres</li>
          <li>• Combina letras, números y símbolos</li>
          <li>• No uses contraseñas fáciles de adivinar</li>
          <li>• No compartas tu contraseña con nadie</li>
        </ul>
      </div>
    </div>
  )
}
