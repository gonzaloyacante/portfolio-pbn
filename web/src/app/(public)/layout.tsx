import Navbar from '@/components/layout/Navbar'
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

  // ── Maintenance mode: show a styled, responsive maintenance card
  if (visibility.maintenanceMode) {
    return (
      <div
        className="bg-background text-foreground flex min-h-screen items-center justify-center p-4"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="bg-card w-full max-w-2xl rounded-2xl p-6 shadow-lg sm:p-10">
          <div className="flex flex-col items-start gap-4">
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">Sitio en mantenimiento</h1>
            <p className="text-muted-foreground max-w-xl text-base">
              Estamos realizando mejoras para mejorar la experiencia. Volvemos pronto.
            </p>

            <div className="mt-4 w-full">
              <div className="border-border bg-background/30 rounded-md border p-4">
                <p className="text-muted-foreground text-sm">
                  Si necesitas contactarnos, escribe a{' '}
                  <a href="mailto:contacto@paolabolivar.es" className="text-primary underline">
                    contacto@paolabolivar.es
                  </a>
                  .
                </p>
              </div>
            </div>

            <p className="text-muted-foreground mt-2 text-xs">
              Sitio temporalmente deshabilitado para mantenimiento.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* SEO: Schema.org Structured Data */}
      <JsonLd
        type="ProfessionalService"
        data={{
          name: contactSettings?.ownerName || 'Paola Bolívar Nievas',
          email: contactSettings?.email || 'contacto@paolamakeup.com',
          telephone: contactSettings?.phone || undefined,
          address: contactSettings?.location ? { addressLocality: contactSettings.location } : {},
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
      </div>
    </>
  )
}
