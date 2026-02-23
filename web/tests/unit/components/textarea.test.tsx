import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createRef } from 'react'
import { TextArea } from '@/components/ui'

describe('TextArea', () => {
  it('renders a textarea element', () => {
    render(<TextArea />)
    const textarea = document.querySelector('textarea')
    expect(textarea).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<TextArea label="Description" />)
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<TextArea error="Field is required" />)
    expect(screen.getByText('Field is required')).toBeInTheDocument()
  })

  it('shows helper text when no error', () => {
    render(<TextArea helperText="Max 2000 chars" />)
    expect(screen.getByText('Max 2000 chars')).toBeInTheDocument()
  })

  it('hides helper text when error is present', () => {
    render(<TextArea helperText="Max 2000 chars" error="Required" />)
    expect(screen.queryByText('Max 2000 chars')).not.toBeInTheDocument()
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<TextArea className="custom-class" />)
    const textarea = document.querySelector('textarea')
    expect(textarea?.className).toContain('custom-class')
  })

  it('auto-generates id from label', () => {
    render(<TextArea label="My Comment" />)
    const textarea = document.querySelector('textarea')
    expect(textarea?.id).toBe('my-comment')
  })

  it('uses explicit id over label-generated id', () => {
    render(<TextArea label="My Comment" id="custom-id" />)
    const textarea = document.querySelector('textarea')
    expect(textarea?.id).toBe('custom-id')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<TextArea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('handles onChange', () => {
    const handleChange = vi.fn()
    render(<TextArea onChange={handleChange} />)
    const textarea = document.querySelector('textarea')!
    fireEvent.change(textarea, { target: { value: 'Hello' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('applies rows attribute', () => {
    render(<TextArea rows={10} />)
    const textarea = document.querySelector('textarea')
    expect(textarea?.getAttribute('rows')).toBe('10')
  })

  it('applies placeholder', () => {
    render(<TextArea placeholder="Write here..." />)
    expect(screen.getByPlaceholderText('Write here...')).toBeInTheDocument()
  })
})
