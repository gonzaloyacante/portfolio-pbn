'use client'

import { Copy, Check, Star, Instagram, Mail } from 'lucide-react'
import { Contact } from './contactListTypes'

interface ContactDetailProps {
  contact: Contact
  isLoading: boolean
  copiedField: string | null
  isImportant: boolean
  onToggleImportant: (id: string, e: React.MouseEvent) => void
  onCopy: (value: string, field: string) => void
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  formatDate: (date: Date) => string
}

export function ContactDetail({
  contact,
  isLoading,
  copiedField,
  isImportant,
  onToggleImportant,
  onCopy,
  onMarkAsRead,
  onDelete,
  formatDate,
}: ContactDetailProps) {
  return (
    <div className="border-border bg-card rounded-3xl border p-8 shadow-sm backdrop-blur-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-foreground text-2xl font-bold">{contact.name}</h2>
          <div className="mt-1 flex items-center gap-2">
            <a
              href={`mailto:${contact.email}`}
              className="text-primary font-medium hover:underline"
            >
              {contact.email}
            </a>
            <button
              onClick={() => onCopy(contact.email, 'email')}
              title="Copiar email"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedField === 'email' ? (
                <Check className="text-success h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          {contact.phone && (
            <div className="mt-1 flex items-center gap-2">
              <a
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                className="text-muted-foreground text-sm hover:underline"
              >
                {contact.phone}
              </a>
              <button
                onClick={() => onCopy(contact.phone!, 'phone')}
                title="Copiar teléfono"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedField === 'phone' ? (
                  <Check className="text-success h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
          {contact.instagramUser && (
            <div className="mt-1 flex items-center gap-2">
              <Instagram className="h-4 w-4 text-pink-500" />
              <a
                href={`https://instagram.com/${contact.instagramUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-pink-600 hover:underline dark:text-pink-400"
              >
                @{contact.instagramUser}
              </a>
              <button
                onClick={() => onCopy(`@${contact.instagramUser!}`, 'instagram')}
                title="Copiar usuario"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedField === 'instagram' ? (
                  <Check className="text-success h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
          <p className="text-muted-foreground mt-1 text-sm">{formatDate(contact.createdAt)}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => onToggleImportant(contact.id, e)}
            title={isImportant ? 'Quitar importante' : 'Marcar importante'}
            className={`rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
              isImportant
                ? 'border-warning bg-warning/10 text-warning'
                : 'border-border bg-muted text-muted-foreground hover:border-warning hover:text-warning'
            }`}
          >
            <Star className={`h-4 w-4 ${isImportant ? 'fill-warning' : ''}`} />
          </button>
          {!contact.isRead && (
            <button
              onClick={() => onMarkAsRead(contact.id)}
              disabled={isLoading}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-50"
            >
              Marcar leído
            </button>
          )}
          <button
            onClick={() => onDelete(contact.id)}
            disabled={isLoading}
            className="border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-xl border px-4 py-2 text-sm font-bold disabled:opacity-50"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-foreground mb-3 font-bold">Mensaje:</h3>
        <div className="bg-muted rounded-2xl p-6">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {contact.message}
          </p>
        </div>
      </div>

      {contact.adminNote && (
        <div className="mb-6">
          <h3 className="text-foreground mb-3 font-bold">Nota del administrador:</h3>
          <div className="border-warning bg-warning/10 dark:bg-warning/5 rounded-2xl border-l-4 p-6">
            <p className="text-foreground whitespace-pre-wrap italic">{contact.adminNote}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function ContactDetailEmpty() {
  return (
    <div className="border-border bg-muted/20 flex h-96 items-center justify-center rounded-3xl border-2 border-dashed">
      <div className="text-center">
        <Mail className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
        <p className="text-muted-foreground font-medium">
          Selecciona un mensaje para ver los detalles
        </p>
      </div>
    </div>
  )
}
