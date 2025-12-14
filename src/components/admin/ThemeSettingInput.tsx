'use client'

import { type ThemeSetting } from '@/actions/theme.actions'
import { useState } from 'react'

interface ThemeSettingInputProps {
  setting: ThemeSetting
  value: string
  onChange: (key: string, value: string) => void
}

export function ThemeSettingInput({ setting, value, onChange }: ThemeSettingInputProps) {
  const [localValue, setLocalValue] = useState(value)

  const handleChange = (newValue: string) => {
    setLocalValue(newValue)
    onChange(setting.key, newValue)
  }

  // Parse options if present
  let options: Array<{ label: string; value: string }> = []
  if (setting.options) {
    try {
      const parsed = JSON.parse(setting.options)
      options = Array.isArray(parsed) ? parsed : []
    } catch (e) {
      console.error('Error parsing options:', e)
    }
  }

  // Renderizar según el tipo
  switch (setting.type) {
    case 'hex':
      return (
        <div className="space-y-2">
          <label
            htmlFor={setting.key}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {setting.label}
          </label>
          {setting.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
          )}
          <div className="flex items-center gap-3">
            <input
              id={setting.key}
              type="color"
              value={localValue}
              onChange={(e) => handleChange(e.target.value)}
              className="h-10 w-20 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              value={localValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="#000000"
              className="focus:border-primary focus:ring-primary/20 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
        </div>
      )

    case 'number':
      return (
        <div className="space-y-2">
          <label
            htmlFor={setting.key}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {setting.label}
          </label>
          {setting.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
          )}
          <div className="flex items-center gap-2">
            <input
              id={setting.key}
              type="number"
              value={localValue}
              onChange={(e) => handleChange(e.target.value)}
              className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {setting.key.includes('font_size') ? 'px' : ''}
              {setting.key.includes('spacing') ? 'px' : ''}
              {setting.key.includes('duration') ? 'ms' : ''}
            </span>
          </div>
        </div>
      )

    case 'select':
      return (
        <div className="space-y-2">
          <label
            htmlFor={setting.key}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {setting.label}
          </label>
          {setting.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
          )}
          <select
            id={setting.key}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label || option.value}
              </option>
            ))}
          </select>
        </div>
      )

    case 'font':
      return (
        <div className="space-y-2">
          <label
            htmlFor={setting.key}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {setting.label}
          </label>
          {setting.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
          )}
          <select
            id={setting.key}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
            style={{ fontFamily: localValue }}
          >
            {options.map((fontName) => (
              <option
                key={String(fontName)}
                value={String(fontName)}
                style={{ fontFamily: String(fontName) }}
              >
                {String(fontName)}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 italic" style={{ fontFamily: localValue }}>
            Ejemplo de texto con {localValue}
          </p>
        </div>
      )

    case 'text':
    default:
      return (
        <div className="space-y-2">
          <label
            htmlFor={setting.key}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {setting.label}
          </label>
          {setting.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
          )}
          <input
            id={setting.key}
            type="text"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            className="focus:border-primary focus:ring-primary/20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
      )
  }
}
