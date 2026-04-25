import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import type { ContactMethodItem } from '../contactMethodUtils'

const contactMethodIconMap = {
  email: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  instagram: Instagram,
  location: MapPin,
} as const

interface PublicContactMethodsProps {
  methods: ContactMethodItem[]
  orientation?: 'row' | 'column'
}

export default function PublicContactMethods({
  methods,
  orientation = 'column',
}: PublicContactMethodsProps) {
  if (methods.length === 0) return null

  const containerClassName =
    orientation === 'row'
      ? 'text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm'
      : 'space-y-4 text-left font-sans text-lg'

  const itemClassName =
    orientation === 'row'
      ? 'hover:text-primary flex items-center gap-2 transition-colors'
      : 'hover:text-primary flex items-center justify-start gap-3 transition-colors'

  const iconClassName = orientation === 'row' ? 'h-4 w-4' : 'h-6 w-6'

  return (
    <div className={containerClassName}>
      {methods.map((method) => {
        const Icon = contactMethodIconMap[method.id]
        const content = (
          <>
            <Icon className={iconClassName} />
            <span>{method.value}</span>
          </>
        )

        if (!method.href) {
          return (
            <div key={method.id} className={itemClassName}>
              {content}
            </div>
          )
        }

        return (
          <a
            key={method.id}
            href={method.href}
            className={itemClassName}
            target={method.external ? '_blank' : undefined}
            rel={method.external ? 'noopener noreferrer' : undefined}
          >
            {content}
          </a>
        )
      })}
    </div>
  )
}
