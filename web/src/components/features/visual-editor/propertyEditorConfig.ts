import type { HomeSettingsData } from '@/actions/settings/home'
import type { EditableElement } from './types'

/**
 * Configuration for PropertyPanel Fields
 * Maps each editable element to its settings fields
 */

type FieldConfig = {
  text?: keyof HomeSettingsData
  font?: keyof HomeSettingsData
  fontUrl?: keyof HomeSettingsData
  fontSize?: keyof HomeSettingsData
  color?: keyof HomeSettingsData
  colorDark?: keyof HomeSettingsData
  zIndex?: keyof HomeSettingsData
  offsetX?: keyof HomeSettingsData
  offsetY?: keyof HomeSettingsData
  rotation?: keyof HomeSettingsData
  opacity?: keyof HomeSettingsData
  size?: keyof HomeSettingsData
  link?: keyof HomeSettingsData
  variant?: keyof HomeSettingsData
  imageUrl?: keyof HomeSettingsData
  imageStyle?: keyof HomeSettingsData
  // Extended fields
  alt?: keyof HomeSettingsData
  showFeatured?: keyof HomeSettingsData
  featuredCount?: keyof HomeSettingsData
}

type MobileFieldConfig = {
  offsetX?: keyof HomeSettingsData
  offsetY?: keyof HomeSettingsData
  fontSize?: keyof HomeSettingsData
  size?: keyof HomeSettingsData
  rotation?: keyof HomeSettingsData
}

type ControlConfig = {
  fields: FieldConfig
  mobileFields?: MobileFieldConfig
  defaults: {
    fontSize?: number
    fontSizeMin?: number
    fontSizeMax?: number
    zIndex?: number
  }
  label?: string
}

export type { FieldConfig, MobileFieldConfig, ControlConfig }

export const ELEMENT_CONFIG: Record<Exclude<EditableElement, null>, ControlConfig> = {
  heroTitle1: {
    fields: {
      text: 'heroTitle1Text',
      font: 'heroTitle1Font',
      fontUrl: 'heroTitle1FontUrl',
      fontSize: 'heroTitle1FontSize',
      color: 'heroTitle1Color',
      colorDark: 'heroTitle1ColorDark',
      zIndex: 'heroTitle1ZIndex',
      offsetX: 'heroTitle1OffsetX',
      offsetY: 'heroTitle1OffsetY',
    },
    mobileFields: {
      offsetX: 'heroTitle1MobileOffsetX',
      offsetY: 'heroTitle1MobileOffsetY',
      fontSize: 'heroTitle1MobileFontSize',
    },
    defaults: {
      fontSize: 112,
      fontSizeMin: 20,
      fontSizeMax: 300,
      zIndex: 20,
    },
    label: 'Título Principal',
  },
  heroTitle2: {
    fields: {
      text: 'heroTitle2Text',
      font: 'heroTitle2Font',
      fontUrl: 'heroTitle2FontUrl',
      fontSize: 'heroTitle2FontSize',
      color: 'heroTitle2Color',
      colorDark: 'heroTitle2ColorDark',
      zIndex: 'heroTitle2ZIndex',
      offsetX: 'heroTitle2OffsetX',
      offsetY: 'heroTitle2OffsetY',
    },
    mobileFields: {
      offsetX: 'heroTitle2MobileOffsetX',
      offsetY: 'heroTitle2MobileOffsetY',
      fontSize: 'heroTitle2MobileFontSize',
    },
    defaults: {
      fontSize: 96,
      fontSizeMin: 20,
      fontSizeMax: 300,
      zIndex: 10,
    },
    label: 'Subtítulo',
  },
  ownerName: {
    fields: {
      text: 'ownerNameText',
      font: 'ownerNameFont',
      fontUrl: 'ownerNameFontUrl',
      fontSize: 'ownerNameFontSize',
      color: 'ownerNameColor',
      colorDark: 'ownerNameColorDark',
      zIndex: 'ownerNameZIndex',
      offsetX: 'ownerNameOffsetX',
      offsetY: 'ownerNameOffsetY',
    },
    mobileFields: {
      offsetX: 'ownerNameMobileOffsetX',
      offsetY: 'ownerNameMobileOffsetY',
      fontSize: 'ownerNameMobileFontSize',
    },
    defaults: {
      fontSize: 36,
      fontSizeMin: 12,
      fontSizeMax: 100,
      zIndex: 15,
    },
    label: 'Nombre del Propietario',
  },
  illustration: {
    fields: {
      imageUrl: 'illustrationUrl',
      size: 'illustrationSize',
      opacity: 'illustrationOpacity',
      zIndex: 'illustrationZIndex',
      offsetX: 'illustrationOffsetX',
      offsetY: 'illustrationOffsetY',
      rotation: 'illustrationRotation',
    },
    mobileFields: {
      offsetX: 'illustrationMobileOffsetX',
      offsetY: 'illustrationMobileOffsetY',
      size: 'illustrationMobileSize',
      rotation: 'illustrationMobileRotation',
    },
    defaults: {
      zIndex: 10,
    },
    label: 'Ilustración',
  },
  ctaButton: {
    fields: {
      text: 'ctaText',
      link: 'ctaLink',
      variant: 'ctaVariant',
      font: 'ctaFont',
      fontUrl: 'ctaFontUrl',
      fontSize: 'ctaFontSize',
      offsetX: 'ctaOffsetX',
      offsetY: 'ctaOffsetY',
    },
    mobileFields: {
      offsetX: 'ctaMobileOffsetX',
      offsetY: 'ctaMobileOffsetY',
      fontSize: 'ctaMobileFontSize',
    },
    defaults: {
      fontSize: 16,
      fontSizeMin: 10,
      fontSizeMax: 32,
    },
    label: 'Botón de Acción',
  },
  heroMainImage: {
    fields: {
      imageUrl: 'heroMainImageUrl',
      imageStyle: 'heroImageStyle',
      alt: 'heroMainImageAlt',
      zIndex: 'heroMainImageZIndex',
      offsetX: 'heroMainImageOffsetX',
      offsetY: 'heroMainImageOffsetY',
    },
    mobileFields: {
      offsetX: 'heroMainImageMobileOffsetX',
      offsetY: 'heroMainImageMobileOffsetY',
    },
    defaults: {
      zIndex: 5,
    },
    label: 'Imagen Principal',
  },
  featuredTitle: {
    fields: {
      text: 'featuredTitle',
      font: 'featuredTitleFont',
      fontUrl: 'featuredTitleFontUrl',
      fontSize: 'featuredTitleFontSize',
      color: 'featuredTitleColor',
      colorDark: 'featuredTitleColorDark',
      showFeatured: 'showFeaturedImages',
      featuredCount: 'featuredCount',
    },
    defaults: {
      fontSize: 24,
      fontSizeMin: 12,
      fontSizeMax: 80,
    },
    label: 'Título Destacado',
  },
}
