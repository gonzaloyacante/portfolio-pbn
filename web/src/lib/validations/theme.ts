import { z } from 'zod'

import { zHexColor, zGoogleFontsUrlNullable } from './shared'

// Theme Editor
export const themeEditorSchema = z.object({
  // Light Mode
  primaryColor: zHexColor,
  secondaryColor: zHexColor,
  accentColor: zHexColor,
  backgroundColor: zHexColor,
  textColor: zHexColor,
  cardBgColor: zHexColor,

  // Dark Mode
  darkPrimaryColor: zHexColor,
  darkSecondaryColor: zHexColor,
  darkAccentColor: zHexColor,
  darkBackgroundColor: zHexColor,
  darkTextColor: zHexColor,
  darkCardBgColor: zHexColor,

  // Typography - Base
  headingFont: z.string().min(1, 'Fuente requerida'),
  headingFontUrl: zGoogleFontsUrlNullable,
  headingFontSize: z.number().min(10).max(200),
  scriptFont: z.string().min(1, 'Fuente requerida'),
  scriptFontUrl: zGoogleFontsUrlNullable,
  scriptFontSize: z.number().min(10).max(200),
  bodyFont: z.string().min(1, 'Fuente requerida'),
  bodyFontUrl: zGoogleFontsUrlNullable,
  bodyFontSize: z.number().min(10).max(200),

  // Typography - Brand
  brandFont: z.string().optional().nullable(),
  brandFontUrl: zGoogleFontsUrlNullable,
  brandFontSize: z.number().min(10).max(300).optional().nullable(),
  portfolioFont: z.string().optional().nullable(),
  portfolioFontUrl: zGoogleFontsUrlNullable,
  portfolioFontSize: z.number().min(10).max(300).optional().nullable(),
  signatureFont: z.string().optional().nullable(),
  signatureFontUrl: zGoogleFontsUrlNullable,
  signatureFontSize: z.number().min(10).max(200).optional().nullable(),

  borderRadius: z.number().min(0).max(100),
})

export type ThemeEditorData = z.infer<typeof themeEditorSchema>
