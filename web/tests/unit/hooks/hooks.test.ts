import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFilteredItems } from '@/hooks/useFilteredItems'

// --- useFilteredItems ---
describe('useFilteredItems', () => {
  type Item = { id: number; name: string; category: string; order: number }

  const items: Item[] = [
    { id: 1, name: 'Alpha', category: 'A', order: 3 },
    { id: 2, name: 'Beta', category: 'B', order: 1 },
    { id: 3, name: 'Gamma', category: 'A', order: 2 },
    { id: 4, name: 'Delta', category: 'C', order: 4 },
  ]

  it('filters items by single filter', () => {
    const { result } = renderHook(() =>
      useFilteredItems({
        items,
        filters: {
          category: (item) => item.category === 'A',
        },
      })
    )
    expect(result.current).toHaveLength(2)
    expect(result.current.map((i) => i.name)).toEqual(['Alpha', 'Gamma'])
  })

  it('filters items by multiple filters', () => {
    const { result } = renderHook(() =>
      useFilteredItems({
        items,
        filters: {
          category: (item) => item.category === 'A',
          order: (item) => item.order > 2,
        },
      })
    )
    expect(result.current).toHaveLength(1)
    expect(result.current[0].name).toBe('Alpha')
  })

  it('sorts items by key', () => {
    const { result } = renderHook(() =>
      useFilteredItems({
        items,
        sortBy: (a, b) => a.order - b.order,
      })
    )
    expect(result.current.map((i) => i.name)).toEqual(['Beta', 'Gamma', 'Alpha', 'Delta'])
  })

  it('sorts descending', () => {
    const { result } = renderHook(() =>
      useFilteredItems({
        items,
        sortBy: (a, b) => b.order - a.order,
      })
    )
    expect(result.current[0].name).toBe('Delta')
    expect(result.current[3].name).toBe('Beta')
  })

  it('combines filter and sort', () => {
    const { result } = renderHook(() =>
      useFilteredItems({
        items,
        filters: { category: (item) => item.category === 'A' },
        sortBy: (a, b) => a.order - b.order,
      })
    )
    expect(result.current.map((i) => i.name)).toEqual(['Gamma', 'Alpha'])
  })

  it('returns empty array for no matches', () => {
    const { result } = renderHook(() =>
      useFilteredItems({
        items,
        filters: { category: (item) => item.category === 'Z' },
      })
    )
    expect(result.current).toEqual([])
  })

  it('returns all items when no filters', () => {
    const { result } = renderHook(() => useFilteredItems({ items }))
    expect(result.current).toHaveLength(4)
  })

  it('handles empty items array', () => {
    const { result } = renderHook(() =>
      useFilteredItems({
        items: [] as Item[],
        filters: { category: (item) => item.category === 'A' },
      })
    )
    expect(result.current).toEqual([])
  })

  it('handles undefined filter values', () => {
    const { result } = renderHook(() =>
      useFilteredItems({
        items,
        filters: { category: undefined },
      })
    )
    expect(result.current).toHaveLength(4)
  })
})

// --- useIsMobile ---
describe('useIsMobile', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    })
  })

  it('returns false on desktop', async () => {
    const { useIsMobile } = await import('@/hooks/useIsMobile')
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('returns true on mobile', async () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    const { useIsMobile } = await import('@/hooks/useIsMobile')
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('uses default breakpoint 768', async () => {
    const { useIsMobile } = await import('@/hooks/useIsMobile')
    renderHook(() => useIsMobile())
    expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 767px)')
  })

  it('accepts custom breakpoint', async () => {
    const { useIsMobile } = await import('@/hooks/useIsMobile')
    renderHook(() => useIsMobile(1024))
    expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 1023px)')
  })
})

// --- useTheme / useThemeValue ---
describe('useTheme', () => {
  it('returns theme values object', async () => {
    const { useTheme } = await import('@/hooks/useTheme')
    const { result } = renderHook(() => useTheme())
    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('object')
  })

  it('returns all expected keys', async () => {
    const { useTheme } = await import('@/hooks/useTheme')
    const { result } = renderHook(() => useTheme())
    const expectedKeys = [
      'colorBackground',
      'colorPrimary',
      'colorTextPrimary',
      'fontHeading',
      'fontBody',
      'fontScript',
      'spacingSection',
      'layoutMaxWidth',
      'effectTransitionDuration',
    ]
    for (const key of expectedKeys) {
      expect(result.current).toHaveProperty(key)
    }
  })

  it('returns default values', async () => {
    const { useTheme } = await import('@/hooks/useTheme')
    const { result } = renderHook(() => useTheme())
    expect(result.current.fontBody).toBe('Open Sans')
    expect(result.current.colorPrimary).toBe('var(--primary)')
  })
})

describe('useThemeValue', () => {
  it('returns specific theme value', async () => {
    const { useThemeValue } = await import('@/hooks/useTheme')
    const { result } = renderHook(() => useThemeValue('fontBody'))
    expect(result.current).toBe('Open Sans')
  })

  it('returns color value', async () => {
    const { useThemeValue } = await import('@/hooks/useTheme')
    const { result } = renderHook(() => useThemeValue('colorBackground'))
    expect(result.current).toBe('var(--background)')
  })
})
