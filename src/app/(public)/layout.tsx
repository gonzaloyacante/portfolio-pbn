import Navbar from '@/components/layout/Navbar'
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
        <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
        <footer className="border-primary/10 text-primary/60 font-primary border-t p-8 text-center text-sm">
          © {new Date().getFullYear()} Paola Bolívar Nievas. All rights reserved.
        </footer>
      </div>
    </>
  )
}
