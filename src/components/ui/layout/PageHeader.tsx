interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  className?: string
}

/**
 * Header de página con título y subtítulo/descripción opcionales
 */
export default function PageHeader({
  title,
  subtitle,
  description,
  className = '',
}: PageHeaderProps) {
  const text = description || subtitle

  return (
    <header className={`mb-8 ${className}`}>
      <h1 className="font-script text-primary mb-2 text-4xl">{title}</h1>
      {text && <p className="text-gray-600 dark:text-gray-400">{text}</p>}
    </header>
  )
}
