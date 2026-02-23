import Link from 'next/link'
import { ROUTES } from '@/config/routes'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4 text-center">
      {/* Emoji decorativo */}
      <div className="text-8xl">🔍</div>

      <div className="space-y-4">
        {/* Número 404 con fuente script */}
        <h1 className="font-script text-primary text-7xl md:text-9xl">404</h1>

        {/* Título */}
        <h2 className="font-primary text-foreground text-3xl font-bold md:text-4xl">
          ¡Ups! Página no encontrada
        </h2>

        {/* Descripción */}
        <p className="text-muted-foreground mx-auto max-w-md text-lg">
          Parece que esta página se fue a retocar su maquillaje. No podemos encontrarla por ningún
          lado.
        </p>
      </div>

      {/* Botón estilizado */}
      <Link
        href={ROUTES.home}
        className="group bg-primary text-primary-foreground relative overflow-hidden rounded-3xl px-8 py-4 font-semibold shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
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
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          Volver al Inicio
        </span>
        <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-20" />
      </Link>

      {/* Decoración inferior */}
      <div className="mt-8 flex gap-4 text-4xl opacity-50">
        <span>✨</span>
        <span>💄</span>
        <span>💋</span>
      </div>
    </div>
  )
}
