'use client'

import { Star, Instagram } from 'lucide-react'
import { Contact, STATUS_LABEL, STATUS_CLASS } from './contactListTypes'

interface ContactCardProps {
  contact: Contact
  isSelected: boolean
  isImportant: boolean
  onSelect: () => void
  onToggleImportant: (id: string, e: React.MouseEvent) => void
  formatDate: (date: Date) => string
}

export function ContactCard({
  contact,
  isSelected,
  isImportant,
  onSelect,
  onToggleImportant,
  formatDate,
}: ContactCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        isSelected
          ? 'border-primary bg-primary/10 shadow-md'
          : 'border-border hover:bg-muted bg-card'
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-foreground font-bold">{contact.name}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => onToggleImportant(contact.id, e)}
            title={isImportant ? 'Quitar importante' : 'Marcar importante'}
            className="text-muted-foreground transition-colors hover:text-warning"
          >
            <Star
              className={`h-3.5 w-3.5 ${isImportant ? 'fill-warning text-warning' : ''}`}
            />
          </button>
          <div className="flex flex-wrap gap-1">
            {!contact.isRead && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-bold">
                Nuevo
              </span>
            )}
            {contact.isReplied && (
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-bold">
                ✓
              </span>
            )}
            {STATUS_LABEL[contact.status] && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_CLASS[contact.status]}`}
              >
                {STATUS_LABEL[contact.status]}
              </span>
            )}
            {contact.priority === 'URGENT' && (
              <span className="bg-destructive/15 text-destructive rounded-full px-2 py-0.5 text-xs font-bold">
                Urgente
              </span>
            )}
            {contact.priority === 'HIGH' && (
              <span className="bg-warning/15 text-warning rounded-full px-2 py-0.5 text-xs font-bold">
                Alta
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mb-1 flex items-center gap-2">
        <p className="text-muted-foreground text-sm">{contact.email}</p>
        {contact.instagramUser && (
          <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
            <Instagram className="h-3 w-3" />@{contact.instagramUser}
          </span>
        )}
      </div>
      <p className="text-muted-foreground line-clamp-2 text-sm">{contact.message}</p>
      <p className="text-muted-foreground mt-2 text-xs">{formatDate(contact.createdAt)}</p>
    </button>
  )
}
