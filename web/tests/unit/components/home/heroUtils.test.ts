import { describe, it, expect } from 'vitest'

import {
  mapButtonSize,
  mapCtaVariant,
  resolveEffectiveValues,
  offsetXKey,
  offsetYKey,
} from '@/components/features/home/heroUtils'
import type { HomeSettingsData } from '@/actions/settings/home'

const baseSettings: Partial<HomeSettingsData> = {
  id: 'singleton',
  showHeroTitle1: true,
  showHeroTitle2: true,
  showOwnerName: true,
  showHeroMainImage: true,
  showIllustration: true,
  showCtaButton: true,
  showFeaturedImages: true,
  featuredCount: 6,
}

describe('heroUtils — mapCtaVariant', () => {
  it('normaliza valores conocidos', () => {
    expect(mapCtaVariant('primary')).toBe('primary')
    expect(mapCtaVariant('default')).toBe('primary')
    expect(mapCtaVariant('secondary')).toBe('secondary')
    expect(mapCtaVariant('outline')).toBe('outline')
    expect(mapCtaVariant('ghost')).toBe('ghost')
  })

  it('null/undefined → primary (default seguro)', () => {
    expect(mapCtaVariant(null)).toBe('primary')
    expect(mapCtaVariant(undefined)).toBe('primary')
  })

  it('valor desconocido → primary (fallback)', () => {
    expect(mapCtaVariant('cualquier-cosa')).toBe('primary')
  })
})

describe('heroUtils — mapButtonSize', () => {
  it('mapea tamaños a Tamaños de Button.tsx', () => {
    expect(mapButtonSize('sm')).toBe('sm')
    expect(mapButtonSize('md')).toBe('md')
    expect(mapButtonSize('lg')).toBe('lg')
    expect(mapButtonSize('xl')).toBe('xl')
  })

  it('"default" → md (alias)', () => {
    expect(mapButtonSize('default')).toBe('md')
  })

  it('"icon" → md (alias legacy)', () => {
    expect(mapButtonSize('icon')).toBe('md')
  })

  it('null/undefined → lg (fallback)', () => {
    expect(mapButtonSize(null)).toBe('lg')
    expect(mapButtonSize(undefined)).toBe('lg')
  })
})

describe('heroUtils — offsetXKey / offsetYKey (responsive)', () => {
  it('devuelve key correcta para cada viewport', () => {
    expect(offsetXKey('heroTitle1', 'desktop')).toBe('heroTitle1OffsetX')
    expect(offsetXKey('heroTitle1', 'tablet')).toBe('heroTitle1TabletOffsetX')
    expect(offsetXKey('heroTitle1', 'mobile')).toBe('heroTitle1MobileOffsetX')

    expect(offsetXKey('ctaButton', 'desktop')).toBe('ctaOffsetX')
    expect(offsetXKey('ctaButton', 'tablet')).toBe('ctaTabletOffsetX')
    expect(offsetXKey('ctaButton', 'mobile')).toBe('ctaMobileOffsetX')
  })

  it('offsetYKey sigue el mismo patrón', () => {
    expect(offsetYKey('illustration', 'desktop')).toBe('illustrationOffsetY')
    expect(offsetYKey('illustration', 'tablet')).toBe('illustrationTabletOffsetY')
    expect(offsetYKey('illustration', 'mobile')).toBe('illustrationMobileOffsetY')
  })
})

describe('heroUtils — resolveEffectiveValues', () => {
  it('desktop → usa valores desktop', () => {
    const eff = resolveEffectiveValues(
      {
        ...baseSettings,
        heroTitle1OffsetX: 10,
        heroTitle1OffsetY: 20,
      } as Partial<HomeSettingsData>,
      'desktop'
    )
    expect(eff.title1OffsetX).toBe(10)
    expect(eff.title1OffsetY).toBe(20)
  })

  it('tablet → usa tablet si está definido, sino fallback a desktop', () => {
    const eff = resolveEffectiveValues(
      {
        ...baseSettings,
        heroTitle1OffsetX: 10,
        heroTitle1TabletOffsetX: 50,
      } as Partial<HomeSettingsData>,
      'tablet'
    )
    expect(eff.title1OffsetX).toBe(50)
  })

  it('tablet → fallback a desktop si tablet no está definido', () => {
    const eff = resolveEffectiveValues(
      { ...baseSettings, heroTitle1OffsetX: 10 } as Partial<HomeSettingsData>,
      'tablet'
    )
    expect(eff.title1OffsetX).toBe(10)
  })

  it('mobile → usa mobile, fallback a desktop', () => {
    const eff = resolveEffectiveValues(
      {
        ...baseSettings,
        ctaOffsetX: 5,
        ctaMobileOffsetX: 25,
      } as Partial<HomeSettingsData>,
      'mobile'
    )
    expect(eff.ctaOffsetX).toBe(25)
  })

  it('mobile → fallback a desktop si mobile no está', () => {
    const eff = resolveEffectiveValues(
      { ...baseSettings, ctaOffsetX: 5 } as Partial<HomeSettingsData>,
      'mobile'
    )
    expect(eff.ctaOffsetX).toBe(5)
  })

  it('illustrationRotation aplica tablet/desktop fallback', () => {
    const eff = resolveEffectiveValues(
      {
        ...baseSettings,
        illustrationRotation: 15,
        illustrationTabletRotation: 45,
      } as Partial<HomeSettingsData>,
      'tablet'
    )
    expect(eff.illRotation).toBe(45)
  })

  it('ctaSize usa tabletSize si está definido', () => {
    const eff = resolveEffectiveValues(
      {
        ...baseSettings,
        ctaSize: 'sm',
        ctaTabletSize: 'lg',
      } as Partial<HomeSettingsData>,
      'tablet'
    )
    expect(eff.ctaSize).toBe('lg')
  })
})
