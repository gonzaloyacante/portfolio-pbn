'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Application Error', { error })
  }, [error])

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4 text-center">
      {/* Emoji decorativo */}
      <div className="text-8xl">😟</div>

      <div className="space-y-4">
        <h1 className="font-script text-foreground text-6xl md:text-7xl">¡Oops!</h1>

        <h2 className="font-primary text-foreground text-2xl font-bold md:text-3xl">
          Algo salió mal
        </h2>

        <p className="text-foreground/70 mx-auto max-w-lg text-lg">
          No te preocupes, ya estamos trabajando para arreglarlo. Mientras tanto, puedes intentar de
          nuevo o volver al inicio.
        </p>

        {/* Error details - SOLO en desarrollo */}
        {isDev && error.message && (
          <div className="mx-auto mt-4 max-w-2xl rounded-2xl border-2 border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
            <p className="mb-2 font-semibold text-red-800 dark:text-red-400">
              Error (solo visible en desarrollo):
            </p>
            <pre className="overflow-x-auto font-mono text-xs whitespace-pre-wrap text-red-700 dark:text-red-300">
              {error.message}
            </pre>
            {error.digest && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">Digest: {error.digest}</p>
            )}
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground group cursor-pointer overflow-hidden rounded-3xl px-8 py-4 font-semibold shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Intentar de Nuevo
          </span>
        </button>

        <button
          onClick={() => (window.location.href = '/')}
          className="border-primary text-foreground cursor-pointer rounded-3xl border-2 px-8 py-4 font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Volver al Inicio
          </span>
        </button>
      </div>

      {/* Decoración inferior */}
      <div className="mt-8 flex gap-4 text-4xl opacity-30">
        <span>💄</span>
        <span>✨</span>
        <span>💄</span>
      </div>
    </div>
  )
}
