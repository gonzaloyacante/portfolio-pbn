/**
 * Toast Notifications - Sistema unificado
 *
 * Wrapper de react-hot-toast con opciones predeterminadas coherentes
 * con el design system del proyecto. Reemplaza el doble sistema anterior
 * (react-hot-toast directo + hook useToast).
 *
 * Uso:
 *   import { showToast } from '@/lib/toast'
 *   showToast.success('Guardado', 'Proyecto')
 *   showToast.error('No se pudo guardar')
 */

import toast, { type ToastOptions } from 'react-hot-toast'

const BASE_DURATION = 3500

const baseOptions: ToastOptions = {
  duration: BASE_DURATION,
  position: 'top-right',
}

function formatMessage(message: string, title?: string): string {
  return title ? `**${title}**\n${message}` : message
}

export const showToast = {
  success: (message: string, title?: string, options?: ToastOptions) =>
    toast.success(formatMessage(message, title), { ...baseOptions, ...options }),

  error: (message: string, title?: string, options?: ToastOptions) =>
    toast.error(formatMessage(message, title), {
      ...baseOptions,
      duration: 5000, // Los errores duran más para que el usuario los pueda leer
      ...options,
    }),

  info: (message: string, title?: string, options?: ToastOptions) =>
    toast(formatMessage(message, title), {
      ...baseOptions,
      icon: 'ℹ️',
      ...options,
    }),

  warning: (message: string, title?: string, options?: ToastOptions) =>
    toast(formatMessage(message, title), {
      ...baseOptions,
      icon: '⚠️',
      duration: 4500,
      ...options,
    }),

  dismiss: (id?: string) => toast.dismiss(id),

  promise: toast.promise,
}
