import { describe, it, expect } from 'vitest'
import { TOAST_MESSAGES } from '@/lib/toast-messages'

describe('toast-messages', () => {
  it('has messages for all main entities', () => {
    expect(TOAST_MESSAGES.projects).toBeDefined()
    expect(TOAST_MESSAGES.categories).toBeDefined()
    expect(TOAST_MESSAGES.images).toBeDefined()
    expect(TOAST_MESSAGES.testimonials).toBeDefined()
    expect(TOAST_MESSAGES.services).toBeDefined()
  })

  it('each entity CRUD action has success and error messages', () => {
    const crudEntities = ['projects', 'categories', 'testimonials', 'services'] as const
    crudEntities.forEach((entity) => {
      const messages = TOAST_MESSAGES[entity]
      expect(messages.create.success).toBeTruthy()
      expect(messages.create.error).toBeTruthy()
      expect(messages.update.success).toBeTruthy()
      expect(messages.update.error).toBeTruthy()
      expect(messages.delete.success).toBeTruthy()
      expect(messages.delete.error).toBeTruthy()
    })
  })

  it('all messages are non-empty strings', () => {
    function checkMessages(obj: Record<string, unknown>) {
      Object.values(obj).forEach((value) => {
        if (typeof value === 'string') {
          expect(value.length).toBeGreaterThan(0)
        } else if (typeof value === 'object' && value !== null) {
          checkMessages(value as Record<string, unknown>)
        }
      })
    }
    checkMessages(TOAST_MESSAGES)
  })

  it('images has reorder, delete, thumbnail, and upload messages', () => {
    expect(TOAST_MESSAGES.images.reorder.success).toBeDefined()
    expect(TOAST_MESSAGES.images.delete.success).toBeDefined()
    expect(TOAST_MESSAGES.images.thumbnail.success).toBeDefined()
    expect(TOAST_MESSAGES.images.upload.success).toBeDefined()
  })

  it('about has update messages', () => {
    expect(TOAST_MESSAGES.about.update.success).toBeDefined()
    expect(TOAST_MESSAGES.about.update.error).toBeDefined()
  })
})
