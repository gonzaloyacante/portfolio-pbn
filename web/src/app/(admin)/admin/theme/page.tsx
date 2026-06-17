import { getThemeSettings } from '@/actions/settings/theme'
import { getPublicColorOverrides } from '@/actions/settings/public-colors'
import { ThemeEditor } from '@/components/features/theme/ThemeEditor'
import { Suspense } from 'react'

export const metadata = {
  title: 'Editor de Tema | Admin',
  description: 'Personaliza el diseño de tu portfolio',
}

export default async function TemaPage() {
  const [settings, colorOverrides] = await Promise.all([
    getThemeSettings(),
    getPublicColorOverrides(),
  ])

  return (
    <Suspense fallback={<div>Cargando configuración de tema...</div>}>
      <ThemeEditor initialData={settings} initialColorOverrides={colorOverrides} />
    </Suspense>
  )
}
