import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createRef } from 'react'
import { Input } from '@/components/ui'

describe('Input', () => {
  // --- Basic rendering ---
  it('renders input element', () => {
    render(<Input aria-label="test" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('associates label with input via htmlFor', () => {
    render(<Input label="Email" />)
    const label = screen.getByText('Email')
    const input = screen.getByRole('textbox')
    expect(label).toHaveAttribute('for', input.id)
  })

  // --- Error ---
  it('shows error message when error is a string', () => {
    render(<Input label="Email" error="Required field" />)
    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  it('shows error styling when error provided', () => {
    render(<Input label="Email" error="Required" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  // --- Helper text ---
  it('shows helper text', () => {
    render(<Input label="Name" helpText="Enter your full name" />)
    expect(screen.getByText('Enter your full name')).toBeInTheDocument()
  })

  it('hides helper text when error is shown', () => {
    render(<Input label="Name" helpText="Helper" error="Error" />)
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  // --- Password ---
  it('renders as password type', () => {
    render(<Input type="password" allowPasswordToggle />)
    const input = screen.getByLabelText('password')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('shows password toggle button for type="password"', () => {
    render(<Input type="password" allowPasswordToggle />)
    expect(screen.getByLabelText('Mostrar contraseña')).toBeInTheDocument()
  })

  it('toggles password visibility on click', () => {
    render(<Input type="password" allowPasswordToggle />)
    const toggle = screen.getByLabelText('Mostrar contraseña')
    fireEvent.click(toggle)
    const input = screen.getByLabelText('password')
    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Ocultar contraseña')).toBeInTheDocument()
  })

  // --- Clearable ---
  it('shows clear button when onClear and value exist', () => {
    render(<Input label="Search" value="test" onClear={vi.fn()} onChange={vi.fn()} />)
    expect(screen.getByLabelText('Limpiar')).toBeInTheDocument()
  })

  it('calls onClear when clear clicked', () => {
    const onClear = vi.fn()
    render(<Input label="Search" value="test" onClear={onClear} onChange={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Limpiar'))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('hides clear button when value is empty', () => {
    render(<Input label="Search" value="" onClear={vi.fn()} onChange={vi.fn()} />)
    expect(screen.queryByLabelText('Limpiar')).not.toBeInTheDocument()
  })

  // --- Icons ---
  it('renders left icon', () => {
    render(<Input label="Search" leftIcon={<span data-testid="left-icon">🔍</span>} />)
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders right icon', () => {
    render(<Input label="Amount" rightIcon={<span data-testid="right-icon">€</span>} />)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  // --- Variants ---
  it('applies default variant classes', () => {
    render(<Input label="Test" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('border')
    expect(input.className).toContain('bg-background')
  })

  it('applies filled variant classes', () => {
    render(<Input label="Test" variant="filled" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('bg-muted')
  })

  // --- Sizes ---
  it('applies default (md) size classes', () => {
    render(<Input label="Test" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('h-10')
  })

  it('applies sm size classes', () => {
    render(<Input label="Test" inputSize="sm" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('h-8')
  })

  // --- ID generation ---
  it('generates id from React useId when no id provided', () => {
    render(<Input label="Email" />)
    const input = screen.getByRole('textbox')
    expect(input.id).toBeTruthy()
  })

  it('uses provided id over generated', () => {
    render(<Input label="Email" id="custom-email" />)
    const input = screen.getByRole('textbox')
    expect(input.id).toBe('custom-email')
  })

  // --- Ref ---
  it('forwards ref', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input label="Test" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  // --- Custom className ---
  it('applies custom className', () => {
    render(<Input label="Test" className="my-class" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('my-class')
  })

  // --- Accessibility ---
  it('has proper aria attributes', () => {
    render(<Input label="Name" required helpText="Full name" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-required', 'true')
    expect(input).toHaveAttribute('aria-describedby')
  })
})
