import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Card className="my-card">Content</Card>)
    expect(screen.getByText('Content').className).toContain('my-card')
  })

  it('merges default classes with custom', () => {
    render(<Card className="extra">Content</Card>)
    const card = screen.getByText('Content')
    expect(card.className).toContain('rounded-lg')
    expect(card.className).toContain('extra')
  })

  it('has correct base styling (rounded)', () => {
    render(<Card>Styled</Card>)
    expect(screen.getByText('Styled').className).toContain('rounded-lg')
  })

  it('renders as div', () => {
    render(<Card>Div</Card>)
    expect(screen.getByText('Div').tagName).toBe('DIV')
  })

  it('forwards additional props', () => {
    render(<Card data-testid="my-card">Props</Card>)
    expect(screen.getByTestId('my-card')).toBeInTheDocument()
  })

  it('handles empty children', () => {
    const { container } = render(<Card>{null}</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toBeInTheDocument()
    expect(card.className).toContain('rounded-lg')
  })

  it('applies card theme styles', () => {
    render(<Card>Theme</Card>)
    const card = screen.getByText('Theme')
    expect(card.className).toContain('bg-card')
    expect(card.className).toContain('shadow-md')
  })
})
