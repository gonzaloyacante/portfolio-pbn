'use client'

import Link from 'next/link'

interface CategoryCardProps {
  name: string
  slug: string
  count?: number
}

export default function CategoryCard({ name, slug, count = 0 }: CategoryCardProps) {
  return (
    <Link
      href={`/proyectos/${slug}`}
      className="group relative flex aspect-square flex-col items-center justify-center p-8 text-center transition-all"
      style={{
        borderRadius: 'var(--layout-border-radius, 42px)',
        backgroundColor: 'var(--color-primary, #ffaadd)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transitionDuration: 'var(--effect-transition-duration, 300ms)',
      }}
      onMouseEnter={(e) => {
        const scale = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--effect-hover-scale') ||
            '1.05'
        )
        e.currentTarget.style.transform = `scale(${scale})`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      <h3
        className="font-heading font-bold"
        style={{
          fontSize: 'clamp(20px, 3vw, var(--font-size-nav, 24px))',
          color: 'var(--color-text-primary, #6c0a0a)',
          fontWeight: 'var(--font-heading-weight, 700)',
        }}
      >
        {name}
      </h3>

      {count > 0 && (
        <p
          className="font-body mt-2"
          style={{
            fontSize: '14px',
            color: 'var(--color-text-primary, #6c0a0a)',
            opacity: 0.7,
          }}
        >
          {count} {count === 1 ? 'proyecto' : 'proyectos'}
        </p>
      )}
    </Link>
  )
}
