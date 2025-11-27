'use client'

import { useState } from 'react'
import { markContactAsRead, markContactAsReplied, deleteContact } from '@/actions/contact.actions'

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

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mensajes ({filteredContacts.length})
          </h2>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as 'all' | 'unread' | 'replied')
              setCurrentPage(1)
            }}
            className="rounded-lg border-2 border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                selectedContact?.id === contact.id
                  ? 'border-wine bg-pink-light dark:border-pink-hot dark:bg-purple-dark/50'
                  : 'hover:border-wine/30 dark:hover:border-pink-hot/30 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
              }`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{contact.name}</h3>
                <div className="flex gap-1">
                  {!contact.isRead && (
                    <span className="bg-wine dark:bg-pink-hot dark:text-purple-dark rounded-full px-2 py-0.5 text-xs font-medium text-white">
                      Nuevo
                    </span>
                  )}
                  {contact.isReplied && (
                    <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                      ✓
                    </span>
                  )}
                </div>
              </div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">{contact.email}</p>
              <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
                {contact.message}
              </p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                {formatDate(contact.createdAt)}
              </p>
            </button>
          ))}

          {filteredContacts.length === 0 && (
            <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-800">
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all'
                  ? 'No hay mensajes aún'
                  : `No hay mensajes ${filter === 'unread' ? 'sin leer' : 'respondidos'}`}
              </p>
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredContacts.length)} de{' '}
              {filteredContacts.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="bg-wine hover:bg-wine/90 dark:bg-pink-hot dark:text-purple-dark rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="flex items-center px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="bg-wine hover:bg-wine/90 dark:bg-pink-hot dark:text-purple-dark rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="rounded-lg border-2 border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedContact.name}
                </h2>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="text-wine dark:text-pink-hot hover:underline"
                >
                  {selectedContact.email}
                </a>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(selectedContact.createdAt)}
                </p>
              </div>

              <div className="flex gap-2">
                {!selectedContact.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(selectedContact.id)}
                    disabled={isLoading}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    Marcar leído
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  disabled={isLoading}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Mensaje:</h3>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {selectedContact.message}
                </p>
              </div>
            </div>

            {selectedContact.adminNote && (
              <div className="mb-6">
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Nota del administrador:
                </h3>
                <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {selectedContact.adminNote}
                  </p>
                </div>
              </div>
            )}

            {!selectedContact.isReplied && (
              <div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                  Agregar nota / Marcar como respondido:
                </h3>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Opcional: Agrega una nota sobre cómo respondiste..."
                  className="mb-4 w-full rounded-lg border-2 border-gray-300 p-4 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  rows={4}
                />
                <button
                  onClick={() => handleMarkAsReplied(selectedContact.id)}
                  disabled={isLoading}
                  className="w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600 disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Marcar como respondido'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Selecciona un mensaje para ver los detalles
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
