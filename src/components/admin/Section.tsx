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
    <div className={`bg-card border-border rounded-xl border p-6 shadow-md ${className}`}>
      {title && <h2 className="text-foreground mb-4 text-xl font-bold">{title}</h2>}
      {children}
    </div>
  )
}
