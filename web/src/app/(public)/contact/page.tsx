import { getContactSettings } from '@/actions/settings/contact'
import { getSocialLinks } from '@/actions/settings/social'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import ContactForm from '@/components/features/contact/ContactForm'
import InstagramEmbed from '@/components/features/contact/InstagramEmbed'
import {
  Instagram,
  Music2,
  MessageCircle,
  Youtube,
  Linkedin,
  Facebook,
  MapPin,
  Phone,
  Mail,
  Heart,
} from 'lucide-react'
import { OptimizedImage, FadeIn } from '@/components/ui'
import { Suspense } from 'react'
import { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Reserva tu sesión de maquillaje con Paola Bolívar Nievas en Málaga. Presupuestos para bodas, editoriales, eventos y caracterización artística. ¡Contáctanos hoy!',
  alternates: {
    canonical: '/contacto',
  },
  openGraph: {
    title: 'Contacto | Paola Bolívar Nievas',
    description:
      'Reserva tu sesión de maquillaje profesional en Málaga. Bodas, editoriales, eventos y caracterización artística.',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary',
    title: 'Contacto | Paola Bolívar Nievas',
    description: 'Reserva tu sesión de maquillaje profesional en Málaga.',
  },
}

/**
 * Contact Page
 * Mobile: Compact Layout (Title -> Info Row -> Form -> Social)
 * Desktop: Split Layout (Illustration/Info Left | Form Right)
 */
export default async function ContactPage() {
  const [contactSettings, socialLinks] = await Promise.all([getContactSettings(), getSocialLinks()])

  // Icon mapping for social links
  const iconMap: Record<string, React.ReactNode> = {
    instagram: <Instagram className="h-6 w-6" />,
    tiktok: <Music2 className="h-6 w-6" />,
    whatsapp: <MessageCircle className="h-6 w-6" />,
    youtube: <Youtube className="h-6 w-6" />,
    linkedin: <Linkedin className="h-6 w-6" />,
    facebook: <Facebook className="h-6 w-6" />,
  }

  const ownerName = contactSettings?.ownerName || 'Paola Bolívar Nievas'

  // Derive Instagram from social links (configured in admin → Redes Sociales)
  const instagramLink = socialLinks.find((l) => l.platform === 'instagram')
  const instagramUrl = instagramLink?.url || contactSettings?.instagram || null
  const instagramDisplayName =
    instagramLink?.username ||
    contactSettings?.instagramUsername ||
    (instagramUrl ? instagramUrl.split('/').filter(Boolean).pop() : null)

  return (
    <section className="bg-background w-full transition-colors duration-500">
      <JsonLd
        type="LocalBusiness"
        data={{
          name: ownerName,
          description:
            'Maquilladora profesional y caracterizadora en Málaga. Servicios para bodas, editoriales, eventos y caracterización artística.',
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/contacto`,
          telephone: contactSettings?.phone ?? undefined,
          email: contactSettings?.email ?? undefined,
        }}
      />
      {/* 
        MOBILE HEADER (Only visible on < lg) 
        Title + Compact Info Row
      */}
      <div className="flex flex-col items-center px-6 pt-8 pb-0 text-center lg:hidden">
        <h1 className="text-foreground font-script mb-4 text-4xl">
          {contactSettings?.pageTitle || 'Contacto'}
        </h1>

        {/* Compact Info Grid */}
        <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm">
          {contactSettings?.showEmail !== false && contactSettings?.email && (
            <a
              href={`mailto:${contactSettings.email}`}
              className="hover:text-primary flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              <span>{contactSettings.email}</span>
            </a>
          )}
          {contactSettings?.showPhone !== false && contactSettings?.phone && (
            <a
              href={`tel:${contactSettings.phone.replace(/\s+/g, '')}`}
              className="hover:text-primary flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              <span>{contactSettings.phone}</span>
            </a>
          )}
        </div>
        {contactSettings?.showLocation !== false && contactSettings?.location && (
          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{contactSettings.location}</span>
          </div>
        )}
      </div>

      {/* MAIN GRID */}
      <div className="text-foreground mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-6 py-6 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        {/* ========== LEFT COLUMN (DESKTOP) ========== */}
        {/* Hidden on mobile, block on Desktop */}
        <div className="hidden flex-col items-start pt-10 lg:flex">
          {/* Large Illustration */}
          <FadeIn className="mb-8">
            {contactSettings?.illustrationUrl ? (
              <div className="relative h-80 w-80">
                <OptimizedImage
                  src={contactSettings.illustrationUrl}
                  alt={contactSettings.illustrationAlt || 'Ilustración contacto'}
                  fill
                  className="object-contain"
                  sizes="320px"
                />
              </div>
            ) : null}
          </FadeIn>

          {/* Owner Name */}
          <h1 className="text-foreground font-script mb-8 text-5xl">{ownerName}</h1>

          {/* Contact Info Desktop */}
          <div className="mb-8 space-y-4 text-left font-sans text-lg">
            {contactSettings?.showEmail !== false && contactSettings?.email && (
              <a
                href={`mailto:${contactSettings.email}`}
                className="hover:text-primary flex items-center justify-start gap-3 transition-colors"
              >
                <Mail className="h-6 w-6" />
                <span>{contactSettings.email}</span>
              </a>
            )}
            {contactSettings?.showPhone !== false && contactSettings?.phone && (
              <a
                href={`tel:${contactSettings.phone.replace(/\s+/g, '')}`}
                className="hover:text-primary flex items-center justify-start gap-3 transition-colors"
              >
                <Phone className="h-6 w-6" />
                <span>{contactSettings.phone}</span>
              </a>
            )}
            {contactSettings?.showLocation !== false && contactSettings?.location && (
              <div className="flex items-center justify-start gap-3">
                <MapPin className="h-6 w-6" />
                <span>{contactSettings.location}</span>
              </div>
            )}
          </div>

          {/* Instagram Embed Desktop */}
          {contactSettings?.showInstagramEmbed && contactSettings?.instagramPostUrl && (
            <div className="mb-6 w-full max-w-sm">
              <InstagramEmbed postUrl={contactSettings.instagramPostUrl} />
            </div>
          )}

          {/* Social Links Desktop */}
          {contactSettings?.showSocialLinks && socialLinks.length > 0 && (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-primary/20 hover:border-primary/60 flex w-full max-w-xs items-center gap-4 rounded-2xl border px-5 py-4 transition-all hover:scale-[1.02] dark:from-pink-950/20 dark:to-purple-950/20"
                >
                  {iconMap[link.platform] || <span className="text-lg">🔗</span>}
                  <div className="min-w-0">
                    <p>{link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</p>
                    <p className="text-foreground truncate font-semibold">
                      {link.username ? `@${link.username.replace(/^@/, '')}` : link.platform}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ========== RIGHT COLUMN: Contact Form ========== */}
        <div className="w-full">
          <Suspense
            fallback={<div className="bg-muted h-96 w-full animate-pulse rounded-[2.5rem]" />}
          >
            <ContactForm />
          </Suspense>

          {/* MOBILE SOCIAL LINKS (Shown below form on mobile only) */}
          <div className="mt-8 flex justify-center gap-4 lg:hidden">
            {contactSettings?.showSocialLinks &&
              socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="bg-card text-foreground hover:bg-primary hover:text-background flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-110"
                >
                  {iconMap[link.platform] || <span className="text-lg">🔗</span>}
                </a>
              ))}
          </div>

          {/* Instagram Widget Mobile */}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-primary/20 hover:border-primary/60 mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border bg-linear-to-br from-pink-50 via-purple-50 to-orange-50 px-5 py-4 transition-all hover:scale-[1.02] hover:shadow-md lg:hidden dark:from-pink-950/20 dark:via-purple-950/20 dark:to-orange-950/20"
            >
              <Instagram className="text-primary h-6 w-6 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Sígueme en Instagram
                </p>
                <p className="text-foreground font-semibold">
                  {instagramDisplayName
                    ? `@${String(instagramDisplayName).replace(/^@/, '')}`
                    : 'Instagram'}
                </p>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Copyright */}
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
    </section>
  )
}
