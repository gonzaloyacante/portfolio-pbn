import { logger } from '@/lib/logger'
/**
 * Google Fonts types and utilities
 */

export interface GoogleFont {
  name: string
  category: string
  url: string
  variants?: string[]
}

export const FONT_CATEGORIES = [
  { value: 'all', label: 'Todas las fuentes' },
  { value: 'sans-serif', label: 'Sans Serif (Modernas)' },
  { value: 'serif', label: 'Serif (Elegantes)' },
  { value: 'display', label: 'Display (Llamativas)' },
  { value: 'handwriting', label: 'Manuscritas' },
  { value: 'monospace', label: 'Monoespaciadas' },
] as const

/**
 * Fetch fonts from our API route
 */
export async function fetchGoogleFonts(): Promise<GoogleFont[]> {
  try {
    const response = await fetch('/api/fonts/google')
    if (!response.ok) throw new Error('Failed to fetch fonts')

    const data = await response.json()
    return data.fonts || []
  } catch (error) {
    logger.error('Error fetching Google Fonts:', { error: error })
    return []
  }
}

/**
 * Filter fonts by category
 */
export function getFontsByCategory(fonts: GoogleFont[], category: string): GoogleFont[] {
  if (category === 'all') return fonts
  return fonts.filter((font) => font.category === category)
}
