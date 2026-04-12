'use client'

import { Contact } from './contactListTypes'
import { useContactList } from './useContactList'
import { ContactListPanel } from './ContactListPanel'
import { ContactDetail, ContactDetailEmpty } from './ContactDetail'

interface ContactListProps {
  contacts: Contact[]
}

export default function ContactList({ contacts }: ContactListProps) {
  const {
    selectedContact,
    setSelectedContact,
    isLoading,
    currentPage,
    setCurrentPage,
    filter,
    handleFilterChange,
    copiedField,
    importantIds,
    filteredContacts,
    paginatedContacts,
    totalPages,
    handleToggleImportant,
    handleCopy,
    handleMarkAsRead,
    handleDelete,
    formatDate,
    Dialog,
  } = useContactList(contacts)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ContactListPanel
        paginatedContacts={paginatedContacts}
        filteredContacts={filteredContacts}
        selectedContact={selectedContact}
        importantIds={importantIds}
        filter={filter}
        currentPage={currentPage}
        totalPages={totalPages}
        onSelectContact={setSelectedContact}
        onToggleImportant={handleToggleImportant}
        onFilterChange={handleFilterChange}
        onPageChange={setCurrentPage}
        formatDate={formatDate}
      />

      <div className="lg:col-span-2">
        {selectedContact ? (
          <ContactDetail
            contact={selectedContact}
            isLoading={isLoading}
            copiedField={copiedField}
            isImportant={importantIds.has(selectedContact.id)}
            onToggleImportant={handleToggleImportant}
            onCopy={handleCopy}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            formatDate={formatDate}
          />
        ) : (
          <ContactDetailEmpty />
        )}
      </div>
      <Dialog />
    </div>
  )
}
