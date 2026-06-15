import { z } from 'zod'

import { zHexColor } from './shared'

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
  headingFontUrl: z.string().optional().nullable(),
  headingFontSize: z.number().min(10).max(200),
  scriptFont: z.string().min(1, 'Fuente requerida'),
  scriptFontUrl: z.string().optional().nullable(),
  scriptFontSize: z.number().min(10).max(200),
  bodyFont: z.string().min(1, 'Fuente requerida'),
  bodyFontUrl: z.string().optional().nullable(),
  bodyFontSize: z.number().min(10).max(200),

  // Typography - Brand
  brandFont: z.string().optional().nullable(),
  brandFontUrl: z.string().optional().nullable(),
  brandFontSize: z.number().min(10).max(300).optional().nullable(),
  portfolioFont: z.string().optional().nullable(),
  portfolioFontUrl: z.string().optional().nullable(),
  portfolioFontSize: z.number().min(10).max(300).optional().nullable(),
  signatureFont: z.string().optional().nullable(),
  signatureFontUrl: z.string().optional().nullable(),
  signatureFontSize: z.number().min(10).max(200).optional().nullable(),

  borderRadius: z.number().min(0).max(100),
})

export type ThemeEditorData = z.infer<typeof themeEditorSchema>
