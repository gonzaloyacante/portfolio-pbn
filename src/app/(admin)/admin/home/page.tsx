import { getHomeSettings } from '@/actions/theme.actions'
import { HomeEditor } from '@/components/admin/HomeEditor'
import { PageHeader } from '@/components/ui'

export const metadata = {
  title: 'Página Inicio | Admin',
  description: 'Gestiona la sección Hero y destacados de la página principal',
}

export default async function HomeSettingsPage() {
  const settings = await getHomeSettings()

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="🏠 Página de Inicio"
        description="Configura la sección Hero, ilustraciones y proyectos destacados."
      />

      <HomeEditor settings={settings} />
    </div>
  )
}
