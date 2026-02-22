/**
 * Admin panel configuration constants
 * Centralizes magic numbers and configuration values
 */

// Grid configuration
export const ADMIN_GRID_COLUMNS = 3

// Drag and drop
export const DRAG_ACTIVATION_DISTANCE = 8

// UI measurements
export const ADMIN_LIST_ITEM_HEIGHT = 80
export const ADMIN_CARD_MIN_HEIGHT = 200

// Animation durations (ms)
export const ANIMATION_DURATION = 200
export const TOAST_DURATION = 3000

// Pagination
export const ITEMS_PER_PAGE = 20

// LocalStorage keys
export const STORAGE_KEYS = {
  viewMode: 'admin-view-mode',
  gridColumns: 'admin-grid-columns',
} as const
