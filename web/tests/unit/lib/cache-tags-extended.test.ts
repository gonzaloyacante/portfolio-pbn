import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CACHE_TAGS, CACHE_DURATIONS } from '@/lib/cache-tags'

beforeEach(() => {
  vi.clearAllMocks()
})

// ============================================
// CACHE_TAGS — extended
// ============================================

describe('CACHE_TAGS — extended', () => {
  describe('all static tags are non-empty strings', () => {
    const staticKeys = [
      'projects',
      'featuredProjects',
      'categories',
      'siteSettings',
      'homeSettings',
      'aboutSettings',
      'contactSettings',
      'projectSettings',
      'categorySettings',
      'testimonialSettings',
      'themeSettings',
      'testimonials',
      'services',
      'socialLinks',
      'contacts',
      'analytics',
    ] as const

    it.each(staticKeys)('"%s" is a non-empty string', (key) => {
      const val = CACHE_TAGS[key]
      expect(typeof val).toBe('string')
      expect((val as string).length).toBeGreaterThan(0)
    })
  })

  describe('no duplicate static tags', () => {
    it('all static tag values are unique', () => {
      const staticValues = Object.entries(CACHE_TAGS)
        .filter(([, v]) => typeof v === 'string')
        .map(([, v]) => v)
      const unique = new Set(staticValues)
      expect(unique.size).toBe(staticValues.length)
    })
  })

  describe('dynamic tag functions — project', () => {
    it('project() returns string starting with "project-"', () => {
      expect(CACHE_TAGS.project('abc')).toBe('project-abc')
    })

    it('project() with UUID id', () => {
      const id = 'c5f0e2a1-1234-4abc-9def-000000000001'
      expect(CACHE_TAGS.project(id)).toBe(`project-${id}`)
    })

    it('project() with empty string does not crash', () => {
      expect(CACHE_TAGS.project('')).toBe('project-')
    })
  })

  describe('dynamic tag functions — projectBySlug', () => {
    it('returns string with slug', () => {
      expect(CACHE_TAGS.projectBySlug('my-project')).toBe('project-slug-my-project')
    })

    it('handles slug with numbers', () => {
      expect(CACHE_TAGS.projectBySlug('project-2025')).toBe('project-slug-project-2025')
    })

    it('handles empty slug', () => {
      expect(CACHE_TAGS.projectBySlug('')).toBe('project-slug-')
    })
  })

  describe('dynamic tag functions — projectsByCategory', () => {
    it('returns tag with categoryId', () => {
      expect(CACHE_TAGS.projectsByCategory('cat-1')).toBe('projects-category-cat-1')
    })

    it('different category IDs produce different tags', () => {
      expect(CACHE_TAGS.projectsByCategory('a')).not.toBe(CACHE_TAGS.projectsByCategory('b'))
    })
  })

  describe('dynamic tag functions — category', () => {
    it('returns tag with id', () => {
      expect(CACHE_TAGS.category('cat-1')).toBe('category-cat-1')
    })

    it('category and project with same id are distinct', () => {
      expect(CACHE_TAGS.category('123')).not.toBe(CACHE_TAGS.project('123'))
    })
  })

  describe('dynamic tag functions — testimonial', () => {
    it('returns tag with id', () => {
      expect(CACHE_TAGS.testimonial('t-1')).toBe('testimonial-t-1')
    })

    it('handles special chars in id', () => {
      const id = 'id-with-special_chars.123'
      expect(CACHE_TAGS.testimonial(id)).toContain(id)
    })
  })

  describe('dynamic tag functions — service', () => {
    it('returns tag with id', () => {
      expect(CACHE_TAGS.service('s-1')).toBe('service-s-1')
    })

    it('service and testimonial with same id are distinct', () => {
      expect(CACHE_TAGS.service('x')).not.toBe(CACHE_TAGS.testimonial('x'))
    })
  })

  describe('tag naming conventions', () => {
    it('all static tags use kebab-case or single words', () => {
      const staticEntries = Object.entries(CACHE_TAGS).filter(([, v]) => typeof v === 'string')
      for (const [, val] of staticEntries) {
        expect(val as string).toMatch(/^[a-z][a-z0-9-]*$/)
      }
    })

    it('all dynamic tags produce kebab-case prefixes', () => {
      expect(CACHE_TAGS.project('x')).toMatch(/^project-/)
      expect(CACHE_TAGS.projectBySlug('x')).toMatch(/^project-slug-/)
      expect(CACHE_TAGS.projectsByCategory('x')).toMatch(/^projects-category-/)
      expect(CACHE_TAGS.category('x')).toMatch(/^category-/)
      expect(CACHE_TAGS.testimonial('x')).toMatch(/^testimonial-/)
      expect(CACHE_TAGS.service('x')).toMatch(/^service-/)
    })
  })

  describe('entity coverage — every entity has a tag', () => {
    it('has projects-related tags', () => {
      expect(CACHE_TAGS.projects).toBeDefined()
      expect(CACHE_TAGS.featuredProjects).toBeDefined()
      expect(typeof CACHE_TAGS.project).toBe('function')
      expect(typeof CACHE_TAGS.projectBySlug).toBe('function')
      expect(typeof CACHE_TAGS.projectsByCategory).toBe('function')
    })

    it('has categories-related tags', () => {
      expect(CACHE_TAGS.categories).toBeDefined()
      expect(typeof CACHE_TAGS.category).toBe('function')
    })

    it('has settings-related tags', () => {
      expect(CACHE_TAGS.siteSettings).toBeDefined()
      expect(CACHE_TAGS.homeSettings).toBeDefined()
      expect(CACHE_TAGS.aboutSettings).toBeDefined()
      expect(CACHE_TAGS.contactSettings).toBeDefined()
      expect(CACHE_TAGS.projectSettings).toBeDefined()
      expect(CACHE_TAGS.categorySettings).toBeDefined()
      expect(CACHE_TAGS.testimonialSettings).toBeDefined()
      expect(CACHE_TAGS.themeSettings).toBeDefined()
    })

    it('has testimonials-related tags', () => {
      expect(CACHE_TAGS.testimonials).toBeDefined()
      expect(typeof CACHE_TAGS.testimonial).toBe('function')
    })

    it('has services-related tags', () => {
      expect(CACHE_TAGS.services).toBeDefined()
      expect(typeof CACHE_TAGS.service).toBe('function')
    })

    it('has social-links tag', () => {
      expect(CACHE_TAGS.socialLinks).toBeDefined()
    })

    it('has contacts tag', () => {
      expect(CACHE_TAGS.contacts).toBeDefined()
    })

    it('has analytics tag', () => {
      expect(CACHE_TAGS.analytics).toBeDefined()
    })
  })
})

// ============================================
// CACHE_DURATIONS — extended
// ============================================

describe('CACHE_DURATIONS — extended', () => {
  it('all values are positive integers', () => {
    for (const val of Object.values(CACHE_DURATIONS)) {
      expect(val).toBeGreaterThan(0)
      expect(Number.isInteger(val)).toBe(true)
    }
  })

  it('SHORT is smallest', () => {
    expect(CACHE_DURATIONS.SHORT).toBeLessThan(CACHE_DURATIONS.MEDIUM)
    expect(CACHE_DURATIONS.SHORT).toBeLessThan(CACHE_DURATIONS.LONG)
    expect(CACHE_DURATIONS.SHORT).toBeLessThan(CACHE_DURATIONS.VERY_LONG)
  })

  it('VERY_LONG is largest', () => {
    expect(CACHE_DURATIONS.VERY_LONG).toBeGreaterThan(CACHE_DURATIONS.LONG)
    expect(CACHE_DURATIONS.VERY_LONG).toBeGreaterThan(CACHE_DURATIONS.MEDIUM)
    expect(CACHE_DURATIONS.VERY_LONG).toBeGreaterThan(CACHE_DURATIONS.SHORT)
  })

  it('exactly 4 duration tiers', () => {
    expect(Object.keys(CACHE_DURATIONS)).toHaveLength(4)
  })

  it('SHORT equals 60', () => {
    expect(CACHE_DURATIONS.SHORT).toBe(60)
  })

  it('MEDIUM equals 300', () => {
    expect(CACHE_DURATIONS.MEDIUM).toBe(300)
  })

  it('LONG equals 1800', () => {
    expect(CACHE_DURATIONS.LONG).toBe(1800)
  })

  it('VERY_LONG equals 3600', () => {
    expect(CACHE_DURATIONS.VERY_LONG).toBe(3600)
  })
})
