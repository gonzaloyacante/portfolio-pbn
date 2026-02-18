'use client'

import { FadeIn, SlideIn, OptimizedImage } from '@/components/ui'

interface AboutBioColumnProps {
  bioTitle: string
  bioIntro: string
  bioDescription: string
  illustrationUrl?: string | null
  illustrationAlt: string
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
            className="rounded-full bg-(--card-bg) px-4 py-2 text-sm font-medium text-(--foreground)"
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
      <ul className="list-inside list-disc space-y-1 text-sm text-(--text-body)">
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
  skills,
  certifications,
}: AboutBioColumnProps) {
  return (
    <div className="order-2 lg:order-1">
      <FadeIn>
        <h1 className="font-script mb-4 text-3xl text-(--primary) sm:text-4xl lg:text-5xl">
          {bioTitle}
        </h1>
      </FadeIn>

      {illustrationUrl && (
        <FadeIn delay={0.2} className="mb-6">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28">
            <OptimizedImage
              src={illustrationUrl}
              alt={illustrationAlt}
              fill
              className="object-contain"
              sizes="120px"
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
}

export function AboutProfileImage({ profileImageUrl, profileImageAlt }: AboutProfileImageProps) {
  return (
    <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
      <SlideIn direction="right" className="flex w-full justify-center lg:justify-end">
        <div
          className="relative aspect-3/4 w-full max-w-xs overflow-hidden shadow-2xl sm:max-w-sm lg:max-w-md"
          style={{ clipPath: 'ellipse(50% 45% at 50% 50%)' }}
        >
          {profileImageUrl ? (
            <OptimizedImage
              src={profileImageUrl}
              alt={profileImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 400px"
              priority
              variant="card"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-linear-to-br from-(--primary) to-(--accent)">
              <span className="text-8xl">💄</span>
            </div>
          )}
        </div>
      </SlideIn>
    </div>
  )
}
