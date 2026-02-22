import { describe, it, expect } from 'vitest'
import { getOptimizedUrl, getVariantUrl, getBlurPlaceholderUrl } from '@/lib/cloudinary-helper'

describe('Cloudinary Helper', () => {
  const sampleCloudinaryUrl =
    'https://res.cloudinary.com/demo-cloud/image/upload/v1234567890/sample.jpg'

  describe('getOptimizedUrl', () => {
    it('should return original URL if not a Cloudinary URL', () => {
      const externalUrl = 'https://example.com/image.jpg'
      const result = getOptimizedUrl(externalUrl)

      expect(result).toBe(externalUrl)
    })

    it('should add width transformation', () => {
      const result = getOptimizedUrl(sampleCloudinaryUrl, { width: 800 })

      expect(result).toContain('w_800')
    })

    it('should add quality transformation', () => {
      const result = getOptimizedUrl(sampleCloudinaryUrl, { quality: 80 })

      expect(result).toContain('q_80')
    })

    it('should use auto quality by default', () => {
      const result = getOptimizedUrl(sampleCloudinaryUrl, {})

      expect(result).toContain('q_auto')
    })

    it('should add format transformation', () => {
      const result = getOptimizedUrl(sampleCloudinaryUrl, { format: 'webp' })

      expect(result).toContain('f_webp')
    })

    it('should combine multiple transformations', () => {
      const result = getOptimizedUrl(sampleCloudinaryUrl, {
        width: 1200,
        height: 800,
        quality: 'auto',
        format: 'auto',
      })

      expect(result).toContain('w_1200')
      expect(result).toContain('h_800')
      expect(result).toContain('q_auto')
      expect(result).toContain('f_auto')
    })

    it('should preserve cloudinary URL structure', () => {
      const result = getOptimizedUrl(sampleCloudinaryUrl, { width: 800 })

      expect(result).toMatch(
        /^https:\/\/res\.cloudinary\.com\/demo-cloud\/image\/upload\/.*\/v1234567890\/sample\.jpg$/
      )
    })

    it('should add crop transformation when specified', () => {
      const result = getOptimizedUrl(sampleCloudinaryUrl, {
        width: 800,
        height: 600,
        crop: 'fill',
      })

      expect(result).toContain('c_fill')
    })

    it('should add effect transformation', () => {
      const result = getOptimizedUrl(sampleCloudinaryUrl, { effect: 'blur:100' })

      expect(result).toContain('e_blur:100')
    })
  })

  describe('getVariantUrl', () => {
    it('should apply thumbnail variant transformations', () => {
      const result = getVariantUrl(sampleCloudinaryUrl, 'thumbnail')

      expect(result).toContain('w_400')
      expect(result).toContain('q_auto')
      expect(result).toContain('f_auto')
    })

    it('should apply card variant transformations', () => {
      const result = getVariantUrl(sampleCloudinaryUrl, 'card')

      expect(result).toContain('w_800')
    })

    it('should apply hero variant transformations', () => {
      const result = getVariantUrl(sampleCloudinaryUrl, 'hero')

      expect(result).toContain('w_1600')
    })

    it('should apply full variant transformations', () => {
      const result = getVariantUrl(sampleCloudinaryUrl, 'full')

      expect(result).toContain('w_1920')
    })

    it('should apply original variant with only quality and format', () => {
      const result = getVariantUrl(sampleCloudinaryUrl, 'original')

      expect(result).toContain('q_auto')
      expect(result).toContain('f_auto')
      expect(result).not.toContain('w_')
    })
  })

  describe('getBlurPlaceholderUrl', () => {
    it('should generate a blur placeholder with small width', () => {
      const result = getBlurPlaceholderUrl(sampleCloudinaryUrl)

      expect(result).toContain('w_20')
    })

    it('should include blur effect', () => {
      const result = getBlurPlaceholderUrl(sampleCloudinaryUrl)

      expect(result).toContain('e_blur:1000')
    })

    it('should use auto quality', () => {
      const result = getBlurPlaceholderUrl(sampleCloudinaryUrl)

      expect(result).toContain('q_auto')
    })

    it('should be a valid Cloudinary URL', () => {
      const result = getBlurPlaceholderUrl(sampleCloudinaryUrl)

      expect(result).toMatch(/^https:\/\/res\.cloudinary\.com\//)
    })
  })

  describe('Edge cases', () => {
    it('should handle Cloudinary URL without version', () => {
      const urlWithoutVersion = 'https://res.cloudinary.com/demo-cloud/image/upload/sample.jpg'
      const result = getOptimizedUrl(urlWithoutVersion, { width: 800 })

      expect(result).toContain('w_800')
      expect(result).toContain('sample.jpg')
    })

    it('should handle Cloudinary URL with folders', () => {
      const urlWithFolder =
        'https://res.cloudinary.com/demo-cloud/image/upload/v123/folder/subfolder/sample.jpg'
      const result = getOptimizedUrl(urlWithFolder, { width: 800 })

      expect(result).toContain('folder/subfolder/sample.jpg')
    })
  })
})
