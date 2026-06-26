'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, TextArea, Select } from '@/components/ui'
import { showToast } from '@/lib/toast'
import { ROUTES } from '@/config/routes'
import { updateBookingAdmin, type BookingForEdit } from '@/actions/cms/bookings'
import { format } from 'date-fns'

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'CONFIRMED', label: 'Confirmada' },
  { value: 'IN_PROGRESS', label: 'En curso' },
  { value: 'COMPLETED', label: 'Completada' },
  { value: 'CANCELLED', label: 'Cancelada' },
  { value: 'NO_SHOW', label: 'No apareció' },
]

const PAYMENT_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'PARTIAL', label: 'Pago parcial' },
  { value: 'PAID', label: 'Pagado' },
  { value: 'REFUNDED', label: 'Reembolsado' },
]

const PAYMENT_METHOD_OPTIONS = [
  { value: '', label: '— Sin especificar —' },
  { value: 'cash', label: 'Efectivo' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'mercadopago', label: 'MercadoPago' },
]

interface Props {
  booking: BookingForEdit
  services: Array<{ id: string; name: string }>
}

export default function BookingEditForm({ booking, services }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(booking.status)
  const [serviceId, setServiceId] = useState(booking.serviceId)
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus ?? 'PENDING')
  const [paymentMethod, setPaymentMethod] = useState(booking.paymentMethod ?? '')

  const updateWithId = updateBookingAdmin.bind(null, booking.id)
  const [state, formAction, isPending] = useActionState(updateWithId, null)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      showToast.success('Reserva actualizada correctamente')
      router.push(ROUTES.admin.calendar)
    } else if (state.error) {
      showToast.error(state.error)
    }
  }, [state, router])

  const defaultDate = format(new Date(booking.date), "yyyy-MM-dd'T'HH:mm")

  return (
    <form action={formAction} className="space-y-6">
      {/* Status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Estado de la reserva"
          name="status"
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
        />

        <div className="space-y-1.5">
          <Select
            label="Servicio *"
            name="serviceId"
            value={serviceId}
            onChange={setServiceId}
            options={services.map((s) => ({ value: s.id, label: s.name }))}
            required
            error={state?.fieldErrors?.serviceId?.[0]}
          />
        </div>
      </div>

      {/* Date / Time */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="date" className="text-foreground text-sm font-medium">
            Fecha y hora *
          </label>
          <input
            id="date"
            name="date"
            type="datetime-local"
            defaultValue={defaultDate}
            required
            className="border-border bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
          {state?.fieldErrors?.date && (
            <p className="text-destructive text-xs">{state.fieldErrors.date[0]}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="guestCount" className="text-foreground text-sm font-medium">
            Asistentes
          </label>
          <Input
            id="guestCount"
            name="guestCount"
            type="number"
            min={1}
            defaultValue={booking.guestCount ?? 1}
          />
        </div>
      </div>

      {/* Client Info */}
      <fieldset className="border-border rounded-xl border p-4">
        <legend className="text-foreground px-1 text-sm font-semibold">Datos del cliente</legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="clientName" className="text-foreground text-sm font-medium">
              Nombre *
            </label>
            <Input id="clientName" name="clientName" defaultValue={booking.clientName} required />
            {state?.fieldErrors?.clientName && (
              <p className="text-destructive text-xs">{state.fieldErrors.clientName[0]}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="clientEmail" className="text-foreground text-sm font-medium">
              Email *
            </label>
            <Input
              id="clientEmail"
              name="clientEmail"
              type="email"
              defaultValue={booking.clientEmail}
              required
            />
            {state?.fieldErrors?.clientEmail && (
              <p className="text-destructive text-xs">{state.fieldErrors.clientEmail[0]}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="clientPhone" className="text-foreground text-sm font-medium">
              Teléfono
            </label>
            <Input
              id="clientPhone"
              name="clientPhone"
              type="tel"
              placeholder="+54911..."
              defaultValue={booking.clientPhone ?? ''}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <TextArea
              label="Notas del cliente"
              id="clientNotes"
              name="clientNotes"
              rows={2}
              defaultValue={booking.clientNotes ?? ''}
            />
          </div>
        </div>
      </fieldset>

      {/* Admin Notes */}
      <div className="space-y-1.5">
        <TextArea
          label="🔒 Notas internas (admin)"
          id="adminNotes"
          name="adminNotes"
          rows={2}
          defaultValue={booking.adminNotes ?? ''}
        />
      </div>

      {/* Cancellation Reason */}
      <div className="space-y-1.5">
        <label htmlFor="cancellationReason" className="text-foreground text-sm font-medium">
          Motivo de cancelación
        </label>
        <Input
          id="cancellationReason"
          name="cancellationReason"
          placeholder="Solo si fue cancelada o no apareció"
          defaultValue={booking.cancellationReason ?? ''}
        />
      </div>

      {/* Payment */}
      <fieldset className="border-border rounded-xl border p-4">
        <legend className="text-foreground px-1 text-sm font-semibold">Pago</legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="totalAmount" className="text-foreground text-sm font-medium">
              Monto total
            </label>
            <Input
              id="totalAmount"
              name="totalAmount"
              type="number"
              step="0.01"
              min={0}
              placeholder="0.00"
              defaultValue={booking.totalAmount ?? ''}
            />
          </div>
          <Select
            label="Estado de pago"
            name="paymentStatus"
            value={paymentStatus}
            onChange={setPaymentStatus}
            options={PAYMENT_STATUS_OPTIONS}
          />
          <Select
            label="Método de pago"
            name="paymentMethod"
            value={paymentMethod}
            onChange={setPaymentMethod}
            options={PAYMENT_METHOD_OPTIONS}
            clearable
          />
        </div>
      </fieldset>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(ROUTES.admin.calendar)}
          disabled={isPending}
          loading={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} loading={isPending}>
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}
