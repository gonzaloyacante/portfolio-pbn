import { describe, it, expect } from 'vitest'
import { generateMetaTags, generateOpenGraphTags, generateTwitterTags } from '@/lib/seo'

describe('SEO Helpers', () => {
  describe('generateMetaTags', () => {
    it('should generate basic meta tags', () => {
      const tags = generateMetaTags({
        title: 'Test Page',
        description: 'Test description',
      })

      expect(tags.title).toBe('Test Page')
      expect(tags.description).toBe('Test description')
    })

    it('should include keywords if provided', () => {
      const tags = generateMetaTags({
        title: 'Test',
        description: 'Test',
        keywords: ['makeup', 'artist', 'portfolio'],
      })

      expect(tags.keywords).toContain('makeup')
      expect(tags.keywords).toContain('artist')
    })

    it('should generate canonical URL', () => {
      const tags = generateMetaTags({
        title: 'Test',
        description: 'Test',
        path: '/projects/test-project',
      })

      expect(tags.canonical).toContain('/projects/test-project')
    })

    it('should use default base URL if not provided', () => {
      const tags = generateMetaTags({
        title: 'Test',
        description: 'Test',
        path: '/about',
      })

      expect(tags.canonical).toMatch(/^https?:\/\/.*\/about$/)
    })
  })

  describe('generateOpenGraphTags', () => {
    it('should generate Open Graph tags', () => {
      const tags = generateOpenGraphTags({
        title: 'Test Page',
        description: 'Test description',
        image: 'https://example.com/image.jpg',
        url: 'https://example.com/page',
      })

      expect(tags['og:title']).toBe('Test Page')
      expect(tags['og:description']).toBe('Test description')
      expect(tags['og:image']).toBe('https://example.com/image.jpg')
      expect(tags['og:url']).toBe('https://example.com/page')
    })

    it('should default to website type', () => {
      const tags = generateOpenGraphTags({
        title: 'Test',
        description: 'Test',
      })

      expect(tags['og:type']).toBe('website')
    })

    it('should allow custom type', () => {
      const tags = generateOpenGraphTags({
        title: 'Article Title',
        description: 'Article description',
        type: 'article',
      })

      expect(tags['og:type']).toBe('article')
    })

    it('should include locale', () => {
      const tags = generateOpenGraphTags({
        title: 'Test',
        description: 'Test',
        locale: 'es_ES',
      })

      expect(tags['og:locale']).toBe('es_ES')
    })

    it('should include image dimensions if provided', () => {
      const tags = generateOpenGraphTags({
        title: 'Test',
        description: 'Test',
        image: 'https://example.com/image.jpg',
        imageWidth: 1200,
        imageHeight: 630,
      })

      expect(tags['og:image:width']).toBe(1200)
      expect(tags['og:image:height']).toBe(630)
    })
  })

  describe('generateTwitterTags', () => {
    it('should generate Twitter Card tags', () => {
      const tags = generateTwitterTags({
        title: 'Test Page',
        description: 'Test description',
        image: 'https://example.com/image.jpg',
      })

      expect(tags['twitter:card']).toBe('summary_large_image')
      expect(tags['twitter:title']).toBe('Test Page')
      expect(tags['twitter:description']).toBe('Test description')
      expect(tags['twitter:image']).toBe('https://example.com/image.jpg')
    })

    it('should allow custom card type', () => {
      const tags = generateTwitterTags({
        title: 'Test',
        description: 'Test',
        cardType: 'summary',
      })

      expect(tags['twitter:card']).toBe('summary')
    })

    it('should include creator handle if provided', () => {
      const tags = generateTwitterTags({
        title: 'Test',
        description: 'Test',
        creator: '@username',
      })

      expect(tags['twitter:creator']).toBe('@username')
    })

    it('should include site handle if provided', () => {
      const tags = generateTwitterTags({
        title: 'Test',
        description: 'Test',
        site: '@sitehandle',
      })

      expect(tags['twitter:site']).toBe('@sitehandle')
    })
  })

  describe('Integration - Full SEO Tags', () => {
    it('should generate complete SEO tags for a project page', () => {
      const projectTitle = 'Character Makeup for Film XYZ'
      const projectDescription =
        'Professional character makeup and FX for independent film production'

      const metaTags = generateMetaTags({
        title: projectTitle,
        description: projectDescription,
        keywords: ['character makeup', 'film FX', 'special effects'],
        path: '/projects/character-makeup-film-xyz',
      })

      const ogTags = generateOpenGraphTags({
        title: projectTitle,
        description: projectDescription,
        image: 'https://example.com/project-thumb.jpg',
        url: 'https://example.com/projects/character-makeup-film-xyz',
        type: 'article',
      })

      const twitterTags = generateTwitterTags({
        title: projectTitle,
        description: projectDescription,
        image: 'https://example.com/project-thumb.jpg',
      })

      expect(metaTags.title).toBe(projectTitle)
      expect(ogTags['og:title']).toBe(projectTitle)
      expect(twitterTags['twitter:title']).toBe(projectTitle)

      expect(metaTags.canonical).toContain('/projects/character-makeup-film-xyz')
      expect(ogTags['og:url']).toContain('/projects/character-makeup-film-xyz')
    })
  })
})
