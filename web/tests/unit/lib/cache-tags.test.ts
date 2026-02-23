import { describe, it, expect } from 'vitest'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'

describe('CACHE_TAGS', () => {
  describe('static tags', () => {
    it('has projects tag', () => {
      expect(CACHE_TAGS.projects).toBe('projects')
    })

    it('has categories tag', () => {
      expect(CACHE_TAGS.categories).toBe('categories')
    })

    it('has featuredProjects tag', () => {
      expect(CACHE_TAGS.featuredProjects).toBe('featured-projects')
    })

    it('has homeSettings tag', () => {
      expect(CACHE_TAGS.homeSettings).toBe('home-settings')
    })

    it('has themeSettings tag', () => {
      expect(CACHE_TAGS.themeSettings).toBe('theme-settings')
    })

    it('has testimonials tag', () => {
      expect(CACHE_TAGS.testimonials).toBe('testimonials')
    })

    it('has services tag', () => {
      expect(CACHE_TAGS.services).toBe('services')
    })

    it('has socialLinks tag', () => {
      expect(CACHE_TAGS.socialLinks).toBe('social-links')
    })

    it('has contacts tag', () => {
      expect(CACHE_TAGS.contacts).toBe('contacts')
    })

    it('has analytics tag', () => {
      expect(CACHE_TAGS.analytics).toBe('analytics')
    })
  })

  describe('dynamic tag functions', () => {
    it('project(id) returns correct tag', () => {
      expect(CACHE_TAGS.project('abc-123')).toBe('project-abc-123')
    })

    it('projectBySlug(slug) returns correct tag', () => {
      expect(CACHE_TAGS.projectBySlug('retrato-bodas')).toBe('project-slug-retrato-bodas')
    })

    it('projectsByCategory(categoryId) returns correct tag', () => {
      expect(CACHE_TAGS.projectsByCategory('cat-1')).toBe('projects-category-cat-1')
    })

    it('category(id) returns correct tag', () => {
      expect(CACHE_TAGS.category('cat-456')).toBe('category-cat-456')
    })

    it('testimonial(id) returns correct tag', () => {
      expect(CACHE_TAGS.testimonial('test-789')).toBe('testimonial-test-789')
    })

    it('service(id) returns correct tag', () => {
      expect(CACHE_TAGS.service('svc-001')).toBe('service-svc-001')
    })

    it('dynamic tags include the provided id', () => {
      const id = 'unique-id-xyz'
      expect(CACHE_TAGS.project(id)).toContain(id)
      expect(CACHE_TAGS.category(id)).toContain(id)
      expect(CACHE_TAGS.testimonial(id)).toContain(id)
      expect(CACHE_TAGS.service(id)).toContain(id)
    })

    it('different ids produce different tags', () => {
      expect(CACHE_TAGS.project('id-1')).not.toBe(CACHE_TAGS.project('id-2'))
    })

    it('project and category tags with same id are distinct', () => {
      const id = 'same-id'
      expect(CACHE_TAGS.project(id)).not.toBe(CACHE_TAGS.category(id))
    })
  })
})

describe('CACHE_DURATIONS', () => {
  it('SHORT is 60 seconds', () => {
    expect(CACHE_DURATIONS.SHORT).toBe(60)
  })

  it('MEDIUM is 300 seconds (5 minutes)', () => {
    expect(CACHE_DURATIONS.MEDIUM).toBe(300)
  })

  it('LONG is 1800 seconds (30 minutes)', () => {
    expect(CACHE_DURATIONS.LONG).toBe(1800)
  })

  it('VERY_LONG is 3600 seconds (1 hour)', () => {
    expect(CACHE_DURATIONS.VERY_LONG).toBe(3600)
  })

  it('durations are ordered SHORT < MEDIUM < LONG < VERY_LONG', () => {
    expect(CACHE_DURATIONS.SHORT).toBeLessThan(CACHE_DURATIONS.MEDIUM)
    expect(CACHE_DURATIONS.MEDIUM).toBeLessThan(CACHE_DURATIONS.LONG)
    expect(CACHE_DURATIONS.LONG).toBeLessThan(CACHE_DURATIONS.VERY_LONG)
  })
})
