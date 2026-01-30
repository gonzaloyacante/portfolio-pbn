import Link from 'next/link'

interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  backUrl?: string
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
  className = '',
}: PageHeaderProps) {
  const text = description || subtitle

  return (
    <header className={`mb-8 ${className}`}>
      {backUrl && (
        <Link
          href={backUrl}
          className="text-wine/60 dark:text-pink-light/60 hover:text-wine dark:hover:text-pink-light mb-4 inline-flex items-center text-sm transition-colors"
        >
          ← Volver
        </Link>
      )}
      <h1 className="font-script text-primary mb-2 text-4xl">{title}</h1>
      {text && <p className="text-gray-600 dark:text-gray-400">{text}</p>}
    </header>
  )
}
