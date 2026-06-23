import { getContactSettings } from '@/actions/settings/contact'
import { getSocialLinksForAdmin } from '@/actions/settings/social'
import { ContactEditor } from '@/components/features/contact/ContactEditor'
import { PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Contacto y Redes | Admin',
  description: 'Gestiona la información de contacto y enlaces a redes sociales',
}

export default async function ContactSettingsPage() {
  const [settings, socialLinks] = await Promise.all([
    getContactSettings(),
    getSocialLinksForAdmin(),
  ])

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="📞 Contacto y Redes Sociales"
        description="Configura la información visible en la página de contacto y footer, además de tus redes sociales."
      />

      <ContactEditor settings={settings} socialLinks={socialLinks} />
    </div>
  )
}
