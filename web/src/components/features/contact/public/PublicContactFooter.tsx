import Link from 'next/link'
import { Heart } from 'lucide-react'
import { ROUTES } from '@/config/routes'

interface PublicContactFooterProps {
  ownerName: string
}

export default function PublicContactFooter({ ownerName }: PublicContactFooterProps) {
  return (
    <div className="public-contact-page border-t py-8 text-center font-sans transition-colors duration-300">
      <div className="flex flex-wrap items-center justify-center gap-3 px-4">
        <span className="public-contact-info-text text-sm">¿Ya trabajamos juntas?</span>
        <Link
          href={ROUTES.public.testimonialForm}
          className="public-contact-form-link inline-flex min-h-11 min-w-11 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
        >
          <Heart size={14} aria-hidden />
          Deja tu testimonio
        </Link>
      </div>
      <p className="public-contact-info-text mt-3 text-xs">Tu confianza significa mucho para mí.</p>
    </div>
  )
}
