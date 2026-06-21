import type { Metadata } from 'next'
import Link from 'next/link'
import './public-fixed-theme.css'
import Footer from '@/components/layout/Footer'
import MaintenanceModeView from '@/components/layout/MaintenanceModeView'
import Navbar from '@/components/layout/Navbar'
import PageTransitionWrapper from '@/components/layout/PageTransitionWrapper'
import JsonLd from '@/components/seo/JsonLd'
import CookieConsent from '@/components/legal/CookieConsent'
import { Heart } from 'lucide-react'
import { getActiveTestimonials } from '@/actions/cms/testimonials'
import { getActiveServices } from '@/actions/cms/services'
import { getContactSettings } from '@/actions/settings/contact'
import { getHomeSettings } from '@/actions/settings/home'
import { getSocialLinks } from '@/actions/settings/social'
import { getSiteSettings, getPageVisibility } from '@/actions/settings/site'
import { getTestimonialSettings } from '@/actions/settings/testimonials'
import TestimonialSlider from '@/components/features/testimonials/TestimonialSlider'
import { ROUTES } from '@/config/routes'
import { getPublicSiteUrl } from '@/lib/site-url'
import { pickSocialImage, SOCIAL_IMAGE } from '@/lib/seo-metadata'

/** Cache layout público — invalidación explícita desde CMS. */
export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const [site, contact] = await Promise.all([getSiteSettings(), getContactSettings()])

  const ownerName = contact?.ownerName || 'Paola Bolívar Nievas'
  const location = contact?.location || ''
  const siteName = site?.siteName || ownerName
  const siteUrl = getPublicSiteUrl()

  const defaultTitle = site?.defaultMetaTitle || `${ownerName} | Maquilladora Profesional`
  const defaultDescription =
    site?.defaultMetaDescription ||
    `Portfolio de ${ownerName} - Maquilladora profesional especializada en audiovisuales, caracterización, efectos especiales y maquillaje social${location ? ` en ${location}` : ''}, España.`

  const locationKeyword = location
    ? `maquilladora ${location.toLowerCase()}`
    : 'maquilladora profesional'
  const favicon = site?.faviconUrl || '/favicon.ico'
  const ogImage = pickSocialImage(site?.defaultOgImage, site)

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${ownerName}`,
    },
    description: defaultDescription,
    keywords: [
      locationKeyword,
      'maquillaje profesional',
      'caracterización',
      'efectos especiales',
      'maquillaje audiovisual',
      'maquillaje cine',
      'maquillaje teatro',
      ownerName,
    ],
    authors: [{ name: ownerName }],
    creator: ownerName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: siteUrl,
      siteName,
      title: defaultTitle,
      description: defaultDescription,
      images: [
        {
          url: ogImage,
          width: SOCIAL_IMAGE.width,
          height: SOCIAL_IMAGE.height,
          alt: `${ownerName} - portfolio de maquillaje profesional`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
      images: [ogImage],
    },
    robots: {
      index: site?.allowIndexing ?? true,
      follow: site?.allowIndexing ?? true,
      googleBot: {
        index: site?.allowIndexing ?? true,
        follow: site?.allowIndexing ?? true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: '/icons/icon-192x192.png',
    },
    manifest: '/manifest.webmanifest',
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [
    contactSettings,
    visibility,
    testimonialSettings,
    homeSettings,
    socialLinks,
    activeServices,
    allTestimonials,
  ] = await Promise.all([
    getContactSettings(),
    getPageVisibility(),
    getTestimonialSettings(),
    getHomeSettings(),
    getSocialLinks(),
    getActiveServices(),
    getActiveTestimonials(200),
  ])
  const testimonials = testimonialSettings?.showOnAll ? allTestimonials.slice(0, 9) : []

  // ── Maintenance mode: show a styled, responsive maintenance card
  if (visibility.maintenanceMode) {
    return (
      <MaintenanceModeView message={visibility.maintenanceMessage} settings={contactSettings} />
    )
  }

  return (
    <>
      {/* SEO: Schema.org Structured Data */}
      <JsonLd
        type="ProfessionalService"
        data={{
          name: contactSettings?.ownerName || 'Paola Bolívar Nievas',
          email: contactSettings?.email || undefined,
          // Omit phone if it's a placeholder (admin hasn't set a real number yet)
          telephone:
            contactSettings?.phone && !/xxx/i.test(contactSettings.phone)
              ? contactSettings.phone
              : undefined,
          address: contactSettings?.location
            ? {
                addressLocality: contactSettings.location.split(',')[0].trim(),
                addressRegion: 'Andalucía',
                addressCountry: 'ES',
              }
            : {},
          image: pickSocialImage(homeSettings?.heroBackdropUrl || homeSettings?.heroMainImageUrl),
          url: getPublicSiteUrl(),
          sameAs: socialLinks.map((link) => link.url),
          serviceType: activeServices.length
            ? activeServices.map((s: { name: string }) => s.name)
            : undefined,
          aggregateRating: allTestimonials.length
            ? {
                ratingValue: 5,
                reviewCount: allTestimonials.length,
              }
            : undefined,
        }}
      />
      {/* Navbar brand: custom font stays; CMS colors stay disabled for public web. */}
      {visibility.navbarBrandFontUrl && (
        <link rel="stylesheet" href={visibility.navbarBrandFontUrl} />
      )}
      {(visibility.navbarBrandFont || visibility.navbarBrandFontSize) && (
        <style>
          {[
            '.nb-brand{',
            visibility.navbarBrandFont
              ? `font-family:'${visibility.navbarBrandFont.replace(/'/g, '')}',sans-serif !important;`
              : '',
            visibility.navbarBrandFontSize
              ? `font-size:${Number(visibility.navbarBrandFontSize)}px !important;`
              : '',
            // visibility.navbarBrandColor ? `color:${visibility.navbarBrandColor} !important;` : '',
            '}',
            // visibility.navbarBrandColorDark
            //   ? `.dark .nb-brand{color:${visibility.navbarBrandColorDark} !important;}`
            //   : '',
          ].join('')}
        </style>
      )}

      <div className="public-fixed-theme flex min-h-dvh flex-col transition-colors duration-300">
        {/* Skip navigation link - accesibilidad para lectores de pantalla y teclado */}
        <a
          href="#main-content"
          className="public-skip-link sr-only absolute top-4 left-4 z-200 rounded px-4 py-2 text-sm font-semibold focus:not-sr-only focus:block focus:ring-2 focus:ring-white focus:outline-none"
        >
          Saltar al contenido principal
        </a>
        <Navbar
          brandName={contactSettings?.ownerName || 'Paola BN'}
          visibility={visibility}
          brandLogoUrl={homeSettings?.illustrationUrl}
          brandLogoAlt={homeSettings?.illustrationAlt || contactSettings?.ownerName || 'PBN'}
        />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
        </main>
        {testimonialSettings?.showOnAll && testimonials.length > 0 && (
          <div className="public-testimonial-section relative z-10 border-t py-12 transition-colors duration-500 lg:py-14">
            <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
              <h2 className="public-testimonial-title font-heading mb-12 text-center text-3xl font-bold">
                {testimonialSettings?.title || 'Lo que dicen mis clientes'}
              </h2>

              <TestimonialSlider
                testimonials={testimonials}
                autoAdvanceMs={testimonialSettings?.sliderAutoAdvanceMs}
              />

              <div className="mt-12 flex justify-center">
                <Link
                  href={ROUTES.public.testimonialForm}
                  className="public-testimonial-cta inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors hover:opacity-90"
                >
                  <Heart size={16} />
                  ¿Fuiste mi clienta? Deja tu opinión
                </Link>
              </div>
            </div>
          </div>
        )}
        <CookieConsent />
        <Footer ownerName={contactSettings?.ownerName} />
      </div>
    </>
  )
}
