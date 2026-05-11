'use client'

import { useEffect } from 'react'
import { FadeIn, OptimizedImage, SlideIn } from '@/components/ui'
import { IMAGE_SIZES } from '@/config/image-sizes'
import { BRAND } from '@/lib/design-tokens'
import { FontLoader } from '@/components/features/home/FontLoader'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

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
      <h3 className="font-heading mb-3 text-lg font-semibold text-(--foreground)">
        Especialidades
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="rounded-full border border-(--primary)/20 bg-(--primary)/10 px-4 py-2 text-sm font-medium text-(--primary) transition-colors duration-200 hover:bg-(--primary)/20"
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
      <h3 className="font-heading mb-3 text-lg font-semibold text-(--foreground)">Formación</h3>
      <ul className="text-foreground list-inside list-disc space-y-1 text-sm">
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
  const isMobile = useIsMobile()
  const fontUrl = bioTitleFontUrl?.trim() || ''
  const fontName = bioTitleFont?.trim() || ''

  useEffect(() => {
    if (!fontUrl) return
    const dup = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
      (el) => el.getAttribute('href') === fontUrl
    )
    if (dup) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = fontUrl
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }, [fontUrl])

  const titlePx = isMobile ? (bioTitleMobileFontSize ?? bioTitleFontSize) : bioTitleFontSize

  const fontFamily =
    fontName.length > 0
      ? `"${fontName}", var(--font-script), cursive`
      : 'var(--font-script), cursive'

  const lightTitleColor = bioTitleColor?.trim() || undefined
  const darkTitleColor = bioTitleColorDark?.trim() || bioTitleColor?.trim() || undefined

  const illPx = isMobile
    ? (illustrationMobileMaxPx ?? illustrationMaxPx ?? 96)
    : (illustrationMaxPx ?? illustrationMobileMaxPx ?? 112)

  return (
    <div className="order-2 lg:order-1">
      {!fontUrl && fontName ? <FontLoader fonts={[fontName]} /> : null}

      <FadeIn>
        <h1
          className={cn('mb-4 leading-tight', !fontName && 'font-script')}
          style={{
            fontFamily,
            fontSize:
              titlePx != null
                ? `${titlePx}px`
                : 'var(--font-script-size, clamp(1.75rem, 4vw, 2.25rem))',
          }}
        >
          <span className="dark:hidden" style={{ color: lightTitleColor ?? 'var(--primary)' }}>
            {bioTitle}
          </span>
          <span
            className="hidden dark:inline"
            style={{ color: darkTitleColor ?? 'var(--primary)' }}
          >
            {bioTitle}
          </span>
        </h1>
      </FadeIn>

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

      <div className="font-body mb-6 max-w-2xl text-base leading-relaxed text-(--foreground)">
        <BioParagraphs text={bioIntro} baseDelay={0.3} />
      </div>

      <div className="font-body max-w-2xl space-y-4 text-base leading-relaxed text-(--foreground)">
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

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = hex.replace('#', '')
  const full =
    n.length === 3
      ? n
          .split('')
          .map((c) => c + c)
          .join('')
      : n
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function buildProfileImageBoxShadow(
  enabled: boolean,
  opts: {
    ox: number
    oy: number
    blur: number
    spread: number
    hex: string | null | undefined
    opacity: number | null | undefined
  }
): string {
  if (!enabled) return 'none'
  const alpha = (opts.opacity ?? 35) / 100
  const safeHex =
    opts.hex && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(opts.hex) ? opts.hex : BRAND.primary
  const { r, g, b } = hexToRgb(safeHex)
  return `${opts.ox}px ${opts.oy}px ${opts.blur}px ${opts.spread}px rgba(${r}, ${g}, ${b}, ${alpha})`
}

const IMAGE_SHAPES: Record<string, string | undefined> = {
  ellipse: 'ellipse(50% 45% at 50% 50%)',
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
  const shapeKey = shape ?? 'ellipse'
  const clipPath = IMAGE_SHAPES[shapeKey]
  const borderRadius = shapeKey === 'rounded' ? '2.5rem' : shapeKey === 'none' ? '0' : undefined

  const boxShadow = buildProfileImageBoxShadow(shadowEnabled, {
    ox: shadowOffsetX ?? 0,
    oy: shadowOffsetY ?? 8,
    blur: shadowBlur ?? 24,
    spread: shadowSpread ?? 0,
    hex: shadowColor,
    opacity: shadowOpacity,
  })

  return (
    <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
      <SlideIn direction="right" className="flex w-full justify-center lg:justify-end">
        <div
          className="relative aspect-3/4 w-full max-w-xs overflow-hidden sm:max-w-sm lg:max-w-md"
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
            <div className="flex h-full items-center justify-center bg-linear-to-br from-(--primary) to-(--accent)">
              <Palette
                className="size-[28%] min-w-[4rem] text-white/90"
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
