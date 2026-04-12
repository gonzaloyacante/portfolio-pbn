'use client'

import { useState } from 'react'
import { markContactAsRead, deleteContact, toggleContactImportant } from '@/actions/user/contact'
import { useConfirmDialog } from '@/components/ui'
import { Contact, ContactFilter, ITEMS_PER_PAGE } from './contactListTypes'

export function useContactList(contacts: Contact[]) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<ContactFilter>('all')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [importantIds, setImportantIds] = useState<Set<string>>(
    () => new Set(contacts.filter((c) => c.isImportant).map((c) => c.id))
  )

  const { confirm, Dialog } = useConfirmDialog()

  const filteredContacts = contacts.filter((contact) => {
    if (filter === 'unread') return !contact.isRead
    if (filter === 'replied') return contact.isReplied
    if (filter === 'important') return importantIds.has(contact.id)
    return true
  })

  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleFilterChange = (newFilter: ContactFilter) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  const handleToggleImportant = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setImportantIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
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

  const handleMarkAsRead = async (id: string) => {
    setIsLoading(true)
    await markContactAsRead(id)
    setIsLoading(false)
  }

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

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return {
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
  }
}
