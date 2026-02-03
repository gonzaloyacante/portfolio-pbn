'use client'

import { HomeSettingsData } from '@/actions/theme.actions'
import { ClickableElement } from '../visual-editor/ClickableElement'
import type { EditableElement } from '../visual-editor/types'
import { ROUTES } from '@/config/routes'
import { Button, OptimizedImage } from '@/components/ui'
import Link from 'next/link'

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
  const ctaLink = settings?.ctaLink || ROUTES.public.projects
  const mainImage = settings?.heroMainImageUrl
  const illustration = settings?.illustrationUrl

  return (
    <section className="bg-background relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden px-4 py-12">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-2">
        {/* Columna Izquierda */}
        <div className="space-y-6">
          {/* Títulos */}
          <div className="space-y-2">
            <ClickableElement
              id="heroTitle1"
              isSelected={selectedElement === 'heroTitle1'}
              onClick={() => onSelectElement('heroTitle1')}
            >
              <h1 className="font-script text-primary text-6xl lg:text-8xl">{title1}</h1>
            </ClickableElement>

            <ClickableElement
              id="heroTitle2"
              isSelected={selectedElement === 'heroTitle2'}
              onClick={() => onSelectElement('heroTitle2')}
            >
              <h2 className="font-heading text-5xl font-bold lg:text-7xl">{title2}</h2>
            </ClickableElement>
          </div>

          {/* Ilustración + Nombre */}
          <div className="flex items-center gap-4">
            {illustration && (
              <ClickableElement
                id="illustration"
                isSelected={selectedElement === 'illustration'}
                onClick={() => onSelectElement('illustration')}
                className="h-24 w-24 flex-shrink-0"
              >
                <OptimizedImage
                  src={illustration}
                  alt="Ilustración"
                  width={96}
                  height={96}
                  className="h-full w-full object-contain"
                />
              </ClickableElement>
            )}

            <ClickableElement
              id="ownerName"
              isSelected={selectedElement === 'ownerName'}
              onClick={() => onSelectElement('ownerName')}
            >
              <p className="font-script text-primary text-2xl">{ownerName}</p>
            </ClickableElement>
          </div>

          {/* Botón CTA */}
          <ClickableElement
            id="ctaButton"
            isSelected={selectedElement === 'ctaButton'}
            onClick={() => onSelectElement('ctaButton')}
            className="inline-block"
          >
            <Button size="lg" asChild>
              <Link href={ctaLink}>{ctaText}</Link>
            </Button>
          </ClickableElement>
        </div>

        {/* Columna Derecha - Imagen */}
        <div className="flex items-center justify-center">
          {mainImage ? (
            <ClickableElement
              id="heroMainImage"
              isSelected={selectedElement === 'heroMainImage'}
              onClick={() => onSelectElement('heroMainImage')}
              className="max-w-md"
            >
              <OptimizedImage
                src={mainImage}
                alt="Hero"
                width={600}
                height={600}
                className="h-auto w-full rounded-lg"
              />
            </ClickableElement>
          ) : (
            <div className="border-muted-foreground/20 flex h-96 w-full max-w-md items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground text-sm">Sin imagen</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
