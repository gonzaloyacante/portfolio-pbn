import { describe, it, expect } from 'vitest'
import {
  ADMIN_GRID_COLUMNS,
  DRAG_ACTIVATION_DISTANCE,
  ADMIN_LIST_ITEM_HEIGHT,
  ADMIN_CARD_MIN_HEIGHT,
  ANIMATION_DURATION,
  TOAST_DURATION,
  ITEMS_PER_PAGE,
  STORAGE_KEYS,
} from '@/lib/admin-constants'

describe('admin-constants', () => {
  it('ADMIN_GRID_COLUMNS is a positive number', () => {
    expect(ADMIN_GRID_COLUMNS).toBe(3)
  })

  it('DRAG_ACTIVATION_DISTANCE is a positive number', () => {
    expect(typeof DRAG_ACTIVATION_DISTANCE).toBe('number')
    expect(DRAG_ACTIVATION_DISTANCE).toBeGreaterThan(0)
  })

  it('ITEMS_PER_PAGE is a reasonable default', () => {
    expect(ITEMS_PER_PAGE).toBe(20)
  })

  it('animation and toast durations are positive', () => {
    expect(ANIMATION_DURATION).toBeGreaterThan(0)
    expect(TOAST_DURATION).toBeGreaterThan(0)
  })

  it('UI measurement constants are positive', () => {
    expect(ADMIN_LIST_ITEM_HEIGHT).toBeGreaterThan(0)
    expect(ADMIN_CARD_MIN_HEIGHT).toBeGreaterThan(0)
  })

  it('STORAGE_KEYS has required keys', () => {
    expect(STORAGE_KEYS.viewMode).toBe('admin-view-mode')
    expect(STORAGE_KEYS.gridColumns).toBe('admin-grid-columns')
  })
})
