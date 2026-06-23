import { Suspense } from 'react'
import JsonLd from '@/components/seo/JsonLd'
import ContactForm from '@/components/features/contact/ContactForm'
import InstagramEmbed from '@/components/features/contact/InstagramEmbed'
import { FadeIn, OptimizedImage } from '@/components/ui'
import { IMAGE_SIZES } from '@/config/image-sizes'
import { ROUTES } from '@/config/routes'
import { getPublicSiteUrl } from '@/lib/site-url'
import type { PublicContactPageData } from './contactPageData'
import PublicContactMethods from './PublicContactMethods'
import PublicSocialLinks from './PublicSocialLinks'
import PublicContactFooter from './PublicContactFooter'

export default function PublicContactPage({
  contactSettings,
  socialLinks,
  contactMethods,
  ownerName,
  locationSuffix,
  serviceOptions,
}: PublicContactPageData) {
  const primaryContactMethods = contactMethods.filter((method) => method.id !== 'instagram')

  return (
    <section className="public-contact-page w-full transition-colors duration-500">
      <JsonLd
        type="LocalBusiness"
        data={{
          name: ownerName,
          description: `Maquilladora profesional y caracterizadora${locationSuffix}. Servicios para bodas, editoriales, eventos y caracterización artística.`,
          url: `${getPublicSiteUrl()}${ROUTES.public.contact}`,
          telephone: contactSettings?.phone ?? undefined,
          email: contactSettings?.email ?? undefined,
          image: contactSettings?.illustrationUrl ?? undefined,
          sameAs: socialLinks.map((link) => link.url),
          address: contactSettings?.location
            ? {
                addressLocality: contactSettings.location,
                addressCountry: 'ES',
              }
            : undefined,
        }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-0 px-4 py-6 sm:px-6 md:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        <div className="flex flex-col items-start">
          <FadeIn className="mb-8 hidden lg:block">
            {contactSettings?.illustrationUrl ? (
              <div className="relative h-80 w-80">
                <OptimizedImage
                  src={contactSettings.illustrationUrl}
                  alt={contactSettings.illustrationAlt || 'Ilustración contacto'}
                  fill
                  objectFit="contain"
                  sizes={IMAGE_SIZES.illustrationMedium}
                />
              </div>
            ) : null}
          </FadeIn>

          <div className="mb-8 w-full space-y-4">
            <PublicContactMethods methods={primaryContactMethods} />
            {contactSettings?.showSocialLinks && socialLinks.length > 0 ? (
              <PublicSocialLinks links={socialLinks} variant="list" className="!space-y-4" />
            ) : null}
          </div>

          {contactSettings?.showInstagramEmbed && contactSettings?.instagramPostUrl && (
            <div className="public-contact-instagram mb-6 w-full max-w-sm self-center overflow-hidden md:self-start">
              <InstagramEmbed postUrl={contactSettings.instagramPostUrl} />
            </div>
          )}
        </div>

        <div className="w-full">
          <Suspense
            fallback={
              <div className="public-contact-form-panel rounded-card h-96 w-full animate-pulse" />
            }
          >
            <ContactForm serviceOptions={serviceOptions} />
          </Suspense>
        </div>
      </div>

      <PublicContactFooter ownerName={ownerName} />
    </section>
  )
}
