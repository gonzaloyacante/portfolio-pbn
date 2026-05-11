import { Facebook, Instagram, Linkedin, MessageCircle, Music2, Youtube } from 'lucide-react'
import type { SocialLinkData } from '@/actions/settings/social'

const socialIconMap = {
  instagram: Instagram,
  tiktok: Music2,
  whatsapp: MessageCircle,
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
} as const

interface PublicSocialLinksProps {
  links: SocialLinkData[]
  variant?: 'grid' | 'compact'
}

export default function PublicSocialLinks({ links, variant = 'grid' }: PublicSocialLinksProps) {
  if (links.length === 0) return null

  if (variant === 'compact') {
    return (
      <div className="mt-8 flex justify-center gap-4 lg:hidden">
        {links.map((link) => {
          const Icon = socialIconMap[link.platform as keyof typeof socialIconMap]
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.platform}
              className="bg-card text-foreground hover:bg-primary hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110"
            >
              {Icon ? <Icon className="h-5 w-5" /> : <span className="text-lg">🔗</span>}
            </a>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {links.map((link) => {
        const Icon = socialIconMap[link.platform as keyof typeof socialIconMap]
        const username = link.username ? `@${link.username.replace(/^@/, '')}` : link.platform

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-primary/20 hover:border-primary/60 flex w-full max-w-xs items-center gap-4 rounded-2xl border px-5 py-4 transition-all hover:scale-[1.02]"
          >
            {Icon ? <Icon className="h-6 w-6" /> : <span className="text-lg">🔗</span>}
            <div className="min-w-0">
              <p>{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</p>
              <p className="text-foreground truncate font-semibold">{username}</p>
            </div>
          </a>
        )
      })}
    </div>
  )
}
