import { Suspense } from 'react'
import JsonLd from '@/components/seo/JsonLd'
import ContactForm from '@/components/features/contact/ContactForm'
import InstagramEmbed from '@/components/features/contact/InstagramEmbed'
import { FadeIn, OptimizedImage } from '@/components/ui'
import type { PublicContactPageData } from './contactPageData'
import PublicContactMethods from './PublicContactMethods'
import PublicSocialLinks from './PublicSocialLinks'
import InstagramProfileCard from './InstagramProfileCard'
import PublicContactFooter from './PublicContactFooter'

export default function PublicContactPage({
  contactSettings,
  socialLinks,
  contactMethods,
  ownerName,
  locationSuffix,
  instagramProfileUrl,
  instagramProfileLabel,
}: PublicContactPageData) {
  const primaryContactMethods = contactMethods.filter((method) => method.id !== 'instagram')

  return (
    <section className="bg-background w-full transition-colors duration-500">
      <JsonLd
        type="LocalBusiness"
        data={{
          name: ownerName,
          description: `Maquilladora profesional y caracterizadora${locationSuffix}. Servicios para bodas, editoriales, eventos y caracterización artística.`,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/contacto`,
          telephone: contactSettings?.phone ?? undefined,
          email: contactSettings?.email ?? undefined,
        }}
      />

      <div className="flex flex-col items-center px-6 pt-8 pb-0 text-center lg:hidden">
        <h1 className="text-foreground font-script mb-4 text-4xl">
          {contactSettings?.pageTitle || 'Contacto'}
        </h1>
        <PublicContactMethods methods={primaryContactMethods} orientation="row" />
      </div>

      <div className="text-foreground mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-6 py-6 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        <div className="hidden flex-col items-start pt-10 lg:flex">
          <FadeIn className="mb-8">
            {contactSettings?.illustrationUrl ? (
              <div className="relative h-80 w-80">
                <OptimizedImage
                  src={contactSettings.illustrationUrl}
                  alt={contactSettings.illustrationAlt || 'Ilustración contacto'}
                  fill
                  objectFit="contain"
                  sizes="320px"
                />
              </div>
            ) : null}
          </FadeIn>

          <h1 className="text-foreground font-script mb-8 text-5xl">{ownerName}</h1>

          <div className="mb-8 w-full">
            <PublicContactMethods methods={primaryContactMethods} />
          </div>

          {contactSettings?.showInstagramEmbed && contactSettings?.instagramPostUrl && (
            <div className="mb-6 w-full max-w-sm">
              <InstagramEmbed postUrl={contactSettings.instagramPostUrl} />
            </div>
          )}

          {contactSettings?.showSocialLinks && socialLinks.length > 0 && (
            <PublicSocialLinks links={socialLinks} />
          )}
        </div>

        <div className="w-full">
          <Suspense
            fallback={<div className="bg-muted h-96 w-full animate-pulse rounded-[2.5rem]" />}
          >
            <ContactForm />
          </Suspense>

          {contactSettings?.showSocialLinks && (
            <PublicSocialLinks links={socialLinks} variant="compact" />
          )}

          <InstagramProfileCard href={instagramProfileUrl} label={instagramProfileLabel} />
        </div>
      </div>

      <PublicContactFooter ownerName={ownerName} />
    </section>
  )
}
