'use client'

import { Toaster } from 'react-hot-toast'
import { STATUS_COLORS } from '@/lib/design-tokens'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--card)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-primary)',
            secondary: 'var(--card)',
          },
        },
        error: {
          iconTheme: {
            primary: STATUS_COLORS.danger,
            secondary: 'var(--card)',
          },
        },
      }}
    />
  )
}
