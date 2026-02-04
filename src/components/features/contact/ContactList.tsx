'use client'

import { useState } from 'react'
import { markContactAsRead, markContactAsReplied, deleteContact } from '@/actions/user/contact'
import { useConfirmDialog } from '@/components/ui'

interface Contact {
  id: string
  name: string
  email: string
  message: string
  isRead: boolean
  isReplied: boolean
  adminNote: string | null
  createdAt: Date
  updatedAt: Date
}

interface ContactListProps {
  contacts: Contact[]
}

export default function ContactList({ contacts }: ContactListProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied'>('all')

  const ITEMS_PER_PAGE = 20

  // Filtrar contactos según el filtro seleccionado
  const filteredContacts = contacts.filter((contact) => {
    if (filter === 'unread') return !contact.isRead
    if (filter === 'replied') return contact.isReplied
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

  const handleMarkAsReplied = async (id: string) => {
    setIsLoading(true)
    await markContactAsReplied(id, adminNote)
    setAdminNote('')
    setSelectedContact(null)
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
              setFilter(e.target.value as 'all' | 'unread' | 'replied')
              setCurrentPage(1)
            }}
            className="border-input bg-background text-foreground focus:border-ring rounded-xl border px-3 py-1.5 text-sm focus:outline-none"
          >
            <option value="all">Todos</option>
            <option value="unread">No leídos</option>
            <option value="replied">Respondidos</option>
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
                <div className="flex gap-1">
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
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="text-primary font-medium hover:underline"
                >
                  {selectedContact.email}
                </a>
                <p className="text-muted-foreground mt-1 text-sm">
                  {formatDate(selectedContact.createdAt)}
                </p>
              </div>

              <div className="flex gap-2">
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
                <div className="rounded-2xl border-l-4 border-yellow-400 bg-yellow-50 p-6 dark:bg-yellow-900/10">
                  <p className="text-foreground italy whitespace-pre-wrap">
                    {selectedContact.adminNote}
                  </p>
                </div>
              </div>
            )}

            {!selectedContact.isReplied && (
              <div>
                <h3 className="text-foreground mb-3 font-bold">
                  Agregar nota / Marcar como respondido:
                </h3>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Opcional: Agrega una nota sobre cómo respondiste..."
                  className="border-input bg-input text-foreground placeholder:text-muted-foreground focus:border-ring mb-4 w-full rounded-2xl border p-4 focus:outline-none"
                  rows={4}
                />
                <button
                  onClick={() => handleMarkAsReplied(selectedContact.id)}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-xl px-6 py-4 font-bold shadow-lg transition-all hover:translate-y-[-2px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Marcar como respondido'}
                </button>
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
