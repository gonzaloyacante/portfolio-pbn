import type { ThemeEditorData } from '@/lib/validations'

/**
 * Convierte datos del editor de tema al mismo `Record` que consume `buildThemeInlineStylesheet`.
 * Debe mantenerse alineado con `getThemeValues()` en `actions/settings/theme.ts`.
 */
export function themeEditorDataToCssVars(data: ThemeEditorData): Record<string, string> {
  return {
    '--primary': data.primaryColor,
    '--secondary': data.secondaryColor,
    '--accent': data.accentColor,
    '--background': data.backgroundColor,
    '--foreground': data.textColor,
    '--card-bg': data.cardBgColor,

    '--dark-primary': data.darkPrimaryColor,
    '--dark-secondary': data.darkSecondaryColor,
    '--dark-accent': data.darkAccentColor,
    '--dark-background': data.darkBackgroundColor,
    '--dark-foreground': data.darkTextColor,
    '--dark-card-bg': data.darkCardBgColor,

    '--font-heading': data.headingFont ? `"${data.headingFont}", sans-serif` : 'inherit',
    '--font-heading-size': `${data.headingFontSize}px`,
    '--font-script': data.scriptFont ? `"${data.scriptFont}", cursive` : 'inherit',
    '--font-script-size': `${data.scriptFontSize}px`,
    '--font-body': data.bodyFont ? `"${data.bodyFont}", sans-serif` : 'inherit',
    '--font-body-size': `${data.bodyFontSize}px`,

    '--font-brand': data.brandFont ? `"${data.brandFont}", sans-serif` : 'inherit',
    '--font-brand-size': data.brandFontSize ? `${data.brandFontSize}px` : 'inherit',

    '--font-portfolio': data.portfolioFont ? `"${data.portfolioFont}", sans-serif` : 'inherit',
    '--font-portfolio-size': data.portfolioFontSize ? `${data.portfolioFontSize}px` : 'inherit',

    '--font-signature': data.signatureFont ? `"${data.signatureFont}", cursive` : 'inherit',
    '--font-signature-size': data.signatureFontSize ? `${data.signatureFontSize}px` : 'inherit',

    '--radius': `${data.borderRadius}px`,
  }
}
