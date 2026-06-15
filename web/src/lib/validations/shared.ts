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
