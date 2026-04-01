'use client'

import { useMemo, useState } from 'react'
import SmartField from './SmartField'
import { Service } from '@/generated/prisma/client'

interface DurationFieldProps {
  service?: Service | null
}

const PRESETS = [15, 30, 45, 60, 90, 120, 150, 180, 240]

function parseMinutes(text: string): number | null {
  const trimmed = text.trim()
  if (!trimmed) return null

  const direct = parseInt(trimmed, 10)
  if (!isNaN(direct)) return direct

  const hRegex = /(\d+)\s*h(?:\s*(\d+)\s*m(?:in)?)?/i
  const hMatch = trimmed.match(hRegex)
  if (hMatch) {
    const h = parseInt(hMatch[1] || '0', 10) || 0
    const m = parseInt(hMatch[2] || '0', 10) || 0
    return h * 60 + m
  }

  const mRegex = /(\d+)\s*m(?:in)?/i
  const mMatch = trimmed.match(mRegex)
  if (mMatch) return parseInt(mMatch[1] || '0', 10) || null

  return null
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

export default function DurationField({ service }: DurationFieldProps) {
  const [text, setText] = useState<string>(() => service?.duration ?? '')

  const currentMinutes = useMemo(() => parseMinutes(text) ?? null, [text])

  const baseInputClasses =
    'mt-1 block w-full rounded-md border border-input p-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-background text-foreground'

  return (
    <div>
      <label className="block text-sm font-medium text-(--foreground) opacity-90">Duración</label>

      <div className="mt-2">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((m) => {
            const isSelected = currentMinutes === m
            return (
              <button
                key={m}
                type="button"
                onClick={() => setText(formatDuration(m))}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${isSelected ? 'bg-(--primary) text-white' : 'bg-muted/10 hover:bg-muted/20 text-(--foreground)'}`}
              >
                {formatDuration(m)}
              </button>
            )
          })}
        </div>

        <div className="relative mt-3">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-(--muted-foreground)">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 7V12L15 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            name="duration"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="1h 30min"
            className={`${baseInputClasses} pr-24 pl-10`}
          />

          {currentMinutes !== null && (
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-(--muted-foreground)">
              = {currentMinutes} min
            </span>
          )}
        </div>

        {/* durationMinutes numeric field (separate) */}
        <div className="mt-4">
          <SmartField
            label="Duración (Minutos)"
            name="durationMinutes"
            type="number"
            defaultValue={service?.durationMinutes?.toString()}
            placeholder="120"
          />
        </div>
      </div>
    </div>
  )
}
