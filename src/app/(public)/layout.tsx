import Navbar from '@/components/layout/Navbar'
import JsonLd from '@/components/seo/JsonLd'
import PageTransition from '@/components/layout/PageTransition'
import { getThemeSettings } from '@/actions/settings/theme'
import { getContactSettings } from '@/actions/settings/contact'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [, contactSettings] = await Promise.all([getThemeSettings(), getContactSettings()])

  return (
    <>
      {/* SEO: Schema.org Structured Data */}
      <JsonLd
        type="ProfessionalService"
        data={{
          name: contactSettings?.ownerName || 'Paola Bolívar Nievas',
          email: contactSettings?.email || 'contacto@paolamakeup.com',
          telephone: contactSettings?.phone || undefined,
          address: contactSettings?.location
            ? { addressLocality: contactSettings.location }
            : undefined,
        }}
      />

      <div className="bg-background flex min-h-screen flex-col transition-colors duration-300">
        <Navbar brandName={contactSettings?.ownerName || 'Paola BN'} />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </>
  )
}
