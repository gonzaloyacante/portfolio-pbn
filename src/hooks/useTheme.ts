'use client'

import { useMemo } from 'react'

/**
 * Hook para acceder a los theme settings en componentes del cliente
 * Los valores se pasan como CSS variables desde el servidor
 */

export interface ThemeValues {
  // Colores
  colorBackground: string
  colorPrimary: string
  colorTextPrimary: string
  colorAccent: string
  colorSecondary: string
  colorDark: string

  // Tipografía
  fontHeading: string
  fontBody: string
  fontScript: string
  fontHeadingWeight: string
  fontSizeHero: string
  fontSizeH1: string
  fontSizeH2: string
  fontSizeH3: string
  fontSizeNav: string
  fontSizeBody: string

  // Espaciado
  spacingSection: string
  spacingContainer: string
  spacingElement: string

  // Layout
  layoutMaxWidth: string
  layoutGridColumns: string
  layoutBorderRadius: string

  // Efectos
  effectTransitionDuration: string
  effectHoverScale: string
}

// Valores por defecto del diseño de Canva
const defaultTheme: ThemeValues = {
  colorBackground: '#fff1f9',
  colorPrimary: '#ffaadd',
  colorTextPrimary: '#6c0a0a',
  colorAccent: '#7a2556',
  colorSecondary: '#ffa1da',
  colorDark: '#511a3a',

  fontHeading: 'Aileron',
  fontBody: 'Open Sans',
  fontScript: 'Amsterdam Four',
  fontHeadingWeight: '700',
  fontSizeHero: '338',
  fontSizeH1: '147',
  fontSizeH2: '82',
  fontSizeH3: '28',
  fontSizeNav: '24',
  fontSizeBody: '23',

  spacingSection: '120',
  spacingContainer: '108',
  spacingElement: '40',

  layoutMaxWidth: '1920',
  layoutGridColumns: '3',
  layoutBorderRadius: '42',

  effectTransitionDuration: '300',
  effectHoverScale: '1.05',
}

/**
 * Hook principal para usar tema
 * Retorna valores por defecto - los valores reales vienen de CSS variables
 */
export function useTheme(): ThemeValues {
  return useMemo(() => defaultTheme, [])
}

/**
 * Hook simplificado para obtener un valor específico del tema
 */
export function useThemeValue(key: keyof ThemeValues): string {
  return useMemo(() => defaultTheme[key], [key])
}
