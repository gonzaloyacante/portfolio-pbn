import { Instagram } from 'lucide-react'

interface InstagramProfileCardProps {
  href: string | null
  label: string | null
}

export default function InstagramProfileCard({ href, label }: InstagramProfileCardProps) {
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="public-contact-social-link mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border px-5 py-4 transition-all hover:scale-[1.02] hover:shadow-md lg:hidden"
    >
      <Instagram className="h-6 w-6 shrink-0" />
      <div>
        <p className="public-contact-info-text text-xs tracking-widest uppercase">
          Sigueme en Instagram
        </p>
        <p className="font-semibold">
          {label ? `@${String(label).replace(/^@/, '')}` : 'Instagram'}
        </p>
      </div>
    </a>
  )
}
