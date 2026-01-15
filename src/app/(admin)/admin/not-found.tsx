import Link from 'next/link'

/**
 * Página 404 para el panel de administración
 * Diferenciada de la página pública para mantener al admin en el panel
 */
export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="animate-bounce text-6xl">🔍</div>

      <div className="space-y-3">
        <h1 className="text-wine dark:text-pink-hot text-5xl font-bold">404</h1>
        <h2 className="text-wine/80 dark:text-pink-light text-xl font-bold">
          Página no encontrada
        </h2>
        <p className="text-wine/60 dark:text-pink-light/60 max-w-md">
          La página que buscas no existe en el panel de administración.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/admin/dashboard"
          className="bg-pink-hot shadow-pink-hot/20 hover:bg-pink-hot/90 flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
          </svg>
          Ir al Dashboard
        </Link>
      </div>
    </div>
  )
}
