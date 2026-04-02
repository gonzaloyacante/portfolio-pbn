import { describe, it, expect } from 'vitest'
import { CACHE_TAGS } from '@/lib/cache-tags'

describe('CACHE_TAGS', () => {
  describe('static tags', () => {
    it('has categories tag', () => {
      expect(CACHE_TAGS.categories).toBe('categories')
    })

    it('has categoryImages tag', () => {
      expect(CACHE_TAGS.categoryImages).toBe('category-images')
    })

    it('has siteSettings tag', () => {
      expect(CACHE_TAGS.siteSettings).toBe('site-settings')
    })

    it('has homeSettings tag', () => {
      expect(CACHE_TAGS.homeSettings).toBe('home-settings')
    })

    it('has testimonials tag', () => {
      expect(CACHE_TAGS.testimonials).toBe('testimonials')
    })

    it('has services tag', () => {
      expect(CACHE_TAGS.services).toBe('services')
    })

    it('has analytics tag', () => {
      expect(CACHE_TAGS.analytics).toBe('analytics')
    })
  })

  describe('dynamic tag functions', () => {
    it('category(id) returns correct tag', () => {
      expect(CACHE_TAGS.category('abc-123')).toBe('category-abc-123')
    })

    it('categoryImage(id) returns correct tag', () => {
      expect(CACHE_TAGS.categoryImage('img-1')).toBe('category-image-img-1')
    })

    it('testimonial(id) returns correct tag', () => {
      expect(CACHE_TAGS.testimonial('t-1')).toBe('testimonial-t-1')
    })

    it('service(id) returns correct tag', () => {
      expect(CACHE_TAGS.service('svc-1')).toBe('service-svc-1')
    })

    it('category tags with different ids are distinct', () => {
      expect(CACHE_TAGS.category('id-1')).not.toBe(CACHE_TAGS.category('id-2'))
    })

    it('category and testimonial tags with same id are distinct', () => {
      const id = 'same-id'
      expect(CACHE_TAGS.category(id)).not.toBe(CACHE_TAGS.testimonial(id))
    })
  })
})
