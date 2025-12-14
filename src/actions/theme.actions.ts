'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/**
 * Theme Settings Actions
 * Gestión completa de configuración de diseño desde el CMS
 */

// ========== TYPES ==========

export type ThemeCategory = 'colors' | 'typography' | 'spacing' | 'layout' | 'effects'

export interface ThemeSetting {
  id: string
  key: string
  category: ThemeCategory
  label: string
  value: string
  type: 'hex' | 'number' | 'select' | 'text' | 'font'
  description?: string | null
  options?: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ThemeSettingsGrouped {
  colors: ThemeSetting[]
  typography: ThemeSetting[]
  spacing: ThemeSetting[]
  layout: ThemeSetting[]
  effects: ThemeSetting[]
}

// ========== GET ==========

/**
 * Obtener todas las configuraciones de tema activas
 */
export async function getAllThemeSettings(): Promise<ThemeSetting[]> {
  try {
    const settings = await prisma.themeSettings.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })
    return settings as ThemeSetting[]
  } catch (error) {
    console.error('Error getting theme settings:', error)
    throw new Error('Error al obtener configuraciones de tema')
  }
}

/**
 * Obtener configuraciones de tema agrupadas por categoría
 */
export async function getThemeSettingsGrouped(): Promise<ThemeSettingsGrouped> {
  try {
    const settings = await getAllThemeSettings()

    const grouped: ThemeSettingsGrouped = {
      colors: [],
      typography: [],
      spacing: [],
      layout: [],
      effects: [],
    }

    settings.forEach((setting) => {
      if (setting.category in grouped) {
        grouped[setting.category as ThemeCategory].push(setting)
      }
    })

    return grouped
  } catch (error) {
    console.error('Error grouping theme settings:', error)
    throw new Error('Error al agrupar configuraciones de tema')
  }
}

/**
 * Obtener una configuración específica por key
 */
export async function getThemeSettingByKey(key: string): Promise<ThemeSetting | null> {
  try {
    const setting = await prisma.themeSettings.findUnique({
      where: { key },
    })
    return setting as ThemeSetting | null
  } catch (error) {
    console.error(`Error getting theme setting ${key}:`, error)
    return null
  }
}

/**
 * Obtener valor de una configuración específica
 */
export async function getThemeValue(key: string, defaultValue: string = ''): Promise<string> {
  try {
    const setting = await getThemeSettingByKey(key)
    return setting?.value ?? defaultValue
  } catch (error) {
    console.error(`Error getting theme value ${key}:`, error)
    return defaultValue
  }
}

/**
 * Obtener objeto con todos los valores de tema (para usar en CSS/Tailwind)
 */
export async function getThemeValues(): Promise<Record<string, string>> {
  try {
    const settings = await getAllThemeSettings()
    const values: Record<string, string> = {}

    settings.forEach((setting) => {
      values[setting.key] = setting.value
    })

    return values
  } catch (error) {
    console.error('Error getting theme values:', error)
    return {}
  }
}

// ========== UPDATE ==========

/**
 * Actualizar una configuración de tema
 */
export async function updateThemeSetting(key: string, value: string) {
  try {
    const updated = await prisma.themeSettings.update({
      where: { key },
      data: { value },
    })

    // Revalidar todas las rutas para aplicar el cambio
    revalidatePath('/', 'layout')

    return {
      success: true,
      setting: updated,
      message: 'Configuración actualizada correctamente',
    }
  } catch (error) {
    console.error(`Error updating theme setting ${key}:`, error)
    return {
      success: false,
      error: 'Error al actualizar configuración',
    }
  }
}

/**
 * Actualizar múltiples configuraciones de tema
 */
export async function updateMultipleThemeSettings(settings: Array<{ key: string; value: string }>) {
  try {
    const updates = settings.map((setting) =>
      prisma.themeSettings.update({
        where: { key: setting.key },
        data: { value: setting.value },
      })
    )

    await prisma.$transaction(updates)

    // Revalidar todas las rutas
    revalidatePath('/', 'layout')

    return {
      success: true,
      message: `${settings.length} configuraciones actualizadas correctamente`,
    }
  } catch (error) {
    console.error('Error updating multiple theme settings:', error)
    return {
      success: false,
      error: 'Error al actualizar configuraciones',
    }
  }
}

// ========== PAGE CONTENT ==========

export interface PageContent {
  id: string
  pageKey: string
  sectionKey: string
  content: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Obtener contenido de una página
 */
export async function getPageContent(pageKey: string): Promise<PageContent | null> {
  try {
    const content = await prisma.pageContent.findUnique({
      where: { pageKey },
    })
    return content as PageContent | null
  } catch (error) {
    console.error(`Error getting page content ${pageKey}:`, error)
    return null
  }
}

/**
 * Actualizar contenido de una página
 */
export async function updatePageContent(pageKey: string, content: string) {
  try {
    const updated = await prisma.pageContent.update({
      where: { pageKey },
      data: { content },
    })

    revalidatePath('/', 'layout')

    return {
      success: true,
      content: updated,
      message: 'Contenido actualizado correctamente',
    }
  } catch (error) {
    console.error(`Error updating page content ${pageKey}:`, error)
    return {
      success: false,
      error: 'Error al actualizar contenido',
    }
  }
}

/**
 * Resetear todas las configuraciones de tema a valores por defecto
 */
export async function resetThemeToDefaults() {
  try {
    // Importar y ejecutar los defaults
    const { themeDefaults } = await import('../../prisma/seeds/theme-defaults')

    const updates = themeDefaults.map((setting) =>
      prisma.themeSettings.update({
        where: { key: setting.key },
        data: { value: setting.value },
      })
    )

    await prisma.$transaction(updates)

    revalidatePath('/', 'layout')

    return {
      success: true,
      message: 'Tema reseteado a valores por defecto',
    }
  } catch (error) {
    console.error('Error resetting theme to defaults:', error)
    return {
      success: false,
      error: 'Error al resetear tema',
    }
  }
}
