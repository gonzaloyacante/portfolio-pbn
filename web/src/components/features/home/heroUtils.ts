import { HomeSettingsData } from '@/actions/settings/home'
import type { ViewportMode } from '../visual-editor/types'

export function mapButtonSize(size: string | null | undefined): 'sm' | 'md' | 'lg' | 'xl' {
  if (size === 'sm') return 'sm'
  if (size === 'md') return 'md'
  if (size === 'xl') return 'xl'
  if (size === 'default') return 'md'
  if (size === 'icon') return 'md'
  return 'lg'
}

export function mapCtaVariant(
  variant: string | null | undefined
): 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' {
  switch (variant) {
    case 'primary':
    case 'default':
      return 'primary'
    case 'secondary':
      return 'secondary'
    case 'outline':
      return 'outline'
    case 'ghost':
      return 'ghost'
    default:
      return 'primary'
  }
}

/**
 * Resuelve un valor leyendo desktop, tablet, mobile según el viewport activo.
 * - En `desktop`: lee `desktopKey`
 * - En `tablet`: lee `tabletKey`; si es null, fallback a `desktopKey`
 * - En `mobile`: lee `mobileKey`; si es null, fallback a `desktopKey`
 */
function viewportValue<T>(
  viewportMode: ViewportMode,
  desktopKey: keyof HomeSettingsData,
  tabletKey: keyof HomeSettingsData | undefined,
  mobileKey: keyof HomeSettingsData | undefined,
  s: Partial<HomeSettingsData>,
  fallback: T
): T {
  const desktop = s[desktopKey] as T | null | undefined
  if (viewportMode === 'desktop') {
    return (desktop ?? fallback) as T
  }
  if (viewportMode === 'tablet') {
    const tablet = tabletKey ? (s[tabletKey] as T | null | undefined) : undefined
    return (tablet ?? desktop ?? fallback) as T
  }
  // mobile
  const mobile = mobileKey ? (s[mobileKey] as T | null | undefined) : undefined
  return (mobile ?? desktop ?? fallback) as T
}

export function resolveEffectiveValues(s: Partial<HomeSettingsData>, viewportMode: ViewportMode) {
  return {
    title1OffsetX: viewportValue<number>(
      viewportMode,
      'heroTitle1OffsetX',
      'heroTitle1TabletOffsetX',
      'heroTitle1MobileOffsetX',
      s,
      0
    ),
    title1OffsetY: viewportValue<number>(
      viewportMode,
      'heroTitle1OffsetY',
      'heroTitle1TabletOffsetY',
      'heroTitle1MobileOffsetY',
      s,
      0
    ),
    title1FontSize: viewportValue<number | null>(
      viewportMode,
      'heroTitle1FontSize',
      'heroTitle1TabletFontSize',
      'heroTitle1MobileFontSize',
      s,
      null
    ),
    title2OffsetX: viewportValue<number>(
      viewportMode,
      'heroTitle2OffsetX',
      'heroTitle2TabletOffsetX',
      'heroTitle2MobileOffsetX',
      s,
      0
    ),
    title2OffsetY: viewportValue<number>(
      viewportMode,
      'heroTitle2OffsetY',
      'heroTitle2TabletOffsetY',
      'heroTitle2MobileOffsetY',
      s,
      0
    ),
    title2FontSize: viewportValue<number | null>(
      viewportMode,
      'heroTitle2FontSize',
      'heroTitle2TabletFontSize',
      'heroTitle2MobileFontSize',
      s,
      null
    ),
    ownerOffsetX: viewportValue<number>(
      viewportMode,
      'ownerNameOffsetX',
      'ownerNameTabletOffsetX',
      'ownerNameMobileOffsetX',
      s,
      0
    ),
    ownerOffsetY: viewportValue<number>(
      viewportMode,
      'ownerNameOffsetY',
      'ownerNameTabletOffsetY',
      'ownerNameMobileOffsetY',
      s,
      0
    ),
    ownerFontSize: viewportValue<number | null>(
      viewportMode,
      'ownerNameFontSize',
      'ownerNameTabletFontSize',
      'ownerNameMobileFontSize',
      s,
      null
    ),
    imgOffsetX: viewportValue<number>(
      viewportMode,
      'heroMainImageOffsetX',
      'heroMainImageTabletOffsetX',
      'heroMainImageMobileOffsetX',
      s,
      0
    ),
    imgOffsetY: viewportValue<number>(
      viewportMode,
      'heroMainImageOffsetY',
      'heroMainImageTabletOffsetY',
      'heroMainImageMobileOffsetY',
      s,
      0
    ),
    imgImageStyle: viewportValue<string | null>(
      viewportMode,
      'heroImageStyle',
      'heroMainImageTabletImageStyle',
      'heroMainImageMobileImageStyle',
      s,
      null
    ),
    illOffsetX: viewportValue<number>(
      viewportMode,
      'illustrationOffsetX',
      'illustrationTabletOffsetX',
      'illustrationMobileOffsetX',
      s,
      0
    ),
    illOffsetY: viewportValue<number>(
      viewportMode,
      'illustrationOffsetY',
      'illustrationTabletOffsetY',
      'illustrationMobileOffsetY',
      s,
      0
    ),
    illSize: viewportValue<number>(
      viewportMode,
      'illustrationSize',
      'illustrationTabletSize',
      'illustrationMobileSize',
      s,
      100
    ),
    illRotation: viewportValue<number>(
      viewportMode,
      'illustrationRotation',
      'illustrationTabletRotation',
      'illustrationMobileRotation',
      s,
      0
    ),
    ctaOffsetX: viewportValue<number>(
      viewportMode,
      'ctaOffsetX',
      'ctaTabletOffsetX',
      'ctaMobileOffsetX',
      s,
      0
    ),
    ctaOffsetY: viewportValue<number>(
      viewportMode,
      'ctaOffsetY',
      'ctaTabletOffsetY',
      'ctaMobileOffsetY',
      s,
      0
    ),
    ctaFontSize: viewportValue<number | null>(
      viewportMode,
      'ctaFontSize',
      'ctaTabletFontSize',
      'ctaMobileFontSize',
      s,
      null
    ),
    ctaSize: viewportValue<string | null>(
      viewportMode,
      'ctaSize',
      'ctaTabletSize',
      'ctaMobileSize',
      s,
      null
    ),
  }
}

/**
 * Devuelve la key del campo de la BD para el offset X de un elemento
 * según el viewport activo. Usado por el drag-and-drop para saber dónde guardar.
 */
export function offsetXKey(
  element:
    | 'heroTitle1'
    | 'heroTitle2'
    | 'ownerName'
    | 'heroMainImage'
    | 'illustration'
    | 'ctaButton',
  viewportMode: ViewportMode
): keyof HomeSettingsData {
  const map: Record<typeof element, Record<ViewportMode, keyof HomeSettingsData>> = {
    heroTitle1: {
      desktop: 'heroTitle1OffsetX',
      tablet: 'heroTitle1TabletOffsetX',
      mobile: 'heroTitle1MobileOffsetX',
    },
    heroTitle2: {
      desktop: 'heroTitle2OffsetX',
      tablet: 'heroTitle2TabletOffsetX',
      mobile: 'heroTitle2MobileOffsetX',
    },
    ownerName: {
      desktop: 'ownerNameOffsetX',
      tablet: 'ownerNameTabletOffsetX',
      mobile: 'ownerNameMobileOffsetX',
    },
    heroMainImage: {
      desktop: 'heroMainImageOffsetX',
      tablet: 'heroMainImageTabletOffsetX',
      mobile: 'heroMainImageMobileOffsetX',
    },
    illustration: {
      desktop: 'illustrationOffsetX',
      tablet: 'illustrationTabletOffsetX',
      mobile: 'illustrationMobileOffsetX',
    },
    ctaButton: {
      desktop: 'ctaOffsetX',
      tablet: 'ctaTabletOffsetX',
      mobile: 'ctaMobileOffsetX',
    },
  }
  return map[element][viewportMode]
}

export function offsetYKey(
  element:
    | 'heroTitle1'
    | 'heroTitle2'
    | 'ownerName'
    | 'heroMainImage'
    | 'illustration'
    | 'ctaButton',
  viewportMode: ViewportMode
): keyof HomeSettingsData {
  const map: Record<typeof element, Record<ViewportMode, keyof HomeSettingsData>> = {
    heroTitle1: {
      desktop: 'heroTitle1OffsetY',
      tablet: 'heroTitle1TabletOffsetY',
      mobile: 'heroTitle1MobileOffsetY',
    },
    heroTitle2: {
      desktop: 'heroTitle2OffsetY',
      tablet: 'heroTitle2TabletOffsetY',
      mobile: 'heroTitle2MobileOffsetY',
    },
    ownerName: {
      desktop: 'ownerNameOffsetY',
      tablet: 'ownerNameTabletOffsetY',
      mobile: 'ownerNameMobileOffsetY',
    },
    heroMainImage: {
      desktop: 'heroMainImageOffsetY',
      tablet: 'heroMainImageTabletOffsetY',
      mobile: 'heroMainImageMobileOffsetY',
    },
    illustration: {
      desktop: 'illustrationOffsetY',
      tablet: 'illustrationTabletOffsetY',
      mobile: 'illustrationMobileOffsetY',
    },
    ctaButton: {
      desktop: 'ctaOffsetY',
      tablet: 'ctaTabletOffsetY',
      mobile: 'ctaMobileOffsetY',
    },
  }
  return map[element][viewportMode]
}
