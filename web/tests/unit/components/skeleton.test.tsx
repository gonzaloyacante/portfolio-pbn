import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton, SkeletonCard, SkeletonGrid, SkeletonTestimonial } from '@/components/ui'

describe('Skeleton', () => {
  it('renders with default (rectangular) variant', () => {
    const { container } = render(<Skeleton />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('animate-pulse')
    expect(el.className).toContain('rounded-xl')
  })

  it('renders circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('rounded-full')
  })

  it('renders text variant', () => {
    const { container } = render(<Skeleton variant="text" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('h-4')
    expect(el.className).toContain('w-full')
  })

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-20 w-40" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('h-20')
    expect(el.className).toContain('w-40')
  })

  it('applies animation class', () => {
    const { container } = render(<Skeleton />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('animate-pulse')
  })
})

describe('SkeletonCard', () => {
  it('renders card-shaped skeleton', () => {
    const { container } = render(<SkeletonCard />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('animate-pulse')
    // Should contain multiple skeleton elements (image, title, description, category)
    expect(el.children.length).toBeGreaterThanOrEqual(3)
  })
})

describe('SkeletonGrid', () => {
  it('renders multiple skeleton cards', () => {
    const { container } = render(<SkeletonGrid count={3} />)
    const grid = container.firstChild as HTMLElement
    expect(grid.children).toHaveLength(3)
  })

  it('defaults to 6 cards', () => {
    const { container } = render(<SkeletonGrid />)
    const grid = container.firstChild as HTMLElement
    expect(grid.children).toHaveLength(6)
  })

  it('accepts count prop', () => {
    const { container } = render(<SkeletonGrid count={4} />)
    const grid = container.firstChild as HTMLElement
    expect(grid.children).toHaveLength(4)
  })
})

describe('SkeletonTestimonial', () => {
  it('renders testimonial skeleton shape', () => {
    const { container } = render(<SkeletonTestimonial />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('animate-pulse')
    // Should have avatar, name, text, and stars elements
    expect(el.children.length).toBeGreaterThanOrEqual(3)
  })
})
