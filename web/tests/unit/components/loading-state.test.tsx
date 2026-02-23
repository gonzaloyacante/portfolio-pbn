import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingState } from '@/components/ui'

describe('LoadingState', () => {
  it('renders loading spinner', () => {
    const { container } = render(<LoadingState />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg?.classList.toString()).toContain('animate-spin')
  })

  it('renders with default message', () => {
    render(<LoadingState />)
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    render(<LoadingState message="Loading projects..." />)
    expect(screen.getByText('Loading projects...')).toBeInTheDocument()
  })

  it('renders without message when set to empty string', () => {
    render(<LoadingState message="" />)
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
  })

  it('renders with sm size', () => {
    const { container } = render(<LoadingState size="sm" />)
    const svg = container.querySelector('svg')
    expect(svg?.classList.toString()).toContain('h-6')
    expect(svg?.classList.toString()).toContain('w-6')
  })

  it('renders with lg size', () => {
    const { container } = render(<LoadingState size="lg" />)
    const svg = container.querySelector('svg')
    expect(svg?.classList.toString()).toContain('h-16')
    expect(svg?.classList.toString()).toContain('w-16')
  })

  it('renders with default (md) size', () => {
    const { container } = render(<LoadingState />)
    const svg = container.querySelector('svg')
    expect(svg?.classList.toString()).toContain('h-10')
    expect(svg?.classList.toString()).toContain('w-10')
  })

  it('has accessible loading indicator', () => {
    const { container } = render(<LoadingState />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    // The message text provides accessible context
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })
})
