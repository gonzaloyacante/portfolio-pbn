import Image from 'next/image'
import { getAboutSettings } from '@/actions/theme.actions'
import { getActiveTestimonials } from '@/actions/testimonials.actions'
import TestimonialForm from '@/components/public/TestimonialForm'
import TestimonialSlider from '@/components/public/TestimonialSlider'
import JsonLd from '@/components/seo/JsonLd'

/**
 * About Page - Canva Design
 * Left: Signature + Small illustration + Bio text
 * Right: Oval profile image
 * Bottom: Testimonials (moved from homepage)
 */
export default async function AboutPage() {
  const [testimonials, aboutSettings] = await Promise.all([
    getActiveTestimonials(6),
    getAboutSettings(),
  ])

  const bioTitle = aboutSettings?.bioTitle || 'Hola, soy Paola.'
  const bioIntro = aboutSettings?.bioIntro || ''
  const bioDescription = aboutSettings?.bioDescription || ''
  const profileImageUrl = aboutSettings?.profileImageUrl
  const profileImageAlt = aboutSettings?.profileImageAlt || 'Paola Bolívar Nievas'
  const illustrationUrl = aboutSettings?.illustrationUrl
  const illustrationAlt = aboutSettings?.illustrationAlt || 'Ilustración'
  const showTestimonials = aboutSettings?.showTestimonials ?? true
  const testimonialsTitle = aboutSettings?.testimonialsTitle || 'Lo que dicen mis clientes'
  const skills = aboutSettings?.skills || []
  const certifications = aboutSettings?.certifications || []

  // Split bio into paragraphs
  const introParagraphs = bioIntro.split('\n\n').filter(Boolean)
  const descParagraphs = bioDescription.split('\n\n').filter(Boolean)

  return (
    <section className="min-h-screen w-full bg-[var(--background)] transition-colors duration-500">
      <JsonLd
        type="Person"
        data={{
          name: 'Paola Bolívar Nievas',
          description: bioIntro || undefined, // Use undefined for optional fields if empty/null
          image: profileImageUrl || undefined,
          jobTitle: 'Professional Makeup Artist',
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/sobre-mi`,
        }}
      />
      {/* Main Content Grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-6 py-12 md:px-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">

        {/* ========== LEFT COLUMN: Text Content ========== */}
        <div className="order-2 lg:order-1">
          {/* Signature in script font */}
          <h1 className="mb-4 font-[family-name:var(--font-script)] text-3xl text-[var(--primary)] sm:text-4xl lg:text-5xl">
            {bioTitle}
          </h1>

          {/* Small Illustration (optional) */}
          {illustrationUrl && (
            <div className="mb-6">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                <Image
                  src={illustrationUrl}
                  alt={illustrationAlt}
                  fill
                  className="object-contain"
                  sizes="120px"
                />
              </div>
            </div>
          )}

          {/* Bio Intro */}
          <div className="mb-6 max-w-2xl font-[family-name:var(--font-body)] text-base leading-relaxed text-[var(--text-body)]">
            {introParagraphs.map((paragraph, index) => (
              <p key={index} className={index > 0 ? 'mt-4' : ''}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Bio Description */}
          <div className="max-w-2xl space-y-4 font-[family-name:var(--font-body)] text-base leading-relaxed text-[var(--text-body)]">
            {descParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Skills Tags */}
          {skills.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--foreground)]">
                Especialidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[var(--card-bg)] px-4 py-2 text-sm font-medium text-[var(--foreground)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--foreground)]">
                Formación
              </h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-[var(--text-body)]">
                {certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ========== RIGHT COLUMN: Oval Image ========== */}
        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div
            className="relative aspect-[3/4] w-full max-w-xs overflow-hidden shadow-2xl sm:max-w-sm lg:max-w-md"
            style={{ clipPath: 'ellipse(50% 45% at 50% 50%)' }}
          >
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={profileImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 400px"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
                <span className="text-8xl">💄</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== TESTIMONIALS SECTION (moved from homepage) ========== */}
      {showTestimonials && testimonials.length > 0 && (
        <div className="border-t border-[var(--primary)]/10 bg-[var(--background)] py-16 transition-colors duration-500">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <h2 className="mb-12 text-center font-[family-name:var(--font-heading)] text-3xl font-bold text-[var(--foreground)]">
              {testimonialsTitle}
            </h2>

            {/* Testimonial Slider or Grid */}
            {testimonials.length <= 3 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="rounded-[2rem] bg-[var(--card-bg)] p-6 shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="mb-3 text-yellow-400">{'⭐'.repeat(testimonial.rating)}</div>
                    <p className="mb-4 text-sm leading-relaxed text-[var(--text-body)]">
                      &quot;{testimonial.text}&quot;
                    </p>
                    <p className="font-semibold text-[var(--foreground)]">— {testimonial.name}</p>
                    {testimonial.position && (
                      <p className="text-xs text-[var(--text-body)]/70">{testimonial.position}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <TestimonialSlider testimonials={testimonials} />
            )}

            {/* Testimonial Submission Form */}
            <div className="mx-auto mt-16 max-w-lg">
              <h3 className="mb-6 text-center text-xl font-bold text-[var(--foreground)]">
                ¿Has trabajado conmigo? ¡Deja tu opinión!
              </h3>
              <div className="rounded-[2rem] bg-[var(--card-bg)] p-6 shadow-lg">
                <TestimonialForm />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
