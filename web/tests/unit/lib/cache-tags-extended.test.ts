import { describe, it, expect } from 'vitest'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'

describe('CACHE_TAGS — extended', () => {
  describe('static tags are strings', () => {
    const staticTags = [
      'categories',
      'categoryImages',
      'siteSettings',
      'homeSettings',
      'aboutSettings',
      'contactSettings',
      'categorySettings',
      'testimonialSettings',
      'themeSettings',
      'testimonials',
      'services',
      'socialLinks',
      'contacts',
      'analytics',
    ] as const
    for (const tag of staticTags) {
      it(`${tag} is a non-empty string`, () => {
        expect(typeof CACHE_TAGS[tag]).toBe('string')
        expect((CACHE_TAGS[tag] as string).length).toBeGreaterThan(0)
      })
    }
  })

  describe('dynamic tag functions — category', () => {
    it('category() returns string starting with "category-"', () => {
      expect(CACHE_TAGS.category('abc')).toBe('category-abc')
    })

    it('category() with UUID id', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000'
      expect(CACHE_TAGS.category(id)).toBe(`category-${id}`)
    })

    it('category() with empty string does not crash', () => {
      expect(CACHE_TAGS.category('')).toBe('category-')
    })
  })

  describe('dynamic tag functions — categoryImage', () => {
    it('categoryImage() returns correct prefix', () => {
      expect(CACHE_TAGS.categoryImage('img-1')).toBe('category-image-img-1')
    })
  })

  describe('uniqueness guarantees', () => {
    it('category and testimonial with same id are distinct', () => {
      expect(CACHE_TAGS.category('123')).not.toBe(CACHE_TAGS.testimonial('123'))
    })

    it('category and service with same id are distinct', () => {
      expect(CACHE_TAGS.category('123')).not.toBe(CACHE_TAGS.service('123'))
    })
  })

  describe('string pattern consistency', () => {
    it('dynamic tags follow kebab-case pattern', () => {
      expect(CACHE_TAGS.category('x')).toMatch(/^category-/)
      expect(CACHE_TAGS.categoryImage('x')).toMatch(/^category-image-/)
      expect(CACHE_TAGS.testimonial('x')).toMatch(/^testimonial-/)
      expect(CACHE_TAGS.service('x')).toMatch(/^service-/)
    })
  })

  describe('static tag groupings', () => {
    it('has category-related tags', () => {
      expect(CACHE_TAGS.categories).toBeDefined()
      expect(CACHE_TAGS.categoryImages).toBeDefined()
      expect(typeof CACHE_TAGS.category).toBe('function')
    })

    it('has settings-related tags', () => {
      expect(CACHE_TAGS.siteSettings).toBeDefined()
      expect(CACHE_TAGS.homeSettings).toBeDefined()
    })
  })

  describe('CACHE_DURATIONS', () => {
    it('SHORT is 60 seconds', () => {
      expect(CACHE_DURATIONS.SHORT).toBe(60)
    })

    it('MEDIUM is 300 seconds', () => {
      expect(CACHE_DURATIONS.MEDIUM).toBe(300)
    })

    it('LONG is 1800 seconds', () => {
      expect(CACHE_DURATIONS.LONG).toBe(1800)
    })

    it('VERY_LONG is 3600 seconds', () => {
      expect(CACHE_DURATIONS.VERY_LONG).toBe(3600)
    })
  })
})
