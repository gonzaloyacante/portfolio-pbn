import { getAboutSettings } from '@/actions/theme.actions'
import { AboutEditor } from '@/components/features/about/AboutEditor'
import { PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Sobre Mí | Admin',
  description: 'Gestiona la información de la página Sobre Mí',
}

export default async function AboutSettingsPage() {
  const settings = await getAboutSettings()

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="👤 Página Sobre Mí"
        description="Edita tu biografía, habilidades, certificaciones y configuración de la página"
      />

      <AboutEditor settings={settings} />
    </div>
  )
}
