import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyState } from '@/components/ui'

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

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items" />)
    expect(screen.getByText('No items')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<EmptyState title="Empty" description="Nothing here yet" />)
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(<EmptyState title="Empty" icon="🎉" />)
    expect(screen.getByText('🎉')).toBeInTheDocument()
  })

  it('renders default icon when none provided', () => {
    render(<EmptyState title="Empty" />)
    expect(screen.getByText('📭')).toBeInTheDocument()
  })

  it('renders action as link when actionHref provided', () => {
    render(<EmptyState title="Empty" actionLabel="Create" actionHref="/create" />)
    const link = screen.getByText('Create')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/create')
  })

  it('renders action button when onAction provided', () => {
    const onAction = vi.fn()
    render(<EmptyState title="Empty" actionLabel="Retry" onAction={onAction} />)
    const button = screen.getByText('Retry')
    expect(button.tagName).toBe('BUTTON')
  })

  it('calls onAction when action button clicked', () => {
    const onAction = vi.fn()
    render(<EmptyState title="Empty" actionLabel="Retry" onAction={onAction} />)
    fireEvent.click(screen.getByText('Retry'))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('does not render action when no actionLabel', () => {
    render(<EmptyState title="Empty" />)
    const buttons = screen.queryAllByRole('button')
    const links = screen.queryAllByRole('link')
    expect(buttons).toHaveLength(0)
    expect(links).toHaveLength(0)
  })

  it('renders complete state with all props', () => {
    const onAction = vi.fn()
    render(
      <EmptyState
        title="No Projects"
        description="You have no projects yet"
        icon="📁"
        actionLabel="Create Project"
        onAction={onAction}
      />
    )
    expect(screen.getByText('No Projects')).toBeInTheDocument()
    expect(screen.getByText('You have no projects yet')).toBeInTheDocument()
    expect(screen.getByText('📁')).toBeInTheDocument()
    expect(screen.getByText('Create Project')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="Empty" />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(0)
  })
})
