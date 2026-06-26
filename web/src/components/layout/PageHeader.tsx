import Link from 'next/link'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  backUrl?: string
  /** Acciones opcionales que se renderizan a la derecha del header (botones, links, etc.) */
  actions?: ReactNode
  /** Si true, no muestra el link "← Volver" automático (usar con backUrl en actions) */
  hideDefaultBack?: boolean
  className?: string
}

/**
 * Header de página con título, subtítulo/descripción y botón volver opcionales
 */
export default function PageHeader({
  title,
  subtitle,
  description,
  backUrl,
  actions,
  hideDefaultBack = false,
  className = '',
}: PageHeaderProps) {
  const text = description || subtitle
  const showBack = backUrl && !hideDefaultBack

  return (
    <header
      className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
      <div>
        {showBack && (
          <Link
            href={backUrl}
            className="text-muted-foreground hover:text-foreground mb-2 inline-flex items-center text-sm transition-colors"
          >
            ← Volver
          </Link>
        )}
        <h1 className="font-script text-primary text-4xl">{title}</h1>
        {text && <p className="text-muted-foreground mt-2">{text}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}
