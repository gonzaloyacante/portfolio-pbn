import Link from 'next/link'
import { Heart } from 'lucide-react'
import { ROUTES } from '@/config/routes'

interface PublicContactFooterProps {
  ownerName: string
}

export default function PublicContactFooter({ ownerName }: PublicContactFooterProps) {
  return (
    <div className="border-primary/20 border-t py-8 text-center font-sans">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="text-muted-foreground text-sm">¿Ya trabajamos juntas?</span>
        <Link
          href={ROUTES.public.testimonialForm}
          className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
        >
          <Heart size={14} />
          Deja tu testimonio
        </Link>
      </div>
      <p className="text-muted-foreground mb-2 text-sm font-light tracking-widest uppercase">
        © {new Date().getFullYear()} {ownerName.toUpperCase()}
      </p>
      <Link
        href={ROUTES.public.privacy}
        className="text-muted-foreground text-xs opacity-60 transition-opacity hover:opacity-100"
      >
        Política de Privacidad
      </Link>
    </div>
  )
}
