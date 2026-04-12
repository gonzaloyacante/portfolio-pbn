import { HomeSettingsData } from '@/actions/settings/home'

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

const mob = <T,>(
  isMobile: boolean,
  mobileVal: T | null | undefined,
  desktopVal: T | null | undefined,
  fallback: T
): T => {
  if (isMobile && mobileVal != null) return mobileVal
  return desktopVal ?? fallback
}

export function resolveEffectiveValues(s: Partial<HomeSettingsData>, isMobile: boolean) {
  return {
    title1OffsetX: mob(isMobile, s.heroTitle1MobileOffsetX, s.heroTitle1OffsetX, 0),
    title1OffsetY: mob(isMobile, s.heroTitle1MobileOffsetY, s.heroTitle1OffsetY, 0),
    title1FontSize: mob(isMobile, s.heroTitle1MobileFontSize, s.heroTitle1FontSize, null),
    title2OffsetX: mob(isMobile, s.heroTitle2MobileOffsetX, s.heroTitle2OffsetX, 0),
    title2OffsetY: mob(isMobile, s.heroTitle2MobileOffsetY, s.heroTitle2OffsetY, 0),
    title2FontSize: mob(isMobile, s.heroTitle2MobileFontSize, s.heroTitle2FontSize, null),
    ownerOffsetX: mob(isMobile, s.ownerNameMobileOffsetX, s.ownerNameOffsetX, 0),
    ownerOffsetY: mob(isMobile, s.ownerNameMobileOffsetY, s.ownerNameOffsetY, 0),
    ownerFontSize: mob(isMobile, s.ownerNameMobileFontSize, s.ownerNameFontSize, null),
    imgOffsetX: mob(isMobile, s.heroMainImageMobileOffsetX, s.heroMainImageOffsetX, 0),
    imgOffsetY: mob(isMobile, s.heroMainImageMobileOffsetY, s.heroMainImageOffsetY, 0),
    illOffsetX: mob(isMobile, s.illustrationMobileOffsetX, s.illustrationOffsetX, 0),
    illOffsetY: mob(isMobile, s.illustrationMobileOffsetY, s.illustrationOffsetY, 0),
    illSize: mob(isMobile, s.illustrationMobileSize, s.illustrationSize, 100),
    illRotation: mob(isMobile, s.illustrationMobileRotation, s.illustrationRotation, 0),
    ctaOffsetX: mob(isMobile, s.ctaMobileOffsetX, s.ctaOffsetX, 0),
    ctaOffsetY: mob(isMobile, s.ctaMobileOffsetY, s.ctaOffsetY, 0),
    ctaFontSize: mob(isMobile, s.ctaMobileFontSize, s.ctaFontSize, null),
  }
}
