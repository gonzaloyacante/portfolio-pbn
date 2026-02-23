import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui'

describe('Badge', () => {
  it('renders with text content', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders with default variant', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge.className).toContain('bg-primary/10')
  })

  it('renders with success variant', () => {
    render(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success').className).toContain('text-success')
  })

  it('renders with warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>)
    expect(screen.getByText('Warning').className).toContain('text-warning')
  })

  it('renders with danger variant', () => {
    render(<Badge variant="danger">Danger</Badge>)
    expect(screen.getByText('Danger').className).toContain('text-destructive')
  })

  it('renders with info variant', () => {
    render(<Badge variant="info">Info</Badge>)
    expect(screen.getByText('Info').className).toContain('text-info')
  })

  it('renders with outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline').className).toContain('text-foreground')
  })

  it('renders with destructive variant', () => {
    render(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive').className).toContain('text-destructive')
  })

  it('renders with sm size', () => {
    render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText('Small').className).toContain('text-xs')
  })

  it('renders with default (md) size', () => {
    render(<Badge>Medium</Badge>)
    expect(screen.getByText('Medium').className).toContain('text-sm')
  })

  it('applies custom className', () => {
    render(<Badge className="my-badge">Custom</Badge>)
    expect(screen.getByText('Custom').className).toContain('my-badge')
  })

  it('renders as span element', () => {
    render(<Badge>Span</Badge>)
    expect(screen.getByText('Span').tagName).toBe('SPAN')
  })
})
