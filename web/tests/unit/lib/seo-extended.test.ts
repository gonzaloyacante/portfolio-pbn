import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/db', () => ({ prisma: {} }))
vi.mock('next/cache', () => ({ unstable_cache: vi.fn((fn: Function) => fn) }))

import {
  seoConfig,
  generateMetadata,
  generateProjectMetadata,
  generateProjectJsonLd,
  generatePersonSchema,
} from '@/lib/seo'

// ============================================
// generateMetadata — extended edge cases
// ============================================

describe('generateMetadata — extended', () => {
  it('uses default title when no title provided', () => {
    const meta = generateMetadata({})
    expect(meta.title).toBe(seoConfig.defaultTitle)
  })

  it('appends site name to page title', () => {
    const meta = generateMetadata({ title: 'Portfolio' })
    expect(meta.title).toBe(`Portfolio | ${seoConfig.siteName}`)
  })

  it('uses default description when none provided', () => {
    const meta = generateMetadata({})
    expect(meta.description).toBe(seoConfig.defaultDescription)
  })

  it('uses custom description when provided', () => {
    const meta = generateMetadata({ description: 'Custom desc' })
    expect(meta.description).toBe('Custom desc')
  })

  it('generates canonical URL from url param', () => {
    const meta = generateMetadata({ url: '/proyectos' })
    expect(meta.alternates?.canonical).toBe(`${seoConfig.siteUrl}/proyectos`)
  })

  it('uses siteUrl as canonical when no url', () => {
    const meta = generateMetadata({})
    expect(meta.alternates?.canonical).toBe(seoConfig.siteUrl)
  })

  it('sets robots to noindex,nofollow when noIndex is true', () => {
    const meta = generateMetadata({ noIndex: true })
    expect(meta.robots).toBe('noindex,nofollow')
  })

  it('sets robots to index,follow by default', () => {
    const meta = generateMetadata({})
    expect(meta.robots).toBe('index,follow')
  })

  it('includes keywords when provided as array', () => {
    const meta = generateMetadata({ keywords: ['maquillaje', 'portfolio'] })
    expect(meta.keywords).toEqual(['maquillaje', 'portfolio'])
  })

  it('includes keywords when provided as string', () => {
    const meta = generateMetadata({ keywords: 'maquillaje, portfolio' })
    expect(meta.keywords).toBe('maquillaje, portfolio')
  })

  it('sets OpenGraph type to website', () => {
    const meta = generateMetadata({})
    const og = meta.openGraph as Record<string, unknown>
    expect(og.type).toBe('website')
  })

  it('sets Twitter card to summary_large_image', () => {
    const meta = generateMetadata({})
    const tw = meta.twitter as Record<string, unknown>
    expect(tw.card).toBe('summary_large_image')
  })

  it('prepends siteUrl to relative image', () => {
    const meta = generateMetadata({ image: '/my-image.jpg' })
    const og = meta.openGraph as { images: Array<{ url: string }> }
    expect(og.images[0].url).toBe(`${seoConfig.siteUrl}/my-image.jpg`)
  })

  it('uses absolute image URL directly', () => {
    const meta = generateMetadata({ image: 'https://cdn.example.com/img.jpg' })
    const og = meta.openGraph as { images: Array<{ url: string }> }
    expect(og.images[0].url).toBe('https://cdn.example.com/img.jpg')
  })

  it('sets OG image dimensions to 1200x630', () => {
    const meta = generateMetadata({})
    const og = meta.openGraph as { images: Array<{ width: number; height: number }> }
    expect(og.images[0].width).toBe(1200)
    expect(og.images[0].height).toBe(630)
  })

  it('sets OG locale to es_ES', () => {
    const meta = generateMetadata({})
    const og = meta.openGraph as { locale: string }
    expect(og.locale).toBe('es_ES')
  })

  it('passes title with HTML entities safely', () => {
    const meta = generateMetadata({ title: 'Paola & Bolívar — Portfolio' })
    expect(meta.title).toContain('Paola & Bolívar — Portfolio')
  })

  it('handles very long title', () => {
    const longTitle = 'A'.repeat(300)
    const meta = generateMetadata({ title: longTitle })
    expect(meta.title).toContain(longTitle)
  })

  it('handles very long description', () => {
    const longDesc = 'D'.repeat(1000)
    const meta = generateMetadata({ description: longDesc })
    expect(meta.description).toBe(longDesc)
  })

  it('handles special characters in description', () => {
    const meta = generateMetadata({ description: '¡Hola! <world> & "quotes"' })
    expect(meta.description).toBe('¡Hola! <world> & "quotes"')
  })

  it('handles empty string title', () => {
    const meta = generateMetadata({ title: '' })
    // empty string is falsy so default title applies
    expect(meta.title).toBe(seoConfig.defaultTitle)
  })

  it('handles empty string description', () => {
    const meta = generateMetadata({ description: '' })
    // empty string is falsy so default description applies
    expect(meta.description).toBe(seoConfig.defaultDescription)
  })

  it('sets siteName in OpenGraph', () => {
    const meta = generateMetadata({})
    const og = meta.openGraph as { siteName: string }
    expect(og.siteName).toBe(seoConfig.siteName)
  })
})

// ============================================
// generateProjectMetadata — extended
// ============================================

describe('generateProjectMetadata — extended', () => {
  const baseProject = {
    title: 'Retrato Dramático',
    description: 'Un retrato con luz dramática',
    slug: 'retrato-dramatico',
    images: [{ url: 'https://cdn.example.com/img1.jpg' }],
    category: { name: 'Retratos' },
    date: new Date('2025-01-15'),
  }

  it('uses project title in metadata', () => {
    const meta = generateProjectMetadata({ project: baseProject })
    expect(meta.title).toContain('Retrato Dramático')
  })

  it('uses project description', () => {
    const meta = generateProjectMetadata({ project: baseProject })
    expect(meta.description).toBe('Un retrato con luz dramática')
  })

  it('generates fallback description when null', () => {
    const meta = generateProjectMetadata({
      project: { ...baseProject, description: null },
    })
    expect(meta.description).toContain('Retratos')
    expect(meta.description).toContain('Retrato Dramático')
  })

  it('uses first image from project', () => {
    const meta = generateProjectMetadata({ project: baseProject })
    const og = meta.openGraph as { images: Array<{ url: string }> }
    expect(og.images[0].url).toBe('https://cdn.example.com/img1.jpg')
  })

  it('uses default image when images array is empty', () => {
    const meta = generateProjectMetadata({
      project: { ...baseProject, images: [] },
    })
    const og = meta.openGraph as { images: Array<{ url: string }> }
    expect(og.images[0].url).toContain(seoConfig.defaultImage)
  })

  it('generates URL with slug', () => {
    const meta = generateProjectMetadata({ project: baseProject })
    const og = meta.openGraph as { url: string }
    expect(og.url).toContain('/proyecto/retrato-dramatico')
  })
})

// ============================================
// generateProjectJsonLd — extended
// ============================================

describe('generateProjectJsonLd — extended', () => {
  const baseProject = {
    title: 'FX Especiales',
    description: 'Maquillaje FX',
    slug: 'fx-especiales',
    images: [
      { url: 'https://cdn.example.com/fx1.jpg' },
      { url: 'https://cdn.example.com/fx2.jpg' },
    ],
    category: { name: 'Efectos Especiales' },
    date: new Date('2025-06-01'),
  }

  it('sets @context to schema.org', () => {
    const ld = generateProjectJsonLd(baseProject)
    expect(ld['@context']).toBe('https://schema.org')
  })

  it('sets @type to VisualArtwork', () => {
    const ld = generateProjectJsonLd(baseProject)
    expect(ld['@type']).toBe('VisualArtwork')
  })

  it('includes all project images', () => {
    const ld = generateProjectJsonLd(baseProject)
    expect(ld.image).toHaveLength(2)
  })

  it('generates URL with siteUrl and slug', () => {
    const ld = generateProjectJsonLd(baseProject)
    expect(ld.url).toBe(`${seoConfig.siteUrl}/proyecto/fx-especiales`)
  })

  it('sets artist name', () => {
    const ld = generateProjectJsonLd(baseProject)
    expect(ld.artist.name).toBe('Paola Bolívar Nievas')
  })

  it('sets artform from category', () => {
    const ld = generateProjectJsonLd(baseProject)
    expect(ld.artform).toBe('Efectos Especiales')
  })

  it('serialises dateCreated as ISO string', () => {
    const ld = generateProjectJsonLd(baseProject)
    expect(ld.dateCreated).toBe('2025-06-01T00:00:00.000Z')
  })

  it('handles null description', () => {
    const ld = generateProjectJsonLd({ ...baseProject, description: null })
    expect(ld.description).toBe('')
  })

  it('handles empty images array', () => {
    const ld = generateProjectJsonLd({ ...baseProject, images: [] })
    expect(ld.image).toEqual([])
  })
})

// ============================================
// generatePersonSchema — extended
// ============================================

describe('generatePersonSchema — extended', () => {
  it('sets @context to schema.org', () => {
    const schema = generatePersonSchema()
    expect(schema['@context']).toBe('https://schema.org')
  })

  it('sets @type to Person', () => {
    const schema = generatePersonSchema()
    expect(schema['@type']).toBe('Person')
  })

  it('includes name', () => {
    const schema = generatePersonSchema()
    expect(schema.name).toBe('Paola Bolívar Nievas')
  })

  it('includes jobTitle', () => {
    const schema = generatePersonSchema()
    expect(schema.jobTitle).toBe('Maquilladora Profesional')
  })

  it('includes address locality', () => {
    const schema = generatePersonSchema()
    expect(schema.address.addressLocality).toBe('Málaga')
  })

  it('includes address country', () => {
    const schema = generatePersonSchema()
    expect(schema.address.addressCountry).toBe('ES')
  })

  it('includes site URL', () => {
    const schema = generatePersonSchema()
    expect(schema.url).toBe(seoConfig.siteUrl)
  })

  it('includes image with siteUrl prefix', () => {
    const schema = generatePersonSchema()
    expect(schema.image).toBe(`${seoConfig.siteUrl}${seoConfig.defaultImage}`)
  })
})
