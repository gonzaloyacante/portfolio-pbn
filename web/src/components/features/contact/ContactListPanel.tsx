'use client'

import { Contact, ContactFilter, ITEMS_PER_PAGE } from './contactListTypes'
import { ContactCard } from './ContactCard'

interface ContactListPanelProps {
  paginatedContacts: Contact[]
  filteredContacts: Contact[]
  selectedContact: Contact | null
  importantIds: Set<string>
  filter: ContactFilter
  currentPage: number
  totalPages: number
  onSelectContact: (contact: Contact) => void
  onToggleImportant: (id: string, e: React.MouseEvent) => void
  onFilterChange: (filter: ContactFilter) => void
  onPageChange: (page: number) => void
  formatDate: (date: Date) => string
}

export function ContactListPanel({
  paginatedContacts,
  filteredContacts,
  selectedContact,
  importantIds,
  filter,
  currentPage,
  totalPages,
  onSelectContact,
  onToggleImportant,
  onFilterChange,
  onPageChange,
  formatDate,
}: ContactListPanelProps) {
  return (
    <div className="space-y-4 lg:col-span-1">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-lg font-bold">Mensajes ({filteredContacts.length})</h2>
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as ContactFilter)}
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
          <ContactCard
            key={contact.id}
            contact={contact}
            isSelected={selectedContact?.id === contact.id}
            isImportant={importantIds.has(contact.id)}
            onSelect={() => onSelectContact(contact)}
            onToggleImportant={onToggleImportant}
            formatDate={formatDate}
          />
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

      {totalPages > 1 && (
        <div className="border-border flex items-center justify-between border-t pt-4">
          <p className="text-muted-foreground text-sm">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredContacts.length)} de{' '}
            {filteredContacts.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-muted-foreground flex items-center px-3 text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
