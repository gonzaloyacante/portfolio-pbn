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
  isImportant: boolean
  adminNote: string | null
  // Tipo de mensaje y datos de solicitud de servicio (público). Prisma
  // devuelve strings crudos (default 'GENERAL' / 'SERVICE_INQUIRY'); la
  // UI trata el valor como unión al renderizar.
  messageType: string
  customService: string | null
  // Servicio elegido cuando messageType = 'SERVICE_INQUIRY' (FK Prisma)
  service: { name: string; slug: string } | null
  createdAt: Date
  updatedAt: Date
}

export type ContactFilter = 'all' | 'unread' | 'important'

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
