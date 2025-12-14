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
      className="text-primary block rounded-md px-4 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
      {...props}
    >
      {icon} {label}
    </Link>
  )
}
