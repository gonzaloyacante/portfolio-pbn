import { getSiteSettings } from '@/actions/settings/site'
import { PageHeader } from '@/components/layout'
import { SiteEditor } from '@/components/features/site/SiteEditor'

export const metadata = {
  title: 'Configuración del Sitio | Admin',
  description: 'Gestiona el modo mantenimiento, visibilidad de páginas y SEO',
}

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="🌐 Configuración del Sitio"
        description="Controla el modo mantenimiento, la visibilidad de páginas públicas e indexación SEO."
      />
      <SiteEditor settings={settings} />
    </div>
  )
}
