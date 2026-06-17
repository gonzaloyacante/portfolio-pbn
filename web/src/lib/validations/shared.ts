import { z } from 'zod'

/** Strict hex color validator: only accepts #RRGGBB (6-digit).
 *  Color pickers always emit 6-digit hex. 3-char shorthands are NOT
 *  accepted because several runtime functions (hero-backdrop-styles, shadow builders)
 *  check for exactly 7 characters and fall back to black if the value differs. */
export const zHexColor = z
  .string()
  .regex(/^#[A-Fa-f0-9]{6}$/, 'Color inválido — se requiere formato #RRGGBB')

/** Nullable/optional hex color — used for fields that can be cleared (inherit from theme) */
export const zHexColorNullable = zHexColor.nullable().optional()

/** Google Fonts URL validator — only allows fonts.googleapis.com to prevent arbitrary font injection. */
export const zGoogleFontsUrl = z
  .string()
  .url('URL de fuente inválida')
  .refine((url) => {
    try {
      return new URL(url).hostname === 'fonts.googleapis.com'
    } catch {
      return false
    }
  }, 'URL de fuente inválida — solo se permiten fuentes de Google Fonts (fonts.googleapis.com)')

/** Nullable/optional Google Fonts URL — used for CMS font URL fields. */
export const zGoogleFontsUrlNullable = zGoogleFontsUrl.nullable().optional()
