import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

import DataTable from '@/components/ui/data-display/DataTable'

beforeEach(() => {
  vi.clearAllMocks()
})

// ── Types & Helpers ───────────────────────────────────────────────────────────

interface TestRow {
  id: string
  name: string
  email: string
  age: number
}

const columns = [
  { key: 'name', header: 'Nombre', render: (item: TestRow) => item.name },
  { key: 'email', header: 'Email', render: (item: TestRow) => item.email },
  { key: 'age', header: 'Edad', render: (item: TestRow) => String(item.age) },
]

const sampleData: TestRow[] = [
  { id: '1', name: 'Alice', email: 'alice@test.com', age: 30 },
  { id: '2', name: 'Bob', email: 'bob@test.com', age: 25 },
  { id: '3', name: 'Carol', email: 'carol@test.com', age: 35 },
]

function renderTable(overrides: Partial<React.ComponentProps<typeof DataTable<TestRow>>> = {}) {
  const defaults = {
    data: sampleData,
    columns,
    keyExtractor: (item: TestRow) => item.id,
    ...overrides,
  }
  return render(<DataTable {...defaults} />)
}

// ============================================
// DataTable Component
// ============================================

describe('DataTable component', () => {
  it('renders table headers', () => {
    renderTable()
    expect(screen.getByText('Nombre')).toBeDefined()
    expect(screen.getByText('Email')).toBeDefined()
    expect(screen.getByText('Edad')).toBeDefined()
  })

  it('renders correct number of column headers', () => {
    renderTable()
    const ths = screen.getAllByRole('columnheader')
    expect(ths).toHaveLength(3)
  })

  it('renders table rows', () => {
    renderTable()
    expect(screen.getByText('Alice')).toBeDefined()
    expect(screen.getByText('Bob')).toBeDefined()
    expect(screen.getByText('Carol')).toBeDefined()
  })

  it('renders correct number of rows', () => {
    renderTable()
    const rows = screen.getAllByRole('row')
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4)
  })

  it('renders email column data', () => {
    renderTable()
    expect(screen.getByText('alice@test.com')).toBeDefined()
    expect(screen.getByText('bob@test.com')).toBeDefined()
  })

  it('renders age column data', () => {
    renderTable()
    expect(screen.getByText('30')).toBeDefined()
    expect(screen.getByText('25')).toBeDefined()
    expect(screen.getByText('35')).toBeDefined()
  })

  it('renders empty state message when data is empty', () => {
    renderTable({ data: [] })
    expect(screen.getByText('No hay datos')).toBeDefined()
  })

  it('renders custom empty message', () => {
    renderTable({ data: [], emptyMessage: 'Sin resultados' })
    expect(screen.getByText('Sin resultados')).toBeDefined()
  })

  it('does not render table when data is empty', () => {
    renderTable({ data: [] })
    expect(screen.queryByRole('table')).toBeNull()
  })

  it('renders table element when data present', () => {
    renderTable()
    expect(screen.getByRole('table')).toBeDefined()
  })

  it('uses keyExtractor for row keys', () => {
    // This mainly tests no error on render with proper keys
    const { container } = renderTable()
    const tbody = container.querySelector('tbody')
    expect(tbody?.children).toHaveLength(3)
  })

  it('renders with single row', () => {
    renderTable({ data: [sampleData[0]] })
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(2) // header + 1 data row
  })

  it('renders with single column', () => {
    renderTable({ columns: [columns[0]] })
    const ths = screen.getAllByRole('columnheader')
    expect(ths).toHaveLength(1)
  })

  it('renders custom cell content via render function', () => {
    const customColumns = [
      {
        key: 'custom',
        header: 'Custom',
        render: (item: TestRow) => <strong>{item.name.toUpperCase()}</strong>,
      },
    ]
    renderTable({ columns: customColumns })
    expect(screen.getByText('ALICE')).toBeDefined()
  })

  it('handles data with many rows', () => {
    const manyRows = Array.from({ length: 50 }, (_, i) => ({
      id: `id-${i}`,
      name: `User ${i}`,
      email: `user${i}@test.com`,
      age: 20 + i,
    }))
    renderTable({ data: manyRows })
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(51) // header + 50
  })

  it('empty message has dashed border styling', () => {
    const { container } = renderTable({ data: [] })
    const emptyDiv = container.firstElementChild
    expect(emptyDiv?.className).toContain('border-dashed')
  })

  it('table has overflow-x-auto for responsiveness', () => {
    const { container } = renderTable()
    expect(container.innerHTML).toContain('overflow-x-auto')
  })

  it('header cells have uppercase styling', () => {
    const { container } = renderTable()
    const th = container.querySelector('th')
    expect(th?.className).toContain('uppercase')
  })

  it('rows have hover styling', () => {
    const { container } = renderTable()
    const tr = container.querySelector('tbody tr')
    expect(tr?.className).toContain('hover:')
  })

  it('table has rounded corners', () => {
    const { container } = renderTable()
    expect(container.innerHTML).toContain('rounded-2xl')
  })

  it('renders duplicate column headers if specified', () => {
    const dupColumns = [
      { key: 'a', header: 'Same', render: (item: TestRow) => item.name },
      { key: 'b', header: 'Same', render: (item: TestRow) => item.email },
    ]
    renderTable({ columns: dupColumns })
    const headers = screen.getAllByText('Same')
    expect(headers).toHaveLength(2)
  })

  it('renders empty string in cell when render returns empty', () => {
    const emptyColumns = [{ key: 'x', header: 'X', render: () => '' }]
    renderTable({ columns: emptyColumns })
    const tds = screen.getAllByRole('cell')
    expect(tds[0].textContent).toBe('')
  })

  it('renders null cell content gracefully', () => {
    const nullColumns = [{ key: 'x', header: 'X', render: () => null }]
    renderTable({ columns: nullColumns })
    const tds = screen.getAllByRole('cell')
    expect(tds[0].textContent).toBe('')
  })

  it('renders with zero columns (edge case)', () => {
    const { container } = renderTable({ columns: [] })
    const ths = container.querySelectorAll('th')
    expect(ths).toHaveLength(0)
  })

  it('large data set still renders all rows', () => {
    const bigData = Array.from({ length: 100 }, (_, i) => ({
      id: String(i),
      name: `N${i}`,
      email: `e${i}@t.com`,
      age: i,
    }))
    renderTable({ data: bigData })
    expect(screen.getByText('N0')).toBeDefined()
    expect(screen.getByText('N99')).toBeDefined()
  })
})
