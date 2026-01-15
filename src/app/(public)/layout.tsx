import Navbar from '@/components/layout/Navbar'

import JsonLd from '@/components/seo/JsonLd'
import PageTransition from '@/components/layout/PageTransition'
import { getSiteConfig } from '@/actions/settings.actions'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig()

  return (
    <>
      {/* SEO: Schema.org Structured Data */}
      <JsonLd
        type="ProfessionalService"
        data={{
          name: config?.ownerName || 'Paola Bolívar Nievas',
          email: config?.contactEmail || 'contacto@paolamakeup.com',
        }}
      />

      <div
        className="flex min-h-screen flex-col transition-colors duration-300"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <Navbar brandName={config?.brandName} />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        {/* Footer removed explicitly as per user request */}
        {/* <Footer ownerName={config?.ownerName} copyrightText={config?.copyrightText} /> */}
      </div>
    </>
  )
}
