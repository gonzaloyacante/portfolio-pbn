import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 🤖 SEO: Schema.org Structured Data */}
      <JsonLd
        type="ProfessionalService"
        data={{
          name: 'Paola Bolívar Nievas',
          email: 'contacto@paolamakeup.com',
        }}
      />

      <div className="bg-bg flex min-h-screen flex-col">
        <header className="bg-bg/80 border-primary/10 sticky top-0 z-50 border-b backdrop-blur-sm">
          <Navbar />
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  )
}
