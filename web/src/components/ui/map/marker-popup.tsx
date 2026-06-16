'use client'

import MapLibreGL, { type PopupOptions } from 'maplibre-gl'
import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

import { useMarkerContext } from './marker'
import { PopupCloseButton } from './popup-close-button'

type MarkerPopupProps = {
  /** Popup content */
  children: ReactNode
  /** Additional CSS classes for the popup container */
  className?: string
  /** Show a close button in the popup (default: false) */
  closeButton?: boolean
} & Omit<PopupOptions, 'className' | 'closeButton'>

export function MarkerPopup({
  children,
  className,
  closeButton = false,
  ...popupOptions
}: MarkerPopupProps) {
  const { marker, map } = useMarkerContext()
  const container = useMemo(() => document.createElement('div'), [])
  const prevPopupOptions = useRef(popupOptions)

  const popup = useMemo(() => {
    const popupInstance = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeButton: false,
    })
      .setMaxWidth('none')
      .setDOMContent(container)

    return popupInstance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!map) return

    popup.setDOMContent(container)
    marker.setPopup(popup)

    return () => {
      marker.setPopup(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  if (popup.isOpen()) {
    const prev = prevPopupOptions.current

    if (prev.offset !== popupOptions.offset) {
      popup.setOffset(popupOptions.offset ?? 16)
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      popup.setMaxWidth(popupOptions.maxWidth ?? 'none')
    }

    prevPopupOptions.current = popupOptions
  }

  const handleClose = () => popup.remove()

  return createPortal(
    <div
      className={cn(
        'bg-popover text-popover-foreground relative max-w-62 rounded-md border p-3 shadow-md',
        'animate-in fade-in-0 zoom-in-95 duration-200 ease-out',
        className
      )}
    >
      {closeButton && <PopupCloseButton onClick={handleClose} />}
      {children}
    </div>,
    container
  )
}

type MarkerTooltipProps = {
  /** Tooltip content */
  children: ReactNode
  /** Additional CSS classes for the tooltip container */
  className?: string
} & Omit<PopupOptions, 'className' | 'closeButton' | 'closeOnClick'>

export function MarkerTooltip({ children, className, ...popupOptions }: MarkerTooltipProps) {
  const { marker, map } = useMarkerContext()
  const container = useMemo(() => document.createElement('div'), [])
  const prevTooltipOptions = useRef(popupOptions)

  const tooltip = useMemo(() => {
    const tooltipInstance = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeOnClick: true,
      closeButton: false,
    }).setMaxWidth('none')

    return tooltipInstance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!map) return

    tooltip.setDOMContent(container)

    const handleMouseEnter = () => {
      tooltip.setLngLat(marker.getLngLat()).addTo(map)
    }
    const handleMouseLeave = () => tooltip.remove()

    marker.getElement()?.addEventListener('mouseenter', handleMouseEnter)
    marker.getElement()?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      marker.getElement()?.removeEventListener('mouseenter', handleMouseEnter)
      marker.getElement()?.removeEventListener('mouseleave', handleMouseLeave)
      tooltip.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  if (tooltip.isOpen()) {
    const prev = prevTooltipOptions.current

    if (prev.offset !== popupOptions.offset) {
      tooltip.setOffset(popupOptions.offset ?? 16)
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      tooltip.setMaxWidth(popupOptions.maxWidth ?? 'none')
    }

    prevTooltipOptions.current = popupOptions
  }

  return createPortal(
    <div
      className={cn(
        'bg-foreground text-background pointer-events-none rounded-md px-2 py-1 text-xs text-balance shadow-md',
        'animate-in fade-in-0 zoom-in-95 duration-200 ease-out',
        className
      )}
    >
      {children}
    </div>,
    container
  )
}

type MarkerLabelProps = {
  /** Label text content */
  children: ReactNode
  /** Additional CSS classes for the label */
  className?: string
  /** Position of the label relative to the marker (default: "top") */
  position?: 'top' | 'bottom'
}

export function MarkerLabel({ children, className, position = 'top' }: MarkerLabelProps) {
  const positionClasses = {
    top: 'bottom-full mb-1',
    bottom: 'top-full mt-1',
  }

  return (
    <div
      className={cn(
        'absolute left-1/2 -translate-x-1/2 whitespace-nowrap',
        'text-foreground text-[10px] font-medium',
        positionClasses[position],
        className
      )}
    >
      {children}
    </div>
  )
}
