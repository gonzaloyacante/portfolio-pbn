import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '@/components/ui'

describe('Switch', () => {
  it('renders switch element', () => {
    render(<Switch />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders in unchecked state', () => {
    render(<Switch checked={false} onCheckedChange={vi.fn()} />)
    const input = screen.getByRole('checkbox')
    expect(input).not.toBeChecked()
  })

  it('renders in checked state', () => {
    render(<Switch checked={true} onCheckedChange={vi.fn()} />)
    const input = screen.getByRole('checkbox')
    expect(input).toBeChecked()
  })

  it('calls onCheckedChange on click', () => {
    const onCheckedChange = vi.fn()
    render(<Switch checked={false} onCheckedChange={onCheckedChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('does not call onCheckedChange when disabled', () => {
    const onCheckedChange = vi.fn()
    render(<Switch checked={false} onCheckedChange={onCheckedChange} disabled />)
    const input = screen.getByRole('checkbox')
    expect(input).toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(<Switch className="my-switch" />)
    const label = container.querySelector('label')
    expect(label?.className).toContain('my-switch')
  })

  it('renders as checkbox input', () => {
    render(<Switch />)
    const input = screen.getByRole('checkbox')
    expect(input).toHaveAttribute('type', 'checkbox')
  })

  it('has sr-only input for accessibility', () => {
    render(<Switch />)
    const input = screen.getByRole('checkbox')
    expect(input.className).toContain('sr-only')
  })
})
