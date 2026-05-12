'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config/routes'

interface FooterProps {
  ownerName?: string | null
  copyrightText?: string | null
  immersiveHeroBackdrop?: boolean
}

export default function Footer({
  ownerName,
  copyrightText,
  immersiveHeroBackdrop = false,
}: FooterProps) {
  const pathname = usePathname()
  const displayName = ownerName || 'Paola Bolívar Nievas'
  const year = new Date().getFullYear()
  const immersiveGlass = pathname === ROUTES.home && immersiveHeroBackdrop

  return (
    <footer
      className={cn(
        'border-primary/20 text-foreground border-t py-12 text-center font-sans transition-colors duration-300',
        immersiveGlass ? 'bg-background/95' : 'bg-background'
      )}
    >
      <div className="container mx-auto px-4">
        <p className="mb-4 text-sm font-light tracking-widest uppercase">
          © {year} {displayName.toUpperCase()}
        </p>
        {copyrightText && <p className="mb-2 text-xs opacity-60">{copyrightText}</p>}
        <div className="flex justify-center gap-4">
          <Link
            href={ROUTES.public.privacy}
            className="text-xs opacity-60 transition-opacity hover:opacity-100"
          >
            Política de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  )
}
