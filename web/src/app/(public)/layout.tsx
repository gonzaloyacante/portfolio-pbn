import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import PageTransitionWrapper from '@/components/layout/PageTransitionWrapper'
import { getThemeSettings } from '@/actions/settings/theme'
import { getContactSettings } from '@/actions/settings/contact'
import { getPageVisibility } from '@/actions/settings/site'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [, contactSettings, visibility] = await Promise.all([
    getThemeSettings(),
    getContactSettings(),
    getPageVisibility(),
  ])

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
        {/* Skip navigation link - accesibilidad para lectores de pantalla y teclado */}
        <a
          href="#main-content"
          className="bg-primary text-background sr-only absolute top-4 left-4 z-100 rounded px-4 py-2 text-sm font-semibold focus:not-sr-only focus:block"
        >
          Saltar al contenido principal
        </a>
        <Navbar brandName={contactSettings?.ownerName || 'Paola BN'} visibility={visibility} />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
        </main>
        <Footer ownerName={contactSettings?.ownerName} />
      </div>
    </>
  )
}
