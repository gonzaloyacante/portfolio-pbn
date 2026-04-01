'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import YARLightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import type { SlideImage } from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import { getVariantUrl } from '@/lib/cloudinary-helper'

// ---------- Types ----------

export interface LightboxImage {
  id: string
  url: string
  alt: string
  title?: string
  width?: number | null
  height?: number | null
}

interface LightboxProps {
  images: LightboxImage[]
  selectedIndex: number | null
  onClose: () => void
  onIndexChange?: (index: number) => void
}

// ---------- Cloudinary detection ----------

const CLOUDINARY_REGEX = /^https?:\/\/res\.cloudinary\.com\//

// ---------- Component ----------

export function Lightbox({ images, selectedIndex, onClose, onIndexChange }: LightboxProps) {
  // Map: original URL → upgraded full URL (populated as full-quality images finish loading)
  const [upgradedUrls, setUpgradedUrls] = useState<Record<string, string>>({})
  const upgradingSet = useRef(new Set<string>())

  /**
   * Preload a Cloudinary image at full quality.
   * When ready, swap the slide src from thumbnail → full (seamlessly, already cached).
   */
  const upgradeImage = useCallback((url: string) => {
    if (!url || !CLOUDINARY_REGEX.test(url)) return
    if (upgradingSet.current.has(url)) return
    upgradingSet.current.add(url)

    const fullUrl = getVariantUrl(url, 'full')
    const img = new window.Image()
    img.src = fullUrl
    img.onload = () => setUpgradedUrls((prev) => ({ ...prev, [url]: fullUrl }))
  }, [])

  /**
   * Called by YARL when a slide becomes visible.
   * Upgrades current slide to full quality; also starts preloading adjacent slides.
   */
  const handleView = useCallback(
    ({ index }: { index: number }) => {
      onIndexChange?.(index)
      upgradeImage(images[index]?.url)
      if (index > 0) upgradeImage(images[index - 1].url)
      if (index < images.length - 1) upgradeImage(images[index + 1].url)
    },
    [images, onIndexChange, upgradeImage]
  )

  /**
   * Slides array for YARL.
   * – Initial src: Cloudinary `thumbnail` variant (400 px, loads instantly)
   * – Upgraded src: Cloudinary `full` variant (3 840 px) once preloaded in the background
   * – Orientation is preserved: width/height let YARL compute the correct aspect ratio
   */
  const slides = useMemo<SlideImage[]>(
    () =>
      images.map((img) => {
        const isCloudinary = CLOUDINARY_REGEX.test(img.url)
        return {
          src:
            upgradedUrls[img.url] ?? (isCloudinary ? getVariantUrl(img.url, 'thumbnail') : img.url),
          alt: img.alt,
          title: img.title,
          width: img.width ?? undefined,
          height: img.height ?? undefined,
        }
      }),
    [images, upgradedUrls]
  )

  return (
    <YARLightbox
      open={selectedIndex !== null}
      close={onClose}
      index={selectedIndex ?? 0}
      slides={slides}
      on={{ view: handleView }}
      plugins={[Zoom, Captions]}
      zoom={{
        maxZoomPixelRatio: 5,
        zoomInMultiplier: 2,
        doubleClickMaxStops: 2,
        wheelZoomDistanceFactor: 100,
        scrollToZoom: true,
      }}
      captions={{ showToggle: false, descriptionMaxLines: 2 }}
      carousel={{
        imageFit: 'contain',
        padding: '16px',
        preload: 1,
      }}
      controller={{ closeOnBackdropClick: true }}
      styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' } }}
      animation={{ fade: 200, swipe: 300 }}
    />
  )
}
