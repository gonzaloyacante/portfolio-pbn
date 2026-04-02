import { describe, it, expect } from 'vitest'
import { generateMetadata, generatePersonSchema, seoConfig } from '@/lib/seo'

describe('SEO utils', () => {
  describe('seoConfig', () => {
    it('has a siteName', () => {
      expect(seoConfig.siteName).toBeDefined()
      expect(seoConfig.siteName.length).toBeGreaterThan(0)
    })

    it('has a default title', () => {
      expect(seoConfig.defaultTitle).toBeDefined()
    })

    it('has a locale', () => {
      expect(seoConfig.locale).toBe('es_ES')
    })
  })

  describe('generateMetadata', () => {
    it('should use defaultTitle when no title provided', () => {
      const meta = generateMetadata({})
      expect(meta.title).toBe(seoConfig.defaultTitle)
    })

    it('should include title with site name', () => {
      const meta = generateMetadata({ title: 'Portfolio' })
      expect(meta.title).toContain('Portfolio')
      expect(meta.title).toContain(seoConfig.siteName)
    })

    it('should include canonical url', () => {
      const meta = generateMetadata({ title: 'Test', url: '/portfolio' })
      expect(meta.alternates?.canonical).toContain('/portfolio')
    })

    it('should set noindex when noIndex=true', () => {
      const meta = generateMetadata({ noIndex: true })
      expect(meta.robots).toContain('noindex')
    })

    it('should include openGraph data', () => {
      const meta = generateMetadata({ title: 'Test' })
      expect(meta.openGraph).toBeDefined()
      expect(meta.openGraph?.title).toContain('Test')
    })

    it('should include twitter card', () => {
      const meta = generateMetadata({ title: 'Test' })
      expect(meta.twitter).toBeDefined()
      expect(meta.twitter?.card).toBe('summary_large_image')
    })

    it('should include description', () => {
      const meta = generateMetadata({ description: 'Custom desc' })
      expect(meta.description).toBe('Custom desc')
    })

    it('should include keywords when provided', () => {
      const meta = generateMetadata({ keywords: ['maquillaje', 'málaga'] })
      expect(meta.keywords).toEqual(['maquillaje', 'málaga'])
    })
  })

  describe('generatePersonSchema', () => {
    it('should return Person schema type', () => {
      const schema = generatePersonSchema()
      expect(schema['@type']).toBe('Person')
    })

    it('should include default name', () => {
      const schema = generatePersonSchema()
      expect(schema.name).toBe('Paola Bolívar Nievas')
    })

    it('should include custom name', () => {
      const schema = generatePersonSchema('Test Name')
      expect(schema.name).toBe('Test Name')
    })

    it('should include location', () => {
      const schema = generatePersonSchema('Paola', 'Madrid')
      expect(schema.address.addressLocality).toBe('Madrid')
    })

    it('should include jobTitle', () => {
      const schema = generatePersonSchema()
      expect(schema.jobTitle).toBeDefined()
    })
  })
})
