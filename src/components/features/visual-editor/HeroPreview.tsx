'use client'

import { HomeSettingsData } from '@/actions/theme.actions'
import { ClickableElement } from './ClickableElement'
import type { EditableElement } from './types'
import { Button, OptimizedImage } from '@/components/ui'
import type { ButtonProps } from '@/components/ui/forms/Button'
import { FontLoader } from '../home/FontLoader'

interface HeroPreviewProps {
  settings: HomeSettingsData | null
  selectedElement: EditableElement
  onSelectElement: (element: EditableElement) => void
}

/**
 * Preview del Hero con elementos clickeables para el Visual Editor
 */
export function HeroPreview({ settings, selectedElement, onSelectElement }: HeroPreviewProps) {
  const title1 = settings?.heroTitle1Text || 'Make-up'
  const title2 = settings?.heroTitle2Text || 'Portfolio'
  const ownerName = settings?.ownerNameText || 'Paola Bolívar Nievas'
  const ctaText = settings?.ctaText || 'Ver Portfolio'
  const mainImage = settings?.heroMainImageUrl
  const illustration = settings?.illustrationUrl
  const illustrationAlt = settings?.illustrationAlt || 'Ilustración'
  const caption = settings?.heroMainImageCaption
  const imageStyle = settings?.heroImageStyle || 'original'

  // Fonts to load (Preview needs to load them too)
  const fontsToLoad = [
    { name: settings?.heroTitle1Font, url: settings?.heroTitle1FontUrl },
    { name: settings?.heroTitle2Font, url: settings?.heroTitle2FontUrl },
    { name: settings?.ownerNameFont, url: settings?.ownerNameFontUrl },
    { name: settings?.ctaFont, url: settings?.ctaFontUrl },
  ]

  // Dynamic Styles Logic (similar to HeroSection)
  const getTextStyle = (
    size?: number | null,
    font?: string | null,
    color?: string | null,
    colorDark?: string | null,
    defaultSize?: string
  ) => {
    return {
      fontSize: size ? `${size}px` : defaultSize,
      fontFamily: font ? `"${font}", sans-serif` : undefined,
      '--text-color': color || undefined,
      '--text-color-dark': colorDark || color || undefined,
    } as React.CSSProperties
  }

  const getDynamicColorClass = (hasCustomColor: boolean) =>
    hasCustomColor
      ? 'text-[var(--text-color)] dark:text-[var(--text-color-dark)] transition-colors duration-300'
      : ''

  const getImageStyleClasses = (style: string) => {
    switch (style) {
      case 'square':
        return {
          container: 'aspect-square w-full max-w-md mx-auto',
          image: 'object-cover rounded-lg',
        }
      case 'circle':
        return {
          container: 'aspect-square w-full max-w-md mx-auto',
          image: 'object-cover rounded-full',
        }
      case 'landscape':
        return {
          container: 'aspect-video w-full',
          image: 'object-cover rounded-lg',
        }
      case 'portrait':
        return {
          container: 'aspect-[3/4] w-full max-w-md mx-auto',
          image: 'object-cover rounded-lg',
        }
      case 'star':
        return {
          container: 'aspect-square w-full max-w-md mx-auto',
          image: 'object-cover',
          clipPath:
            'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        }
      case 'original':
      default:
        return {
          container: 'h-[50vh] w-full lg:h-[60vh]',
          image: 'object-contain',
        }
    }
  }

  const imageStyles = getImageStyleClasses(imageStyle)

  return (
    <section className="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden bg-[var(--background)] px-4 py-8">
      <FontLoader fonts={fontsToLoad} />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
        {/* Columna Izquierda */}
        <div className="flex flex-col items-center space-y-6 text-center lg:items-start lg:text-left">
          {/* Títulos */}
          <div className="space-y-2">
            <ClickableElement
              id="heroTitle1"
              isSelected={selectedElement === 'heroTitle1'}
              onClick={() => onSelectElement('heroTitle1')}
            >
              <h1
                className={`font-script ${getDynamicColorClass(!!settings?.heroTitle1Color)} ${!settings?.heroTitle1Color ? 'text-[var(--primary)]' : ''}`}
                style={{
                  lineHeight: 1,
                  ...getTextStyle(
                    settings?.heroTitle1FontSize,
                    settings?.heroTitle1Font,
                    settings?.heroTitle1Color,
                    settings?.heroTitle1ColorDark,
                    '6rem'
                  ),
                }}
              >
                {title1}
              </h1>
            </ClickableElement>

            <ClickableElement
              id="heroTitle2"
              isSelected={selectedElement === 'heroTitle2'}
              onClick={() => onSelectElement('heroTitle2')}
            >
              <h2
                className={`font-heading font-bold ${getDynamicColorClass(!!settings?.heroTitle2Color)} ${!settings?.heroTitle2Color ? 'text-[var(--accent)]' : ''}`}
                style={{
                  lineHeight: 1,
                  ...getTextStyle(
                    settings?.heroTitle2FontSize,
                    settings?.heroTitle2Font,
                    settings?.heroTitle2Color,
                    settings?.heroTitle2ColorDark,
                    '5rem'
                  ),
                }}
              >
                {title2}
              </h2>
            </ClickableElement>
          </div>

          {/* Ilustración + Nombre */}
          <div className="flex flex-col items-center gap-4 lg:flex-row">
            {illustration && (
              <ClickableElement
                id="illustration"
                isSelected={selectedElement === 'illustration'}
                onClick={() => onSelectElement('illustration')}
                className="h-24 w-24 flex-shrink-0"
              >
                <OptimizedImage
                  src={illustration}
                  alt={illustrationAlt}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain"
                  transparentBackground={true}
                />
              </ClickableElement>
            )}

            <ClickableElement
              id="ownerName"
              isSelected={selectedElement === 'ownerName'}
              onClick={() => onSelectElement('ownerName')}
            >
              <p
                className={`font-script ${getDynamicColorClass(!!settings?.ownerNameColor)} ${!settings?.ownerNameColor ? 'text-[var(--primary)]' : ''}`}
                style={{
                  ...getTextStyle(
                    settings?.ownerNameFontSize,
                    settings?.ownerNameFont,
                    settings?.ownerNameColor,
                    settings?.ownerNameColorDark,
                    '2.5rem'
                  ),
                }}
              >
                {ownerName}
              </p>
            </ClickableElement>
          </div>

          {/* Botón CTA */}
          <ClickableElement
            id="ctaButton"
            isSelected={selectedElement === 'ctaButton'}
            onClick={() => onSelectElement('ctaButton')}
            className="inline-block"
          >
            <Button
              asChild
              size="lg"
              variant={(settings?.ctaVariant || 'primary') as ButtonProps['variant']}
              className="pointer-events-none h-auto px-8 py-6 text-lg" // Disable link click in editor
              style={{
                fontSize: settings?.ctaFontSize ? `${settings?.ctaFontSize}px` : undefined,
                fontFamily: settings?.ctaFont ? `"${settings.ctaFont}", sans-serif` : undefined,
              }}
            >
              <span>{ctaText}</span>
            </Button>
          </ClickableElement>
        </div>

        {/* Columna Derecha - Imagen */}
        <div className="flex items-center justify-center">
          <ClickableElement
            id="heroMainImage"
            isSelected={selectedElement === 'heroMainImage'}
            onClick={() => onSelectElement('heroMainImage')}
            className={`relative w-full ${mainImage ? '' : 'min-h-[300px]'}`}
          >
            {mainImage ? (
              imageStyle === 'original' ? (
                <div className="relative w-full bg-transparent">
                  <OptimizedImage
                    src={mainImage}
                    alt="Hero"
                    width={600}
                    height={600}
                    className="h-auto w-full object-contain"
                    priority
                    transparentBackground={true}
                  />
                  {caption && (
                    <div className="absolute right-6 bottom-6 max-w-xs rounded-xl bg-white/10 p-4 backdrop-blur-md">
                      <p className="font-script text-xl text-white">{caption}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`relative bg-transparent ${imageStyles.container}`}
                  style={imageStyles.clipPath ? { clipPath: imageStyles.clipPath } : undefined}
                >
                  <OptimizedImage
                    src={mainImage}
                    alt="Hero"
                    fill
                    className={imageStyles.image}
                    priority
                    transparentBackground={true}
                  />
                </div>
              )
            ) : (
              <div className="border-muted-foreground/20 flex h-96 w-full max-w-md items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground text-sm">Sin imagen</p>
              </div>
            )}
          </ClickableElement>
        </div>
      </div>
    </section>
  )
}
