import type { ContactSettingsData } from '@/actions/settings/contact'
import {
  getVisibleContactMethods,
  type ContactMethodId,
} from '@/components/features/contact/contactMethodUtils'
import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

const METHOD_ICONS: Record<ContactMethodId, React.ReactNode> = {
  email: <Mail className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  location: <MapPin className="h-4 w-4" />,
}

interface MaintenanceModeViewProps {
  message?: string | null
  settings: ContactSettingsData | null
}

export default function MaintenanceModeView({ message, settings }: MaintenanceModeViewProps) {
  const methods = getVisibleContactMethods(settings)

  return (
    <div
      className="bg-background text-foreground flex min-h-dvh items-center justify-center p-4"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="bg-card w-full max-w-2xl rounded-2xl p-6 shadow-lg sm:p-10">
        <div className="flex flex-col items-start gap-4">
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">Sitio en mantenimiento</h1>
          <p className="text-muted-foreground max-w-xl text-base">
            {message || 'Estamos realizando mejoras para mejorar la experiencia. Volvemos pronto.'}
          </p>

          <div className="mt-4 w-full">
            {methods.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {methods.map((item) => {
                  const content = (
                    <div className="flex items-start gap-3">
                      <span className="text-primary mt-0.5">{METHOD_ICONS[item.id]}</span>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                          {item.label}
                        </p>
                        <p className="text-foreground text-sm font-semibold break-words">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  )

                  return item.href ? (
                    <a
                      key={item.id}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="border-border bg-background/30 hover:border-primary/40 rounded-xl border p-4 transition-colors"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={item.id}
                      className="border-border bg-background/30 rounded-xl border p-4"
                    >
                      {content}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="border-border bg-background/30 rounded-md border p-4">
                <p className="text-muted-foreground text-sm">
                  Estamos realizando mejoras y no hay canales públicos habilitados en este momento.
                </p>
              </div>
            )}
          </div>

          <p className="text-muted-foreground mt-2 text-xs">
            Sitio temporalmente deshabilitado para mantenimiento.
          </p>
        </div>
      </div>
    </div>
  )
}
