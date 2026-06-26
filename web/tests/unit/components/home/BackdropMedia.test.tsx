import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import BackdropMedia from '@/components/features/home/BackdropMedia'
import type { HomeSettingsData } from '@/actions/settings/home'

const baseSettings = {
  id: 'singleton',
  showHeroTitle1: true,
  showHeroTitle2: true,
  showOwnerName: true,
  showHeroMainImage: true,
  showIllustration: true,
  showCtaButton: true,
  showFeaturedImages: true,
  featuredCount: 6,
} as unknown as HomeSettingsData

describe('BackdropMedia', () => {
  it('retorna null cuando immersive está desactivado', () => {
    const { container } = render(
      <BackdropMedia
        settings={{
          ...baseSettings,
          heroImmersiveEnabled: false,
          heroBackdropUrl: 'https://x.com/img.jpg',
        }}
        className="absolute inset-0"
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('retorna null cuando no hay URL ni poster', () => {
    const { container } = render(
      <BackdropMedia settings={baseSettings} className="absolute inset-0" />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renderiza <video> cuando kind="video"', () => {
    const { container } = render(
      <BackdropMedia
        settings={{
          ...baseSettings,
          heroBackdropUrl: 'https://x.com/v.mp4',
          heroBackdropMediaKind: 'video',
        }}
        className="absolute inset-0"
      />
    )
    const video = container.querySelector('video')
    expect(video).not.toBeNull()
    expect(video?.getAttribute('src')).toBe('https://x.com/v.mp4')
  })

  it('auto-detecta mp4 con kind="auto"', () => {
    const { container } = render(
      <BackdropMedia
        settings={{
          ...baseSettings,
          heroBackdropUrl: 'https://x.com/clip.mp4',
          heroBackdropMediaKind: 'auto',
        }}
        className="absolute inset-0"
      />
    )
    expect(container.querySelector('video')).not.toBeNull()
  })

  it('renderiza <div> con background-image cuando es imagen', () => {
    const { container } = render(
      <BackdropMedia
        settings={{ ...baseSettings, heroBackdropUrl: 'https://x.com/foto.jpg' }}
        className="absolute inset-0"
      />
    )
    const video = container.querySelector('video')
    const div = container.querySelector('div[aria-hidden]')
    expect(video).toBeNull()
    expect(div).not.toBeNull()
    expect(div?.getAttribute('style')).toContain('background-image')
    expect(div?.getAttribute('style')).toContain('foto.jpg')
  })

  it('usa poster como fallback de URL', () => {
    const { container } = render(
      <BackdropMedia
        settings={
          {
            ...baseSettings,
            heroBackdropUrl: null,
            heroBackdropPosterUrl: 'https://x.com/poster.jpg',
          } as unknown as HomeSettingsData
        }
        className="absolute inset-0"
      />
    )
    expect(container.querySelector('div[aria-hidden]')).not.toBeNull()
  })

  it('respeta heroBackdropObjectFit: contain en background-size', () => {
    const { container } = render(
      <BackdropMedia
        settings={{
          ...baseSettings,
          heroBackdropUrl: 'https://x.com/foto.jpg',
          heroBackdropObjectFit: 'contain',
        }}
        className="absolute inset-0"
      />
    )
    const div = container.querySelector('div[aria-hidden]')
    expect(div?.getAttribute('style')).toContain('contain')
  })

  it('respeta heroBackdropObjectPosition', () => {
    const { container } = render(
      <BackdropMedia
        settings={{
          ...baseSettings,
          heroBackdropUrl: 'https://x.com/foto.jpg',
          heroBackdropObjectPosition: 'left top',
        }}
        className="absolute inset-0"
      />
    )
    const div = container.querySelector('div[aria-hidden]')
    expect(div?.getAttribute('style')).toContain('left top')
  })

  it('video: heroBackdropObjectFit="contain" aplica objectFit: contain', () => {
    const { container } = render(
      <BackdropMedia
        settings={{
          ...baseSettings,
          heroBackdropUrl: 'https://x.com/v.mp4',
          heroBackdropMediaKind: 'video',
          heroBackdropObjectFit: 'contain',
        }}
        className="absolute inset-0"
      />
    )
    const video = container.querySelector('video')
    expect(video?.getAttribute('style')).toContain('contain')
  })

  it('video usa poster si está definida', () => {
    const { container } = render(
      <BackdropMedia
        settings={{
          ...baseSettings,
          heroBackdropUrl: 'https://x.com/v.mp4',
          heroBackdropPosterUrl: 'https://x.com/poster.jpg',
          heroBackdropMediaKind: 'video',
        }}
        className="absolute inset-0"
      />
    )
    const video = container.querySelector('video')
    expect(video?.getAttribute('poster')).toBe('https://x.com/poster.jpg')
  })

  it('video key={url} fuerza remount al cambiar URL', () => {
    const { container, rerender } = render(
      <BackdropMedia
        settings={{
          ...baseSettings,
          heroBackdropUrl: 'https://x.com/v1.mp4',
          heroBackdropMediaKind: 'video',
        }}
        className="absolute inset-0"
      />
    )
    rerender(
      <BackdropMedia
        settings={{
          ...baseSettings,
          heroBackdropUrl: 'https://x.com/v2.mp4',
          heroBackdropMediaKind: 'video',
        }}
        className="absolute inset-0"
      />
    )
    const secondVideo = container.querySelector('video')
    // React re-mounts cuando cambia key — verificar que el src es el nuevo
    expect(secondVideo?.getAttribute('src')).toBe('https://x.com/v2.mp4')
  })
})
