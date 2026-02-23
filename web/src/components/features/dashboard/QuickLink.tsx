import Link from 'next/link'

interface QuickLinkProps {
  href: string
  icon: string
  label: string
  external?: boolean
}

/**
 * Enlace rápido para dashboard
 */
export default function QuickLink({ href, icon, label, external }: QuickLinkProps) {
  const props = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <Link
      href={href}
      className="text-primary hover:bg-muted block rounded-md px-4 py-2 transition-colors"
      {...props}
    >
      {icon} {label}
    </Link>
  )
}
