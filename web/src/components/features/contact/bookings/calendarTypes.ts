export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface Booking {
  id: string
  date: Date
  status: BookingStatus
  clientName: string
  clientEmail: string
  clientPhone: string | null
  clientNotes: string | null
  guestCount: number | null
  adminNotes: string | null
  service: {
    name: string
    duration: string | null
  }
}

export type ViewMode = 'calendar' | 'list'
