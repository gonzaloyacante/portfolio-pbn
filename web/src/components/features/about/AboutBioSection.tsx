'use client'

import { FadeIn, OptimizedImage, SlideIn } from '@/components/ui'
import { IMAGE_SIZES } from '@/config/image-sizes'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Palette } from 'lucide-react'

interface AboutBioColumnProps {
  bioTitle: string
  bioIntro: string
  bioDescription: string
  illustrationUrl?: string | null
  illustrationAlt: string
  illustrationMaxPx?: number | null
  illustrationMobileMaxPx?: number | null
  bioTitleFont?: string | null
  bioTitleFontUrl?: string | null
  bioTitleFontSize?: number | null
  bioTitleMobileFontSize?: number | null
  bioTitleColor?: string | null
  bioTitleColorDark?: string | null
  skills: string[]
  certifications: string[]
}

function BioParagraphs({ text, baseDelay }: { text: string; baseDelay: number }) {
  const paragraphs = text.split('\n\n').filter(Boolean)
  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <FadeIn key={index} delay={baseDelay + index * 0.1} className={index > 0 ? 'mt-4' : ''}>
          <p>{paragraph}</p>
        </FadeIn>
      ))}
    </>
  )
}

function SkillTags({ skills }: { skills: string[] }) {
  if (skills.length === 0) return null
  return (
    <FadeIn delay={0.6} className="mt-8">
      <h3 className="public-about-heading font-heading mb-3 text-lg font-semibold">
        Especialidades
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="public-about-skill-chip rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </FadeIn>
  )
}

function CertificationList({ certifications }: { certifications: string[] }) {
  if (certifications.length === 0) return null
  return (
    <FadeIn delay={0.7} className="mt-6">
      <h3 className="public-about-heading font-heading mb-3 text-lg font-semibold">Formación</h3>
      <ul className="public-about-text list-inside list-disc space-y-1 text-sm">
        {certifications.map((cert, index) => (
          <li key={index}>{cert}</li>
        ))}
      </ul>
    </FadeIn>
  )
}

export function AboutBioColumn({
  bioTitle,
  bioIntro,
  bioDescription,
  illustrationUrl,
  illustrationAlt,
  illustrationMaxPx,
  illustrationMobileMaxPx,
  bioTitleFont,
  bioTitleFontUrl,
  bioTitleFontSize,
  bioTitleMobileFontSize,
  bioTitleColor,
  bioTitleColorDark,
  skills,
  certifications,
}: AboutBioColumnProps) {
  // Public web colors are fixed; CMS title colors stay disabled here for now.
  void bioTitle
  void bioTitleFont
  void bioTitleFontUrl
  void bioTitleFontSize
  void bioTitleMobileFontSize
  void bioTitleColor
  void bioTitleColorDark

  const isMobile = useIsMobile()

  const illPx = isMobile
    ? (illustrationMobileMaxPx ?? illustrationMaxPx ?? 96)
    : (illustrationMaxPx ?? illustrationMobileMaxPx ?? 112)

  return (
    <div className="order-2 lg:order-1">
      {illustrationUrl && (
        <FadeIn delay={0.2} className="mb-6">
          <div
            className="relative shrink-0 overflow-hidden"
            style={{ width: illPx, height: illPx, maxWidth: '100%' }}
          >
            <OptimizedImage
              src={illustrationUrl}
              alt={illustrationAlt}
              fill
              objectFit="contain"
              sizes={IMAGE_SIZES.illustrationSmall}
            />
          </div>
        </FadeIn>
      )}

      <div className="public-about-text font-body mb-6 max-w-2xl text-base leading-relaxed">
        <BioParagraphs text={bioIntro} baseDelay={0.3} />
      </div>

      <div className="public-about-text font-body max-w-2xl space-y-4 text-base leading-relaxed">
        <BioParagraphs text={bioDescription} baseDelay={0.5} />
      </div>

      <SkillTags skills={skills} />
      <CertificationList certifications={certifications} />
    </div>
  )
}

interface AboutProfileImageProps {
  profileImageUrl?: string | null
  profileImageAlt: string
  shape?: string | null
  shadowEnabled?: boolean
  shadowBlur?: number | null
  shadowSpread?: number | null
  shadowOffsetX?: number | null
  shadowOffsetY?: number | null
  shadowColor?: string | null
  shadowOpacity?: number | null
}

function buildProfileImageBoxShadow(
  enabled: boolean,
  opts: {
    ox: number
    oy: number
    blur: number
    spread: number
    opacity: number | null | undefined
  }
): string {
  if (!enabled) return 'none'
  const alpha = (opts.opacity ?? 35) / 100
  return `${opts.ox}px ${opts.oy}px ${opts.blur}px ${opts.spread}px rgb(var(--public-about-portrait-shadow-rgb) / ${alpha})`
}

const IMAGE_SHAPES: Record<string, string | undefined> = {
  ellipse: undefined,
  circle: 'circle(48% at 50% 50%)',
  rounded: undefined,
  none: undefined,
}

export function AboutProfileImage({
  profileImageUrl,
  profileImageAlt,
  shape,
  shadowEnabled = true,
  shadowBlur,
  shadowSpread,
  shadowOffsetX,
  shadowOffsetY,
  shadowColor,
  shadowOpacity,
}: AboutProfileImageProps) {
  // Public web colors are fixed; CMS shadow color stays disabled here for now.
  void shadowColor

  const shapeKey = shape ?? 'none'
  const clipPath = IMAGE_SHAPES[shapeKey]
  const borderRadius =
    shapeKey === 'rounded' || shapeKey === 'ellipse'
      ? '2.5rem'
      : shapeKey === 'none'
        ? '0'
        : undefined

  const boxShadow = buildProfileImageBoxShadow(shadowEnabled, {
    ox: shadowOffsetX ?? 0,
    oy: shadowOffsetY ?? 8,
    blur: shadowBlur ?? 24,
    spread: shadowSpread ?? 0,
    opacity: shadowOpacity,
  })

  return (
    <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
      <SlideIn direction="right" className="flex w-full justify-center lg:justify-end">
        <div
          className="relative aspect-3/4 w-full max-w-full overflow-hidden lg:max-w-xl"
          style={{ clipPath, borderRadius, boxShadow }}
        >
          {profileImageUrl ? (
            <OptimizedImage
              src={profileImageUrl}
              alt={profileImageAlt}
              fill
              sizes={IMAGE_SIZES.aboutProfile}
              priority
              variant="card"
            />
          ) : (
            <div className="public-about-portrait-fallback flex h-full items-center justify-center">
              <Palette
                className="public-about-portrait-fallback-icon size-[28%] min-w-[4rem]"
                aria-hidden
                strokeWidth={1.25}
              />
              <span className="sr-only">{profileImageAlt}</span>
            </div>
          )}
        </div>
      </SlideIn>
    </div>
  )
}
