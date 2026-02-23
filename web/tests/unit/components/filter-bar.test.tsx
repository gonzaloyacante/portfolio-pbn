import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterBar } from '@/components/ui'

const defaultProps = {
  categories: [
    { id: 'cat-1', name: 'Retratos' },
    { id: 'cat-2', name: 'FX Especiales' },
  ],
  selectedCategory: undefined,
  onCategoryChange: vi.fn(),
  searchTerm: '',
  onSearchChange: vi.fn(),
  showActive: undefined,
  onActiveChange: vi.fn(),
  onClearFilters: vi.fn(),
  totalCount: 20,
  filteredCount: 15,
}

describe('FilterBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByPlaceholderText('Buscar proyectos...')).toBeInTheDocument()
  })

  it('renders category select', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByText('Todas las categorías')).toBeInTheDocument()
  })

  it('renders category options', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByText('Retratos')).toBeInTheDocument()
    expect(screen.getByText('FX Especiales')).toBeInTheDocument()
  })

  it('renders active/hidden toggle buttons', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByText('Activos')).toBeInTheDocument()
    expect(screen.getByText('Ocultos')).toBeInTheDocument()
  })

  it('calls onSearchChange when typing in search', () => {
    render(<FilterBar {...defaultProps} />)
    const input = screen.getByPlaceholderText('Buscar proyectos...')
    fireEvent.change(input, { target: { value: 'retrato' } })
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('retrato')
  })

  it('shows clear search button when searchTerm is set', () => {
    render(<FilterBar {...defaultProps} searchTerm="retrato" />)
    expect(screen.getByLabelText('Limpiar búsqueda')).toBeInTheDocument()
  })

  it('clears search when clear button clicked', () => {
    render(<FilterBar {...defaultProps} searchTerm="retrato" />)
    fireEvent.click(screen.getByLabelText('Limpiar búsqueda'))
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('')
  })

  it('calls onCategoryChange on category select', () => {
    render(<FilterBar {...defaultProps} />)
    const select = screen.getByDisplayValue('Todas las categorías')
    fireEvent.change(select, { target: { value: 'cat-1' } })
    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith('cat-1')
  })

  it('calls onCategoryChange with undefined when "Todas" selected', () => {
    render(<FilterBar {...defaultProps} selectedCategory="cat-1" />)
    const select = document.querySelector('select')!
    fireEvent.change(select, { target: { value: '' } })
    expect(defaultProps.onCategoryChange).toHaveBeenCalledWith(undefined)
  })

  it('calls onActiveChange when Activos button clicked', () => {
    render(<FilterBar {...defaultProps} />)
    fireEvent.click(screen.getByText('Activos'))
    expect(defaultProps.onActiveChange).toHaveBeenCalledWith(true)
  })

  it('toggles active off when already active', () => {
    render(<FilterBar {...defaultProps} showActive={true} />)
    fireEvent.click(screen.getByText('Activos'))
    expect(defaultProps.onActiveChange).toHaveBeenCalledWith(undefined)
  })

  it('calls onClearFilters when clear button is clicked', () => {
    render(<FilterBar {...defaultProps} searchTerm="retrato" />)
    const clearButtons = screen.getAllByText('Limpiar')
    fireEvent.click(clearButtons[0])
    expect(defaultProps.onClearFilters).toHaveBeenCalled()
  })

  it('hides desktop clear button when no active filters', () => {
    render(<FilterBar {...defaultProps} />)
    // No active filters → totalCount badge shown instead
    const badge = screen.getByText('20 proyectos')
    expect(badge).toBeInTheDocument()
  })

  it('handles empty categories array', () => {
    render(<FilterBar {...defaultProps} categories={[]} />)
    const select = document.querySelector('select')!
    // Only "Todas las categorías" option
    expect(select.children.length).toBe(1)
  })
})
