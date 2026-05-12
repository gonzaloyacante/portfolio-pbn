export interface SeedBooking {
  id: string
  date: Date
  endDate: Date
  status: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientNotes?: string
  guestCount: number
  adminNotes?: string
  cancellationReason?: string | null
  totalAmount?: number
  paymentStatus?: string
  paymentMethod?: string
  serviceSlug: string
}

export const bookings: SeedBooking[] = [
  {
    id: 'seed-booking-1',
    date: new Date('2026-06-15T09:00:00Z'),
    endDate: new Date('2026-06-15T14:00:00Z'),
    status: 'CONFIRMED',
    clientName: 'Ana López',
    clientEmail: 'ana.lopez@example.com',
    clientPhone: '+34 654 321 098',
    clientNotes: 'Novia + 3 damas de honor. Preferencia por tonos rosados y naturales.',
    guestCount: 4,
    adminNotes: 'Confirmada con 50€ de depósito via transferencia.',
    totalAmount: 350,
    paymentStatus: 'PARTIAL',
    paymentMethod: 'transfer',
    serviceSlug: 'maquillaje-caracterizacion',
  },
  {
    id: 'seed-booking-2',
    date: new Date('2026-07-03T16:00:00Z'),
    endDate: new Date('2026-07-03T20:00:00Z'),
    status: 'PENDING',
    clientName: 'Rodrigo Alvarado',
    clientEmail: 'rodrigo.alvarado@example.com',
    clientPhone: '+34 678 123 456',
    clientNotes: 'Maquillaje de zombie para sesión de fotos de portfolio de actor.',
    guestCount: 1,
    totalAmount: 150,
    serviceSlug: 'efectos-especiales',
  },
  {
    id: 'seed-booking-3',
    date: new Date('2026-05-20T10:00:00Z'),
    endDate: new Date('2026-05-20T14:00:00Z'),
    status: 'COMPLETED',
    clientName: 'Victoria Sánchez',
    clientEmail: 'victoria.sanchez@example.com',
    clientPhone: '+34 612 987 654',
    clientNotes: 'Sesión editorial para revista local. 3 cambios de look.',
    guestCount: 1,
    adminNotes: 'Cliente muy satisfecha, probable repetición en septiembre.',
    totalAmount: 250,
    paymentStatus: 'PAID',
    paymentMethod: 'transfer',
    serviceSlug: 'maquillaje-editorial',
  },
  {
    id: 'seed-booking-4',
    date: new Date('2026-04-10T11:00:00Z'),
    endDate: new Date('2026-04-10T12:00:00Z'),
    status: 'CANCELLED',
    clientName: 'Pedro Martínez',
    clientEmail: 'pedro.martinez@example.com',
    clientPhone: '+34 645 111 222',
    clientNotes: 'Bigote de tul rubio para obra de teatro.',
    guestCount: 1,
    totalAmount: 80,
    paymentStatus: 'REFUNDED',
    paymentMethod: 'transfer',
    cancellationReason: 'La producción se canceló por problemas de financiación.',
    serviceSlug: 'posticeria-profesional',
  },
  {
    id: 'seed-booking-5',
    date: new Date('2026-08-22T08:00:00Z'),
    endDate: new Date('2026-08-22T18:00:00Z'),
    status: 'CONFIRMED',
    clientName: 'Elena Rodríguez',
    clientEmail: 'elena.rodriguez@example.com',
    clientPhone: '+34 612 345 678',
    clientNotes: 'Boda completa: novia + madre + 4 damas. Prueba previa el 15 de agosto.',
    guestCount: 6,
    adminNotes: 'Presupuesto aceptado. Prueba de maquillaje coordinada.',
    totalAmount: 600,
    paymentStatus: 'PARTIAL',
    paymentMethod: 'transfer',
    serviceSlug: 'maquillaje-caracterizacion',
  },
  {
    id: 'seed-booking-6',
    date: new Date('2026-09-05T10:00:00Z'),
    endDate: new Date('2026-09-05T15:00:00Z'),
    status: 'CONFIRMED',
    clientName: 'Roberto Campos',
    clientEmail: 'roberto.campos@example.com',
    clientPhone: '+34 611 444 555',
    clientNotes: 'Videoclip musical. 3 cambios de look en un solo día. Estilo futurista.',
    guestCount: 1,
    totalAmount: 500,
    paymentStatus: 'PAID',
    paymentMethod: 'transfer',
    serviceSlug: 'efectos-especiales',
  },
]
