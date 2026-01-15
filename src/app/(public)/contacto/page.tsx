import ContactForm from '@/components/public/ContactForm'
import { getSiteConfig } from '@/actions/settings.actions'
import { getContactSettings } from '@/actions/theme.actions'

/**
 * Página de Contacto
 */
export default async function ContactPage() {
  const [config, contactSettings] = await Promise.all([getSiteConfig(), getContactSettings()])

  // Prefer contact settings for contact info, fall back to site config or defaults
  const emails = contactSettings?.emails?.length
    ? contactSettings.emails
    : [config?.contactEmail || 'paolabolivarnievas@gmail.com']

  const phones = contactSettings?.phones?.length
    ? contactSettings.phones
    : config?.contactPhone
      ? [config.contactPhone]
      : []

  const locationString =
    [
      contactSettings?.addressLine1,
      contactSettings?.addressLine2,
      contactSettings?.city,
      contactSettings?.country,
    ]
      .filter(Boolean)
      .join(', ') || config?.contactLocation

  return (
    <section
      className="min-h-screen w-full transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 px-4 py-12 sm:px-6 md:px-12 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20">
        {/* Columna Izquierda - Info */}
        <div className="order-2 flex flex-col items-center lg:order-1 lg:items-start">
          <div className="mb-6 lg:mb-8">
            <span className="text-[8rem] sm:text-[10rem] lg:text-[14rem]">💄</span>
          </div>

          <h1
            className="font-script mb-8 text-center lg:text-left"
            style={{ color: 'var(--color-text)', fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            {config?.ownerName || 'Paola Bolívar Nievas'}
          </h1>

          <div
            className="space-y-6 text-center lg:text-left"
            style={{ color: 'var(--color-text)' }}
          >
            {/* Emails */}
            <div className="space-y-2">
              {emails.map((email) => (
                <div
                  key={email}
                  className="flex items-center justify-center gap-3 lg:justify-start"
                >
                  <span className="text-xl">📧</span>
                  <a
                    href={`mailto:${email}`}
                    className="cursor-pointer transition-opacity duration-200 hover:opacity-70"
                  >
                    {email}
                  </a>
                </div>
              ))}
            </div>

            {/* Ubicación */}
            {locationString && (
              <div className="flex items-start justify-center gap-3 lg:justify-start">
                <span className="text-xl">📍</span>
                <span className="max-w-xs">{locationString}</span>
              </div>
            )}

            {/* Teléfonos */}
            {phones.length > 0 && (
              <div className="space-y-2">
                {phones.map((phone) => (
                  <div
                    key={phone}
                    className="flex items-center justify-center gap-3 lg:justify-start"
                  >
                    <span className="text-xl">📱</span>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="cursor-pointer transition-opacity duration-200 hover:opacity-70"
                    >
                      {phone}
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Horarios (Nuevo) */}
            {contactSettings?.hoursTitle && (
              <div className="mt-8 rounded-2xl bg-white/50 p-6 backdrop-blur-sm dark:bg-black/20">
                <h3 className="mb-3 font-bold">{contactSettings.hoursTitle}</h3>
                <div className="space-y-2 text-sm">
                  {contactSettings.hoursWeekdays && (
                    <div className="flex justify-between gap-4">
                      <span>Lunes a Viernes:</span>
                      <span className="font-medium">{contactSettings.hoursWeekdays}</span>
                    </div>
                  )}
                  {contactSettings.hoursSaturday && (
                    <div className="flex justify-between gap-4">
                      <span>Sábados:</span>
                      <span className="font-medium">{contactSettings.hoursSaturday}</span>
                    </div>
                  )}
                  {contactSettings.hoursSunday && (
                    <div className="flex justify-between gap-4">
                      <span>Domingos:</span>
                      <span className="font-medium">{contactSettings.hoursSunday}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Redes Sociales */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 lg:justify-start">
              {config?.socialInstagram && (
                <a
                  href={`https://instagram.com/${config.socialInstagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl transition-transform hover:scale-110"
                  aria-label="Instagram"
                >
                  📸
                </a>
              )}
              {config?.socialTiktok && (
                <a
                  href={`https://tiktok.com/@${config.socialTiktok.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl transition-transform hover:scale-110"
                  aria-label="TikTok"
                >
                  🎵
                </a>
              )}
              {config?.socialWhatsapp && (
                <a
                  href={`https://wa.me/${config.socialWhatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl transition-transform hover:scale-110"
                  aria-label="WhatsApp"
                >
                  💬
                </a>
              )}
              {config?.socialYoutube && (
                <a
                  href={`https://youtube.com/${config.socialYoutube.startsWith('@') ? config.socialYoutube : '@' + config.socialYoutube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl transition-transform hover:scale-110"
                  aria-label="YouTube"
                >
                  ▶️
                </a>
              )}
              {config?.socialLinkedin && (
                <a
                  href={`https://linkedin.com/in/${config.socialLinkedin.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl transition-transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  💼
                </a>
              )}
              {config?.socialFacebook && (
                <a
                  href={`https://facebook.com/${config.socialFacebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl transition-transform hover:scale-110"
                  aria-label="Facebook"
                >
                  📘
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha - Formulario */}
        <div className="order-1 lg:order-2">
          {contactSettings?.isActive === false ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-gray-800">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                El formulario de contacto no está disponible en este momento.
                <br />
                Por favor contáctame a través de mis redes sociales o email.
              </p>
            </div>
          ) : (
            <ContactForm
              formTitle={contactSettings?.formTitle || undefined}
              successMessage={contactSettings?.formSuccessMessage || undefined}
            />
          )}
        </div>
      </div>
    </section>
  )
}
