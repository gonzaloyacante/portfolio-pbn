import { describe, it, expect } from 'vitest'

import { isHeroBackdropVideoUrl } from '@/lib/hero-backdrop-styles'

describe('isHeroBackdropVideoUrl', () => {
  it('kind="video" fuerza vídeo true', () => {
    expect(isHeroBackdropVideoUrl('https://example.com/foto.jpg', 'video')).toBe(true)
  })

  it('kind="image" fuerza vídeo false', () => {
    expect(isHeroBackdropVideoUrl('https://example.com/video.mp4', 'image')).toBe(false)
  })

  it('kind="auto" detecta mp4', () => {
    expect(isHeroBackdropVideoUrl('https://res.cloudinary.com/demo/video.mp4', 'auto')).toBe(true)
  })

  it('kind="auto" detecta webm', () => {
    expect(isHeroBackdropVideoUrl('https://example.com/clip.webm', 'auto')).toBe(true)
  })

  it('kind="auto" detecta Cloudinary /video/upload/', () => {
    expect(isHeroBackdropVideoUrl('https://res.cloudinary.com/demo/video/upload/abc', 'auto')).toBe(
      true
    )
  })

  it('kind="auto" NO detecta .jpg', () => {
    expect(isHeroBackdropVideoUrl('https://example.com/photo.jpg', 'auto')).toBe(false)
  })

  it('kind="auto" NO detecta .gif', () => {
    expect(isHeroBackdropVideoUrl('https://example.com/anim.gif', 'auto')).toBe(false)
  })

  it('kind null/undefined → mismo comportamiento que auto', () => {
    expect(isHeroBackdropVideoUrl('https://example.com/video.mp4', null)).toBe(true)
    expect(isHeroBackdropVideoUrl('https://example.com/video.mp4', undefined)).toBe(true)
    expect(isHeroBackdropVideoUrl('https://example.com/photo.jpg', undefined)).toBe(false)
  })

  it('URL con query string sigue detectando .mp4', () => {
    expect(
      isHeroBackdropVideoUrl(
        'https://res.cloudinary.com/demo/video/upload/v123/abc.mp4?w_800',
        'auto'
      )
    ).toBe(true)
  })
})
