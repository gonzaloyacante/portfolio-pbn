'use client'

// global-error.tsx: error boundary global que reemplaza el root layout.
// Mantener SIN hooks de React y SIN imports de framer-motion para evitar
// TypeError: Cannot read properties of null (reading 'useContext') durante
// el prerender estático de Next.js 16 con el parallel router interno.
// Sentry se reporta a nivel de error.tsx y server-side error handlers.

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es">
      <body
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#fff8fc',
          color: '#1a050a',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Algo salió mal</h1>
        <p style={{ color: '#6b7280' }}>
          Un error inesperado ocurrió. Por favor inténtalo de nuevo.
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c0a0a',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  )
}
