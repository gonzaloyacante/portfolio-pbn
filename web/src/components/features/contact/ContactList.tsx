'use client'

import { useState } from 'react'
import { Copy, Check, Star } from 'lucide-react'
import { markContactAsRead, deleteContact, toggleContactImportant } from '@/actions/user/contact'
import { useConfirmDialog } from '@/components/ui'

interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  priority: string
  isRead: boolean
  isReplied: boolean
  isImportant: boolean
  adminNote: string | null
  createdAt: Date
  updatedAt: Date
}

const STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: 'En curso',
  CLOSED: 'Cerrado',
  SPAM: 'Spam',
}

const STATUS_CLASS: Record<string, string> = {
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  CLOSED: 'bg-muted text-muted-foreground',
  SPAM: 'bg-destructive/15 text-destructive',
}

interface ContactListProps {
  contacts: Contact[]
}

export default function ContactList({ contacts }: ContactListProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied' | 'important'>('all')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [importantIds, setImportantIds] = useState<Set<string>>(
    () => new Set(contacts.filter((c) => c.isImportant).map((c) => c.id))
  )

  const handleToggleImportant = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setImportantIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    await toggleContactImportant(id)
  }

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
      })
      .catch(() => {})
  }

  const ITEMS_PER_PAGE = 20

  // Filtrar contactos según el filtro seleccionado
  const filteredContacts = contacts.filter((contact) => {
    if (filter === 'unread') return !contact.isRead
    if (filter === 'replied') return contact.isReplied
    if (filter === 'important') return importantIds.has(contact.id)
    return true
  })

  // Paginación
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleMarkAsRead = async (id: string) => {
    setIsLoading(true)
    await markContactAsRead(id)
    setIsLoading(false)
  }

  // Confirmation Dialog
  const { confirm, Dialog } = useConfirmDialog()

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: '¿Eliminar mensaje?',
      message:
        '¿Estás seguro de que quieres eliminar este mensaje? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      variant: 'danger',
    })

    if (isConfirmed) {
      setIsLoading(true)
      await deleteContact(id)
      setSelectedContact(null)
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Lista de contactos */}
      <div className="space-y-4 lg:col-span-1">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-bold">
            Mensajes ({filteredContacts.length})
          </h2>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as 'all' | 'unread' | 'replied' | 'important')
              setCurrentPage(1)
            }}
            className="border-input bg-background text-foreground focus:border-ring rounded-xl border px-3 py-1.5 text-sm focus:outline-none"
          >
            <option value="all">Todos</option>
            <option value="unread">No leídos</option>
            <option value="replied">Respondidos</option>
            <option value="important">⭐ Importantes</option>
          </select>
        </div>

        <div className="space-y-2">
          {paginatedContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full rounded-2xl border p-4 text-left transition-all ${
                selectedContact?.id === contact.id
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border hover:bg-muted bg-card'
              }`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="text-foreground font-bold">{contact.name}</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleToggleImportant(contact.id, e)}
                    title={importantIds.has(contact.id) ? 'Quitar importante' : 'Marcar importante'}
                    className="text-muted-foreground transition-colors hover:text-yellow-500"
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${importantIds.has(contact.id) ? 'fill-yellow-400 text-yellow-400' : ''}`}
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
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        Alta
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-1 text-sm">{contact.email}</p>
              <p className="text-muted-foreground line-clamp-2 text-sm">{contact.message}</p>
              <p className="text-muted-foreground mt-2 text-xs">{formatDate(contact.createdAt)}</p>
            </button>
          ))}

          {filteredContacts.length === 0 && (
            <div className="border-border bg-muted/20 rounded-2xl border-2 border-dashed p-8 text-center">
              <p className="text-muted-foreground font-medium">
                {filter === 'all'
                  ? 'No hay mensajes aún'
                  : `No hay mensajes ${filter === 'unread' ? 'sin leer' : 'respondidos'}`}
              </p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="border-border flex items-center justify-between border-t pt-4">
            <p className="text-muted-foreground text-sm">
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredContacts.length)} de{' '}
              {filteredContacts.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-muted-foreground flex items-center px-3 text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detalle del contacto */}
      <div className="lg:col-span-2">
        {selectedContact ? (
          <div className="border-border bg-card rounded-3xl border p-8 shadow-sm backdrop-blur-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-foreground text-2xl font-bold">{selectedContact.name}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-primary font-medium hover:underline"
                  >
                    {selectedContact.email}
                  </a>
                  <button
                    onClick={() => handleCopy(selectedContact.email, 'email')}
                    title="Copiar email"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copiedField === 'email' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {selectedContact.phone && (
                  <div className="mt-1 flex items-center gap-2">
                    <a
                      href={`tel:${selectedContact.phone.replace(/\s+/g, '')}`}
                      className="text-muted-foreground text-sm hover:underline"
                    >
                      {selectedContact.phone}
                    </a>
                    <button
                      onClick={() => handleCopy(selectedContact.phone!, 'phone')}
                      title="Copiar teléfono"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedField === 'phone' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )}
                <p className="text-muted-foreground mt-1 text-sm">
                  {formatDate(selectedContact.createdAt)}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => handleToggleImportant(selectedContact.id, e)}
                  title={
                    importantIds.has(selectedContact.id) ? 'Quitar importante' : 'Marcar importante'
                  }
                  className={`rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
                    importantIds.has(selectedContact.id)
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20'
                      : 'border-border bg-muted text-muted-foreground hover:border-yellow-400 hover:text-yellow-600'
                  }`}
                >
                  <Star
                    className={`h-4 w-4 ${importantIds.has(selectedContact.id) ? 'fill-yellow-400' : ''}`}
                  />
                </button>
                {!selectedContact.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(selectedContact.id)}
                    disabled={isLoading}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-50"
                  >
                    Marcar leído
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedContact.id)}
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
                  {selectedContact.message}
                </p>
              </div>
            </div>

            {selectedContact.adminNote && (
              <div className="mb-6">
                <h3 className="text-foreground mb-3 font-bold">Nota del administrador:</h3>
                <div className="border-warning bg-warning/10 dark:bg-warning/5 rounded-2xl border-l-4 p-6">
                  <p className="text-foreground italy whitespace-pre-wrap">
                    {selectedContact.adminNote}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-border bg-muted/20 flex h-96 items-center justify-center rounded-3xl border-2 border-dashed">
            <div className="text-center">
              <span className="mb-4 block text-4xl">📩</span>
              <p className="text-muted-foreground font-medium">
                Selecciona un mensaje para ver los detalles
              </p>
            </div>
          </div>
        )}
      </div>
      <Dialog />
    </div>
  )
}
