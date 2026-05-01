import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { CSSProperties } from 'react'
import { OptimizedImage } from '@/components/ui/media/OptimizedImage'

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    style,
    className,
    onError,
    onLoad,
    ...rest
  }: {
    src: string
    alt: string
    style?: CSSProperties
    className?: string
    onError?: () => void
    onLoad?: () => void
    fill?: boolean
    sizes?: string
    priority?: boolean
    width?: number
    height?: number
    quality?: number
    'aria-hidden'?: boolean
  }) => (
    <img
      data-testid="next-img"
      src={typeof src === 'string' ? src : ''}
      alt={alt}
      className={className}
      style={style}
      onError={onError}
      onLoad={onLoad}
      {...rest}
    />
  ),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('OptimizedImage', () => {
  it('fixed layout applies default object-fit cover on main image', () => {
    render(
      <OptimizedImage
        src="https://example.com/p.jpg"
        alt="Photo"
        width={400}
        height={300}
        priority
        placeholder="empty"
      />
    )

    const imgs = screen.getAllByTestId('next-img')
    const main = imgs.find((el) => (el as HTMLImageElement).alt === 'Photo')!
    expect(main).toHaveStyle({ objectFit: 'cover' })
  })

  it('fill + contain passes contain on loaded layer images', () => {
    render(
      <OptimizedImage
        src="https://example.com/p.jpg"
        alt="Illustration"
        fill
        sizes="100px"
        priority
        placeholder="empty"
        objectFit="contain"
      />
    )

    const imgs = screen.getAllByTestId('next-img')
    expect(imgs.length).toBeGreaterThanOrEqual(1)
    imgs.forEach((node) => {
      expect(node).toHaveStyle({ objectFit: 'contain' })
    })
  })

  it('error branch exposes alert and screen reader text', () => {
    render(
      <OptimizedImage
        src="https://example.com/broken.jpg"
        alt="X"
        width={10}
        height={10}
        priority
        placeholder="empty"
      />
    )

    const imgs = screen.getAllByTestId('next-img')
    fireEvent.error(imgs[0]!)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('No se pudo cargar la imagen.')).toBeInTheDocument()
    expect(screen.getByText('No se pudo cargar la imagen.')).toHaveClass('sr-only')
  })
})
