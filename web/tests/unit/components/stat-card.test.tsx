import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatCard } from '@/components/ui'

// Mock next/link for this test file
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Projects" value={42} icon="📁" />)
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(<StatCard label="Users" value={10} icon="👥" />)
    expect(screen.getByText('👥')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<StatCard label="Sales" value={100} icon="💰" subtitle="+12% this month" />)
    expect(screen.getByText('+12% this month')).toBeInTheDocument()
  })

  it('renders as link when href provided', () => {
    render(<StatCard label="Projects" value={5} icon="📁" href="/admin/projects" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/admin/projects')
  })

  it('renders as div when no href', () => {
    const { container } = render(<StatCard label="Views" value={999} icon="👁" />)
    expect(container.querySelector('a')).toBeNull()
  })

  it('renders string value', () => {
    render(<StatCard label="Status" value="Active" icon="✅" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    render(<StatCard label="Items" value={0} icon="📦" />)
    // Only label and value text, no subtitle paragraph
    const label = screen.getByText('Items')
    const parent = label.closest('div')
    const subtitle = parent?.querySelector('p')
    expect(subtitle).toBeNull()
  })

  it('renders value with correct styling', () => {
    render(<StatCard label="Count" value={7} icon="🔢" />)
    const value = screen.getByText('7')
    expect(value.className).toContain('text-primary')
    expect(value.className).toContain('font-bold')
  })
})
