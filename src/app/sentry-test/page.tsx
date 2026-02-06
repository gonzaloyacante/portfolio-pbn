'use client'

import * as Sentry from '@sentry/nextjs'

export default function SentryTestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">🛠️ Sentry Debugger</h1>
        <p className="text-muted-foreground">
          Utiliza estos botones para verificar la integración con Sentry.
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-4">
        {/* Test 1: Message (Non-fatal) */}
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
          onClick={() => {
            Sentry.captureMessage('Test Message: Verificación Manual en Desarrollo')
            alert('Mensaje enviado a Sentry! Revisa tu dashboard.')
          }}
        >
          📨 Enviar Mensaje de Prueba (Sin Crash)
        </button>

        {/* Test 2: Exception (Captured by Error Boundary or Next.js) */}
        <button
          type="button"
          className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-red-700"
          onClick={() => {
            throw new Error('Sentry Test Error: Portfolio PBN Crash Test')
          }}
        >
          💥 Generar Error Crítico (Crash)
        </button>
      </div>

      <p className="mt-8 max-w-md rounded border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
        Nota: Al generar un error crítico en desarrollo, Next.js mostrará su overlay de error. Esto
        es normal. Sentry debería capturar el error simultáneamente. Revisa el dashboard de Sentry
        tras unos segundos.
      </p>
    </div>
  )
}
