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
          background: '#fff',
          color: '#333',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-primary)',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: STATUS_COLORS.danger,
            secondary: '#fff',
          },
        },
      }}
    />
  )
}
