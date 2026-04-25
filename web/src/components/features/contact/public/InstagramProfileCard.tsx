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
      className="border-primary/20 hover:border-primary/60 mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border bg-linear-to-br from-pink-50 via-purple-50 to-orange-50 px-5 py-4 transition-all hover:scale-[1.02] hover:shadow-md lg:hidden dark:from-pink-950/20 dark:via-purple-950/20 dark:to-orange-950/20"
    >
      <Instagram className="text-primary h-6 w-6 shrink-0" />
      <div>
        <p className="text-muted-foreground text-xs tracking-widest uppercase">
          Sigueme en Instagram
        </p>
        <p className="text-foreground font-semibold">
          {label ? `@${String(label).replace(/^@/, '')}` : 'Instagram'}
        </p>
      </div>
    </a>
  )
}
