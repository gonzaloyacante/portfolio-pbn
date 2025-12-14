interface SectionProps {
  title?: string
  children: React.ReactNode
  className?: string
}

/**
 * Sección con título opcional para paneles admin
 */
export default function Section({ title, children, className = '' }: SectionProps) {
  return (
    <div className={`rounded-xl bg-white p-6 shadow-md dark:bg-gray-800 ${className}`}>
      {title && <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">{title}</h2>}
      {children}
    </div>
  )
}
