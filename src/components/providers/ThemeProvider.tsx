import { getThemeValues } from '@/actions/theme.actions'

/**
 * Theme Provider
 * Inyecta las CSS variables del tema dinámicamente desde la base de datos
 */

export async function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeValues = await getThemeValues()

  // Convertir keys de snake_case a kebab-case para CSS variables
  const cssVariables = Object.entries(themeValues).reduce(
    (acc, [key, value]) => {
      const cssKey = key.replace(/_/g, '-')
      acc[`--${cssKey}`] = value
      return acc
    },
    {} as Record<string, string>
  )

  return (
    <div style={cssVariables} className="theme-root">
      {children}
    </div>
  )
}
