export interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  instagramUser: string | null
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

export type ContactFilter = 'all' | 'unread' | 'replied' | 'important'

export const STATUS_LABEL: Record<string, string> = {
  IN_PROGRESS: 'En curso',
  CLOSED: 'Cerrado',
  SPAM: 'Spam',
}

export const STATUS_CLASS: Record<string, string> = {
  IN_PROGRESS: 'bg-warning/15 text-warning',
  CLOSED: 'bg-muted text-muted-foreground',
  SPAM: 'bg-destructive/15 text-destructive',
}

export const ITEMS_PER_PAGE = 20
