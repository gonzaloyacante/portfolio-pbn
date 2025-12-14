'use client'

import { type ThemeSetting } from '@/actions/theme.actions'
import { useState, useEffect } from 'react'
import ColorPicker from './ColorPicker'
import FontPicker from './FontPicker'
import IconPicker from './IconPicker'

interface ThemeSettingInputProps {
  setting: ThemeSetting
  value: string
  onChange: (key: string, value: string) => void
}

export function ThemeSettingInput({ setting, value, onChange }: ThemeSettingInputProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sincronizar con valor externo
  useEffect(() => {
    setLocalValue(value)
  }, [value])

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
        <ColorPicker
          value={localValue}
          onChange={handleChange}
          label={setting.label}
          description={setting.description || undefined}
        />
      )

    case 'font':
      return (
        <FontPicker
          value={localValue}
          onChange={handleChange}
          label={setting.label}
          description={setting.description || undefined}
        />
      )

    case 'icon':
      return (
        <IconPicker
          value={localValue}
          onChange={handleChange}
          label={setting.label}
          description={setting.description || undefined}
        />
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
              type="range"
              min="0"
              max={setting.key.includes('font_size') ? '200' : '500'}
              value={localValue}
              onChange={(e) => handleChange(e.target.value)}
              className="flex-1"
            />
            <input
              type="number"
              value={localValue}
              onChange={(e) => handleChange(e.target.value)}
              className="focus:border-primary focus:ring-primary/20 w-20 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {setting.key.includes('font_size') && 'px'}
              {setting.key.includes('spacing') && 'px'}
              {setting.key.includes('duration') && 'ms'}
              {setting.key.includes('radius') && 'px'}
              {setting.key.includes('width') && 'px'}
            </span>
          </div>
          {/* Preview del valor */}
          {setting.key.includes('border_radius') && (
            <div
              className="bg-primary/30 mt-2 h-12 w-20"
              style={{ borderRadius: `${localValue}px` }}
            />
          )}
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

    case 'boolean':
      return (
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {setting.label}
            </label>
            {setting.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleChange(localValue === 'true' ? 'false' : 'true')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              localValue === 'true' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                localValue === 'true' ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
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
