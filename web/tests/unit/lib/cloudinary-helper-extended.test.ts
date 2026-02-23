import { describe, it, expect } from 'vitest'
import { getOptimizedUrl, getVariantUrl, getBlurPlaceholderUrl } from '@/lib/cloudinary-helper'

const CLOUD_BASE = 'https://res.cloudinary.com/mycloud/image/upload'
const VALID_URL = `${CLOUD_BASE}/v1234567890/folder/image.jpg`
const VALID_URL_NO_VERSION = `${CLOUD_BASE}/folder/image.jpg`

describe('getOptimizedUrl — extended edge cases', () => {
  it('returns original URL if not a Cloudinary URL', () => {
    const url = 'https://example.com/image.jpg'
    expect(getOptimizedUrl(url)).toBe(url)
  })

  it('returns original for non-http URL', () => {
    expect(getOptimizedUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc')
  })

  it('returns original for empty string', () => {
    expect(getOptimizedUrl('')).toBe('')
  })

  it('applies width transformation', () => {
    const result = getOptimizedUrl(VALID_URL, { width: 800 })
    expect(result).toContain('w_800')
  })

  it('applies height transformation', () => {
    const result = getOptimizedUrl(VALID_URL, { height: 600 })
    expect(result).toContain('h_600')
  })

  it('applies crop transformation', () => {
    const result = getOptimizedUrl(VALID_URL, { crop: 'fill' })
    expect(result).toContain('c_fill')
  })

  it('applies quality auto by default', () => {
    const result = getOptimizedUrl(VALID_URL)
    expect(result).toContain('q_auto')
  })

  it('applies custom quality number', () => {
    const result = getOptimizedUrl(VALID_URL, { quality: 75 })
    expect(result).toContain('q_75')
  })

  it('applies format auto by default', () => {
    const result = getOptimizedUrl(VALID_URL)
    expect(result).toContain('f_auto')
  })

  it('applies specific format (webp)', () => {
    const result = getOptimizedUrl(VALID_URL, { format: 'webp' })
    expect(result).toContain('f_webp')
  })

  it('applies specific format (avif)', () => {
    const result = getOptimizedUrl(VALID_URL, { format: 'avif' })
    expect(result).toContain('f_avif')
  })

  it('applies effect transformation', () => {
    const result = getOptimizedUrl(VALID_URL, { effect: 'blur:1000' })
    expect(result).toContain('e_blur:1000')
  })

  it('combines multiple transformations', () => {
    const result = getOptimizedUrl(VALID_URL, {
      width: 400,
      height: 300,
      crop: 'fill',
      quality: 80,
      format: 'webp',
      effect: 'sharpen',
    })
    expect(result).toContain('w_400')
    expect(result).toContain('h_300')
    expect(result).toContain('c_fill')
    expect(result).toContain('q_80')
    expect(result).toContain('f_webp')
    expect(result).toContain('e_sharpen')
  })

  it('preserves cloud name in output URL', () => {
    const result = getOptimizedUrl(VALID_URL, { width: 100 })
    expect(result).toContain('res.cloudinary.com/mycloud')
  })

  it('preserves version in output URL', () => {
    const result = getOptimizedUrl(VALID_URL, { width: 100 })
    expect(result).toContain('v1234567890/')
  })

  it('handles URL without version', () => {
    const result = getOptimizedUrl(VALID_URL_NO_VERSION, { width: 100 })
    expect(result).toContain('w_100')
    expect(result).toContain('folder/image.jpg')
  })

  it('handles very large width value', () => {
    const result = getOptimizedUrl(VALID_URL, { width: 10000 })
    expect(result).toContain('w_10000')
  })

  it('handles zero width (still included)', () => {
    const result = getOptimizedUrl(VALID_URL, { width: 0 })
    // width 0 is falsy so should not be included
    expect(result).not.toContain('w_0')
  })

  it('handles URL with query parameters (non-cloudinary)', () => {
    const url = 'https://example.com/image.jpg?w=100'
    expect(getOptimizedUrl(url)).toBe(url)
  })

  it('handles quality as auto string', () => {
    const result = getOptimizedUrl(VALID_URL, { quality: 'auto' })
    expect(result).toContain('q_auto')
  })

  it('preserves publicId with nested folders', () => {
    const deepUrl = `${CLOUD_BASE}/v1/a/b/c/image.png`
    const result = getOptimizedUrl(deepUrl, { width: 200 })
    expect(result).toContain('a/b/c/image.png')
  })
})

describe('getVariantUrl — extended', () => {
  it('returns original for non-cloudinary URL', () => {
    expect(getVariantUrl('https://example.com/img.jpg', 'thumbnail')).toBe(
      'https://example.com/img.jpg'
    )
  })

  it('applies thumbnail variant (w_400)', () => {
    const result = getVariantUrl(VALID_URL, 'thumbnail')
    expect(result).toContain('w_400')
  })

  it('applies card variant (w_800)', () => {
    const result = getVariantUrl(VALID_URL, 'card')
    expect(result).toContain('w_800')
  })

  it('applies hero variant (w_1600)', () => {
    const result = getVariantUrl(VALID_URL, 'hero')
    expect(result).toContain('w_1600')
  })

  it('applies full variant (w_1920)', () => {
    const result = getVariantUrl(VALID_URL, 'full')
    expect(result).toContain('w_1920')
  })

  it('applies original variant (no width)', () => {
    const result = getVariantUrl(VALID_URL, 'original')
    expect(result).not.toContain('w_')
  })

  it('all variants include q_auto and f_auto', () => {
    for (const variant of ['thumbnail', 'card', 'hero', 'full', 'original'] as const) {
      const result = getVariantUrl(VALID_URL, variant)
      expect(result).toContain('q_auto')
      expect(result).toContain('f_auto')
    }
  })
})

describe('getBlurPlaceholderUrl — extended', () => {
  it('returns original for non-cloudinary URL', () => {
    expect(getBlurPlaceholderUrl('https://example.com/img.jpg')).toBe('https://example.com/img.jpg')
  })

  it('applies w_20 for placeholder', () => {
    const result = getBlurPlaceholderUrl(VALID_URL)
    expect(result).toContain('w_20')
  })

  it('applies blur effect', () => {
    const result = getBlurPlaceholderUrl(VALID_URL)
    expect(result).toContain('e_blur:1000')
  })

  it('applies quality auto', () => {
    const result = getBlurPlaceholderUrl(VALID_URL)
    expect(result).toContain('q_auto')
  })
})
