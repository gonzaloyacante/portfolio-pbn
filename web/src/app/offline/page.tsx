'use client'

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
          aria-hidden="true"
        >
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>

      <div className="max-w-sm space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Sin conexión</h1>
        <p className="text-muted-foreground">
          Parece que no tienes conexión a internet. Comprueba tu red y vuelve a intentarlo.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
      >
        Reintentar
      </button>
    </div>
  )
}
