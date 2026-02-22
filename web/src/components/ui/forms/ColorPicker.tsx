'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Paintbrush } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: string
}

const PRESETS = [
  '#000000',
  '#ffffff',
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#0f172a', // Grayscale
  '#ef4444',
  '#f87171',
  '#b91c1c', // Red
  '#f97316',
  '#fb923c',
  '#c2410c', // Orange
  '#eab308',
  '#facc15',
  '#a16207', // Yellow
  '#22c55e',
  '#4ade80',
  '#15803d', // Green
  '#06b6d4',
  '#22d3ee',
  '#0e7490', // Cyan
  '#3b82f6',
  '#60a5fa',
  '#1d4ed8', // Blue
  '#6366f1',
  '#818cf8',
  '#4338ca', // Indigo
  '#a855f7',
  '#c084fc',
  '#7e22ce', // Purple
  '#ec4899',
  '#f472b6',
  '#be185d', // Pink
  '#f43f5e',
  '#fb7185',
  '#be123c', // Rose
  '#6c0a0a',
  '#881337',
  '#2a1015', // Brand (Custom)
  '#fff8fc',
  '#fce7f3',
  '#fff1f9', // Brand Light
  '#0f0505',
  '#1c0a0f',
  '#2a1015', // Brand Dark
]

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [localColor, setLocalColor] = useState(color)
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalColor(color)
  }, [color])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleChange = (newColor: string) => {
    setLocalColor(newColor)
    onChange(newColor)
  }

  return (
    <div className="relative" ref={popoverRef}>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start gap-2 border px-2 py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="h-6 w-6 rounded-full border shadow-sm ring-1 ring-black/5"
          style={{ backgroundColor: localColor }}
        />
        <span className="flex-1 text-left text-sm font-medium uppercase">{localColor}</span>
        <Paintbrush size={14} className="text-muted-foreground opacity-50" />
      </Button>

      {isOpen && (
        <div className="bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 absolute top-full left-0 z-50 mt-2 w-64 rounded-md border p-3 shadow-md outline-none">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Seleccionar Color</h4>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-6 gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={cn(
                    'focus:ring-primary h-6 w-6 rounded border transition-transform hover:scale-110 focus:ring-2 focus:ring-offset-1 focus:outline-none',
                    localColor.toLowerCase() === preset.toLowerCase()
                      ? 'ring-primary border-transparent ring-2 ring-offset-1'
                      : 'border-muted'
                  )}
                  style={{ backgroundColor: preset }}
                  onClick={() => handleChange(preset)}
                  title={preset}
                />
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="text-muted-foreground absolute top-1/2 left-2 -translate-y-1/2 text-xs">
                  #
                </span>
                <Input
                  value={localColor.replace('#', '')}
                  onChange={(e) => {
                    const val = e.target.value
                    setLocalColor(`#${val}`)
                    if (/^[0-9A-Fa-f]{6}$/.test(val)) {
                      onChange(`#${val}`)
                    }
                  }}
                  className="h-8 pl-5 font-mono text-xs uppercase"
                  maxLength={6}
                />
              </div>
              <div className="border-input relative h-8 w-8 overflow-hidden rounded border shadow-sm">
                <input
                  type="color"
                  value={localColor.length === 7 ? localColor : '#000000'}
                  onChange={(e) => handleChange(e.target.value)}
                  className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] cursor-pointer opacity-0"
                />
                <div className="h-full w-full" style={{ backgroundColor: localColor }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPicker
