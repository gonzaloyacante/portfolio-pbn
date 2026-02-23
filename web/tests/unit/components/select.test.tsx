import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('lucide-react', () => ({
  X: (props: React.SVGAttributes<SVGElement>) => <svg data-testid="icon-x" {...props} />,
  Check: (props: React.SVGAttributes<SVGElement>) => <svg data-testid="icon-check" {...props} />,
  ChevronDown: (props: React.SVGAttributes<SVGElement>) => (
    <svg data-testid="icon-chevron" {...props} />
  ),
}))

import Select from '@/components/ui/forms/Select'

beforeEach(() => {
  vi.clearAllMocks()
})

// ── Helpers ───────────────────────────────────────────────────────────────────

const defaultOptions = [
  { value: 'opt-1', label: 'Option 1' },
  { value: 'opt-2', label: 'Option 2' },
  { value: 'opt-3', label: 'Option 3' },
]

function renderSelect(overrides: Partial<React.ComponentProps<typeof Select>> = {}) {
  const defaults = {
    options: defaultOptions,
    value: '',
    onChange: vi.fn(),
    ...overrides,
  }
  return { ...render(<Select {...defaults} />), onChange: defaults.onChange }
}

// ============================================
// Select Component
// ============================================

describe('Select component', () => {
  it('renders the select trigger button', () => {
    renderSelect()
    expect(screen.getByRole('button', { name: /selecciona/i })).toBeDefined()
  })

  it('shows placeholder text when no value selected', () => {
    renderSelect({ placeholder: 'Elige uno' })
    expect(screen.getByText('Elige uno')).toBeDefined()
  })

  it('shows selected option label when value set', () => {
    renderSelect({ value: 'opt-2' })
    expect(screen.getByText('Option 2')).toBeDefined()
  })

  it('opens dropdown on click', () => {
    renderSelect()
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(screen.getByRole('listbox')).toBeDefined()
  })

  it('renders all options in dropdown', () => {
    renderSelect()
    fireEvent.click(screen.getByRole('button'))
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3)
  })

  it('calls onChange when option clicked', () => {
    const { onChange } = renderSelect()
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Option 2'))
    expect(onChange).toHaveBeenCalledWith('opt-2')
  })

  it('closes dropdown after selection', () => {
    renderSelect()
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Option 1'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('does not open when disabled', () => {
    renderSelect({ disabled: true })
    fireEvent.click(screen.getByRole('button'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('renders label when provided', () => {
    renderSelect({ label: 'My Label', id: 'sel-1' })
    expect(screen.getByText('My Label')).toBeDefined()
  })

  it('shows error message when error is a string', () => {
    renderSelect({ error: 'Campo requerido' })
    expect(screen.getByText('Campo requerido')).toBeDefined()
  })

  it('applies error styling when error is true', () => {
    const { container } = renderSelect({ error: true })
    const btn = container.querySelector('button')
    expect(btn?.className).toContain('destructive')
  })

  it('does not show error when error is false', () => {
    renderSelect({ error: false })
    expect(screen.queryByText(/campo/i)).toBeNull()
  })

  it('renders hidden input with name and value', () => {
    const { container } = renderSelect({ name: 'category', value: 'opt-1' })
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement
    expect(hidden).toBeDefined()
    expect(hidden.name).toBe('category')
    expect(hidden.value).toBe('opt-1')
  })

  it('shows "Sin opciones" when options array is empty', () => {
    renderSelect({ options: [] })
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Sin opciones')).toBeDefined()
  })

  it('marks selected option with aria-selected', () => {
    renderSelect({ value: 'opt-1' })
    fireEvent.click(screen.getByRole('button'))
    const selected = screen.getByRole('option', { selected: true })
    expect(selected).toBeDefined()
  })

  it('sets aria-expanded on trigger', () => {
    renderSelect()
    const btn = screen.getByRole('button')
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(btn)
    expect(btn.getAttribute('aria-expanded')).toBe('true')
  })

  it('applies custom className', () => {
    const { container } = renderSelect({ className: 'custom-class' })
    expect(container.firstElementChild?.className).toContain('custom-class')
  })

  it('renders clearable button when value is set and clearable=true', () => {
    renderSelect({ value: 'opt-1', clearable: true })
    expect(screen.getByRole('button', { name: /limpiar/i })).toBeDefined()
  })

  it('clears value when clearable button clicked', () => {
    const { onChange } = renderSelect({ value: 'opt-1', clearable: true })
    fireEvent.click(screen.getByRole('button', { name: /limpiar/i }))
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('does not show clearable button when no value', () => {
    renderSelect({ value: '', clearable: true })
    expect(screen.queryByRole('button', { name: /limpiar/i })).toBeNull()
  })

  it('shows search input when searchable=true and open', () => {
    renderSelect({ searchable: true })
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByPlaceholderText('Buscar...')).toBeDefined()
  })

  it('filters options based on search term', () => {
    renderSelect({ searchable: true })
    fireEvent.click(screen.getByRole('button'))
    const input = screen.getByPlaceholderText('Buscar...')
    fireEvent.change(input, { target: { value: 'Option 1' } })
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
  })

  it('shows no options when search does not match', () => {
    renderSelect({ searchable: true })
    fireEvent.click(screen.getByRole('button'))
    const input = screen.getByPlaceholderText('Buscar...')
    fireEvent.change(input, { target: { value: 'nonexistent' } })
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('check icon visible on selected option', () => {
    renderSelect({ value: 'opt-1' })
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('icon-check')).toBeDefined()
  })
})
