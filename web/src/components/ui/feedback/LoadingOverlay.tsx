'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  message?: string
  show: boolean
}

/**
 * Loading overlay for async operations
 * Blocks user interaction and shows loading spinner
 *
 * @example
 * ```tsx
 * const [isLoading, setIsLoading] = useState(false)
 *
 * <LoadingOverlay show={isLoading} message="Reordenando..." />
 * ```
 */
export default function LoadingOverlay({ message, show }: LoadingOverlayProps) {
  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={message || 'Cargando...'}
    >
      <div className="border-border bg-card flex flex-col items-center gap-4 rounded-xl border p-8 shadow-2xl">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        {message && <p className="text-foreground text-sm font-medium">{message}</p>}
      </div>
    </motion.div>
  )
}
