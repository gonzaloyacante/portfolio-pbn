'use client'

import { calculatePasswordStrength } from '@/lib/password'

interface PasswordStrengthMeterProps {
  password: string
  className?: string
}

/**
 * Reusable Password Strength Meter component
 * Shows visual indicator (1-4 bars) of password strength
 */
export default function PasswordStrengthMeter({
  password,
  className = '',
}: PasswordStrengthMeterProps) {
  if (!password) return null

  const strength = calculatePasswordStrength(password)

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between text-xs">
        <span className="font-medium text-[var(--foreground)]">Fortaleza: {strength.label}</span>
      </div>
      <div className="bg-muted flex h-1.5 w-full gap-1 overflow-hidden rounded-full">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-full flex-1 transition-all duration-300 ${
              i < strength.score ? strength.color : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
