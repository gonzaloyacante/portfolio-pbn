interface PageHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

/**
 * Header de página con título y subtítulo opcionales
 */
export default function PageHeader({ title, subtitle, className = '' }: PageHeaderProps) {
  return (
    <header className={`mb-8 ${className}`}>
      <h1 className="font-script text-primary mb-2 text-4xl">{title}</h1>
      {subtitle && <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>}
    </header>
  )
}
