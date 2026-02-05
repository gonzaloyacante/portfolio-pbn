import { z } from 'zod'

/**
 * Sanitize text input to prevent basic XSS
 * Removes script tags and potentially harmful attributes
 */
export function sanitizeText(text: string): string {
  if (!text) return ''
  return text
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
    .replace(/on\w+="[^"]*"/g, '')
    .trim()
}

/**
 * Validate and build a safe Google Fonts URL
 * Strictly allows only fonts.googleapis.com
 */
export function buildSafeFontUrl(fontFamily: string): string | null {
  if (!fontFamily) return null
  const safeFont = fontFamily.replace(/[^a-zA-Z0-9\s]/g, '')
  return `https://fonts.googleapis.com/css2?family=${safeFont.replace(/\s+/g, '+')}:wght@400;700&display=swap`
}

/**
 * Validate URLs used in fonts to prevent malicious external links
 */
export function validateFontUrl(url: string | null | undefined): boolean {
  if (!url) return true // Allow empty/null
  try {
    const parsed = new URL(url)
    return parsed.hostname === 'fonts.googleapis.com'
  } catch {
    return false
  }
}

/**
 * Validate Hex Colors
 */
export function validateColor(color: string | null | undefined): boolean {
  if (!color) return true
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(color)
}

/**
 * Generic Validation and Sanitization Wrapper
 * Applies Zod schema validation and additional sanitization if needed
 */
export function validateAndSanitize<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>
    const errorMsg = Object.entries(errors)
      .map(([field, msgs]) => `${field}: ${msgs?.join(', ')}`)
      .join(' | ')
    return { success: false, error: errorMsg || 'Datos inválidos' }
  }
  return { success: true, data: result.data }
}
