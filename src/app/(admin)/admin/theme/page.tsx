import { getThemeSettings } from '@/actions/theme.actions'
import { ThemeEditor } from '@/components/admin/ThemeEditor'
import { Suspense } from 'react'

export const metadata = {
  title: 'Editor de Tema | Admin',
  description: 'Personaliza el diseño de tu portfolio',
}

export default async function TemaPage() {
  const settings = await getThemeSettings()

  return (
    <div className="container mx-auto px-6 py-8">
      <Suspense fallback={<div>Cargando configuración de tema...</div>}>
        <ThemeEditor initialSettings={settings} />
      </Suspense>
    </div>
  )
}
