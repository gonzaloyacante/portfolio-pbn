'use client'

import Link from 'next/link'
import { ROUTES } from '@/config/routes'

interface FooterProps {
  ownerName?: string | null
  copyrightText?: string | null
}

export default function Footer({ ownerName, copyrightText }: FooterProps) {
  const displayName = ownerName || 'Paola Bolívar Nievas'
  const year = new Date().getFullYear()

  return (
    <footer className="public-footer py-12 text-center font-sans transition-colors duration-300">
      <div className="container mx-auto px-4">
        <p className="mb-4 text-sm font-light tracking-widest uppercase">
          © {year} {displayName.toUpperCase()}
        </p>
        {copyrightText && <p className="public-footer-muted mb-2 text-xs">{copyrightText}</p>}
        <div className="flex justify-center gap-4">
          <Link
            href={ROUTES.public.privacy}
            className="public-footer-muted text-xs transition-opacity hover:opacity-100"
          >
            Política de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  )
}
