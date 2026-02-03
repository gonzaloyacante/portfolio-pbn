'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui'

interface ConfirmDialogOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
}

interface ConfirmDialogProps extends ConfirmDialogOptions {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Accessible confirmation dialog component
 * Replaces browser confirm() with better UX and accessibility
 *
 * @example
 * ```tsx
 * const [confirmOpen, setConfirmOpen] = useState(false)
 *
 * <ConfirmDialog
 *   open={confirmOpen}
 *   title="¿Eliminar proyecto?"
 *   message="Esta acción no se puede deshacer"
 *   confirmText="Eliminar"
 *   variant="danger"
 *   onConfirm={() => {
 *     handleDelete()
 *     setConfirmOpen(false)
 *   }}
 *   onCancel={() => setConfirmOpen(false)}
 * />
 * ```
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  // Focus trap and keyboard events
  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }

    // Focus confirm button when dialog opens
    confirmButtonRef.current?.focus()

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onCancel])

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="border-border bg-card relative z-10 w-full max-w-md rounded-xl border p-6 shadow-2xl"
          >
            {/* Icon */}
            {variant === 'danger' && (
              <div className="mb-4 flex justify-center">
                <div className="bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full">
                  <AlertTriangle className="text-destructive h-6 w-6" />
                </div>
              </div>
            )}

            {/* Title */}
            <h2
              id="confirm-dialog-title"
              className="text-foreground mb-2 text-center text-xl font-semibold"
            >
              {title}
            </h2>

            {/* Message */}
            <p
              id="confirm-dialog-description"
              className="text-muted-foreground mb-6 text-center text-sm"
            >
              {message}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                {cancelText}
              </Button>
              <Button
                ref={confirmButtonRef}
                variant={variant === 'danger' ? 'destructive' : 'primary'}
                onClick={onConfirm}
                className="flex-1"
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Hook for easier usage
export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean
    options: ConfirmDialogOptions
    resolve?: (value: boolean) => void
  }>({
    open: false,
    options: {
      title: '',
      message: '',
    },
  })

  const confirm = (options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        open: true,
        options,
        resolve,
      })
    })
  }

  const handleConfirm = () => {
    state.resolve?.(true)
    setState({ open: false, options: state.options })
  }

  const handleCancel = () => {
    state.resolve?.(false)
    setState({ open: false, options: state.options })
  }

  const Dialog = () => (
    <ConfirmDialog
      open={state.open}
      {...state.options}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  )

  return { confirm, Dialog }
}
