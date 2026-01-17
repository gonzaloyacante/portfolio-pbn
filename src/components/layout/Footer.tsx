'use client'

import Link from 'next/link'

interface FooterProps {
  ownerName?: string | null
  copyrightText?: string | null
}

export default function Footer({ ownerName, copyrightText }: FooterProps) {
  const displayName = ownerName || 'Paola Bolívar Nievas'
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t border-primary/20 bg-background py-12 text-center font-sans text-foreground transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <p className="mb-4 text-sm font-light tracking-widest uppercase">
          © {year} {displayName.toUpperCase()}
        </p>
        {copyrightText && (
          <p className="mb-2 text-xs opacity-60">
            {copyrightText}
          </p>
        )}
        <div className="flex justify-center gap-4">
          <Link
            href="/privacidad"
            className="text-xs opacity-60 transition-opacity hover:opacity-100"
          >
            Política de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  )
}
