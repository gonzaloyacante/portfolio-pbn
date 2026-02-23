import { describe, it, expect } from 'vitest'
import {
  generateMetadata,
  generateProjectMetadata,
  generateProjectJsonLd,
  generatePersonSchema,
  seoConfig,
} from '@/lib/seo'

describe('SEO Helpers', () => {
  describe('seoConfig', () => {
    it('should have required config fields', () => {
      expect(seoConfig.siteName).toBeDefined()
      expect(seoConfig.siteUrl).toBeDefined()
      expect(seoConfig.defaultTitle).toBeDefined()
      expect(seoConfig.defaultDescription).toBeDefined()
      expect(seoConfig.locale).toBe('es_ES')
    })
  })

  describe('generateMetadata', () => {
    it('should generate basic metadata with title and description', () => {
      const meta = generateMetadata({
        title: 'Test Page',
        description: 'Test description',
      })

      expect(meta.title).toContain('Test Page')
      expect(meta.description).toBe('Test description')
    })

    it('should append site name to title', () => {
      const meta = generateMetadata({ title: 'Mi Página' })
      expect(meta.title).toContain(seoConfig.siteName)
    })

    it('should use default title when none provided', () => {
      const meta = generateMetadata({})
      expect(meta.title).toBe(seoConfig.defaultTitle)
    })

    it('should set openGraph type to website by default', () => {
      const meta = generateMetadata({ title: 'Test' })
      expect(meta.openGraph?.type).toBe('website')
    })

    it('should set twitter card to summary_large_image', () => {
      const meta = generateMetadata({ title: 'Test' })
      expect(meta.twitter?.card).toBe('summary_large_image')
    })

    it('should include canonical URL in alternates', () => {
      const meta = generateMetadata({ title: 'Test', url: '/proyectos' })
      expect(meta.alternates?.canonical).toContain('/proyectos')
    })

    it('should include keywords when provided', () => {
      const meta = generateMetadata({
        title: 'Test',
        keywords: ['makeup', 'artist'],
      })
      expect(meta.keywords).toContain('makeup')
    })

    it('should set noindex robots for noIndex=true', () => {
      const meta = generateMetadata({ title: 'Test', noIndex: true })
      expect(meta.robots).toContain('noindex')
    })

    it('should use default robots when noIndex is false', () => {
      const meta = generateMetadata({ title: 'Test', noIndex: false })
      expect(meta.robots).toContain('index')
    })
  })

  describe('generateProjectMetadata', () => {
    const mockProject = {
      title: 'Maquillaje Audiovisual Serie TV',
      description: 'Maquillaje de caracterización para producción televisiva española',
      slug: 'maquillaje-audiovisual-serie-tv',
      images: [{ url: 'https://res.cloudinary.com/test/image/upload/v1/project.jpg' }],
      category: { name: 'Audiovisual' },
      date: new Date('2024-01-15'),
    }

    it('should generate metadata from a project', () => {
      const meta = generateProjectMetadata({ project: mockProject })
      expect(meta.title).toContain(mockProject.title)
    })

    it('should use project description', () => {
      const meta = generateProjectMetadata({ project: mockProject })
      expect(meta.description).toBe(mockProject.description)
    })

    it('should use category name in fallback description when no description', () => {
      const projectWithoutDesc = { ...mockProject, description: null }
      const meta = generateProjectMetadata({ project: projectWithoutDesc })
      expect(meta.description).toContain(mockProject.category.name)
    })

    it('should use first project image for OG image', () => {
      const meta = generateProjectMetadata({ project: mockProject })
      const ogImages = meta.openGraph?.images
      expect(JSON.stringify(ogImages)).toContain(mockProject.images[0].url)
    })
  })

  describe('generateProjectJsonLd', () => {
    const mockProject = {
      title: 'FX Makeup Film',
      description: 'Special effects makeup for short film',
      slug: 'fx-makeup-film',
      images: [{ url: 'https://example.com/fx-makeup.jpg' }],
      category: { name: 'Cine' },
      date: new Date('2024-03-20'),
    }

    it('should generate JSON-LD with VisualArtwork type', () => {
      const jsonLd = generateProjectJsonLd(mockProject)
      expect(jsonLd['@type']).toBe('VisualArtwork')
    })

    it('should include project title and description', () => {
      const jsonLd = generateProjectJsonLd(mockProject)
      expect(jsonLd.name).toBe(mockProject.title)
      expect(jsonLd.description).toBe(mockProject.description)
    })

    it('should include correct @context', () => {
      const jsonLd = generateProjectJsonLd(mockProject)
      expect(jsonLd['@context']).toBe('https://schema.org')
    })

    it('should include project images array', () => {
      const jsonLd = generateProjectJsonLd(mockProject)
      expect(jsonLd.image).toContain(mockProject.images[0].url)
    })

    it('should include artist name', () => {
      const jsonLd = generateProjectJsonLd(mockProject)
      expect(jsonLd.artist.name).toBe('Paola Bolívar Nievas')
    })
  })

  describe('generatePersonSchema', () => {
    it('should generate JSON-LD with Person type', () => {
      const schema = generatePersonSchema()
      expect(schema['@type']).toBe('Person')
    })

    it('should include person name and job title', () => {
      const schema = generatePersonSchema()
      expect(schema.name).toBe('Paola Bolívar Nievas')
      expect(schema.jobTitle).toBe('Maquilladora Profesional')
    })

    it('should include address for Spain/Málaga', () => {
      const schema = generatePersonSchema()
      expect(schema.address?.addressCountry).toBe('ES')
    })
  })
})
