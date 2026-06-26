import { getThemeSettings } from '@/actions/settings/theme'
import { getPublicColorOverrides } from '@/actions/settings/public-colors'
import { ThemeEditor } from '@/components/features/theme/ThemeEditor'
import { PageHeader } from '@/components/layout'
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
    <div className="space-y-8">
      <PageHeader
        title="🎨 Editor de Tema"
        description="Personaliza el diseño y la tipografía de tu portfolio"
      />
      <Suspense fallback={<div>Cargando configuración de tema...</div>}>
        <ThemeEditor initialData={settings} initialColorOverrides={colorOverrides} />
      </Suspense>
    </div>
  )
}
