import { getContactSettings, getSocialLinks } from '@/actions/theme.actions'
import ContactForm from '@/components/public/ContactForm'
import { Instagram, Music2, MessageCircle, Youtube, Linkedin, Facebook } from 'lucide-react'
import { OptimizedImage, FadeIn } from '@/components/ui'
import { Suspense } from 'react'

/**
 * Contact Page - Canva Design
 * Left: Large illustration + Owner name + Social links
 * Right: Contact form with response preference
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

  return (
    <section className="w-full bg-[var(--background)] transition-colors duration-500">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-6 py-12 md:px-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        {/* ========== LEFT COLUMN: Illustration + Name + Social ========== */}
        <div className="order-2 flex flex-col items-center lg:order-1 lg:items-start">
          {/* Large Illustration */}
          <FadeIn className="mb-8">
            {contactSettings?.illustrationUrl ? (
              <div className="relative h-48 w-48 sm:h-64 sm:w-64 lg:h-80 lg:w-80">
                <OptimizedImage
                  src={contactSettings.illustrationUrl}
                  alt={contactSettings.illustrationAlt || 'Ilustración contacto'}
                  fill
                  className="object-contain"
                  sizes="320px"
                />
              </div>
            ) : (
              <span className="text-[10rem] sm:text-[12rem] lg:text-[14rem]">💄</span>
            )}
          </FadeIn>

          {/* Owner Name */}
          <h1 className="mb-8 text-center font-[family-name:var(--font-script)] text-3xl text-[var(--foreground)] sm:text-4xl lg:text-left lg:text-5xl">
            {contactSettings?.ownerName || 'Paola Bolívar Nievas'}
          </h1>

          {/* Contact Info */}
          <div className="mb-8 space-y-4 text-center lg:text-left">
            {contactSettings?.email && (
              <a
                href={`mailto:${contactSettings.email} `}
                className="flex items-center justify-center gap-3 text-[var(--text-body)] transition-colors hover:text-[var(--primary)] lg:justify-start"
              >
                <span className="text-xl">📧</span>
                <span>{contactSettings.email}</span>
              </a>
            )}
            {contactSettings?.phone && (
              <a
                href={`tel:${contactSettings.phone.replace(/\s+/g, '')} `}
                className="flex items-center justify-center gap-3 text-[var(--text-body)] transition-colors hover:text-[var(--primary)] lg:justify-start"
              >
                <span className="text-xl">📱</span>
                <span>{contactSettings.phone}</span>
              </a>
            )}
            {contactSettings?.location && (
              <div className="flex items-center justify-center gap-3 text-[var(--text-body)] lg:justify-start">
                <span className="text-xl">📍</span>
                <span>{contactSettings.location}</span>
              </div>
            )}
          </div>

          {/* Social Links */}
          {contactSettings?.showSocialLinks && socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--card-bg)] text-[var(--foreground)] transition-all hover:scale-110 hover:bg-[var(--primary)] hover:text-[var(--background)]"
                  aria-label={link.platform}
                >
                  {iconMap[link.platform] || <span className="text-lg">🔗</span>}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ========== RIGHT COLUMN: Contact Form ========== */}
        <div className="order-1 lg:order-2">
          <Suspense
            fallback={<div className="h-96 w-full animate-pulse rounded-[2.5rem] bg-gray-100" />}
          >
            <ContactForm
              formTitle={contactSettings?.formTitle}
              nameLabel={contactSettings?.nameLabel}
              emailLabel={contactSettings?.emailLabel}
              phoneLabel={contactSettings?.phoneLabel}
              messageLabel={contactSettings?.messageLabel}
              preferenceLabel={contactSettings?.preferenceLabel}
              submitLabel={contactSettings?.submitLabel}
              successTitle={contactSettings?.successTitle}
              successMessage={contactSettings?.successMessage}
              sendAnotherLabel={contactSettings?.sendAnotherLabel}
            />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
