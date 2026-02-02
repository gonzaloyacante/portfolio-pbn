'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export type Toast = {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number // ms
}

type ToastState = Toast & { isExiting?: boolean }

type ToastContextValue = {
  toasts: ToastState[]
  show: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within <ToastProvider>')
  }
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([])
  const timers = useRef<Record<string, NodeJS.Timeout>>({})

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t)))
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 200)

    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const show: ToastContextValue['show'] = useCallback(
    ({ type, title, message, duration = 3500 }) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, type, title, message, duration }])
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss]
  )

  useEffect(
    () => () => {
      Object.values(timers.current).forEach(clearTimeout)
    },
    []
  )

  return (
    <ToastContext.Provider value={{ toasts, show, dismiss }}>
      {children}
      <div className="pointer-events-none fixed top-20 right-4 z-[60] flex w-[calc(100%-2rem)] flex-col gap-2 sm:w-96">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
}

const borderColors: Record<ToastType, string> = {
  success: 'border-l-emerald-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500',
}

function ToastItem({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  const { type, title, message, isExiting } = toast

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'border-border bg-card pointer-events-auto flex items-start gap-3 rounded-lg border p-3 shadow-lg',
        'border-l-4',
        borderColors[type],
        'translate-x-0 opacity-100',
        !isExiting && 'animate-in slide-in-from-right-full fade-in duration-300',
        isExiting && 'animate-out slide-out-to-right-full fade-out duration-200'
      )}
    >
      <div className="mt-0.5 shrink-0">{icons[type]}</div>
      <div className="min-w-0 flex-1">
        {title && <div className="text-foreground mb-0.5 text-sm font-semibold">{title}</div>}
        <div className="text-muted-foreground text-sm">{message}</div>
      </div>
      <button
        aria-label="Cerrar notificación"
        onClick={onDismiss}
        className="text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 rounded-full p-1 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default ToastProvider
