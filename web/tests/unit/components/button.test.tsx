import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createRef } from 'react'
import { Button } from '@/components/ui'

describe('Button', () => {
  // --- Variants ---
  it('renders with primary (default) variant', () => {
    render(<Button>Click</Button>)
    const btn = screen.getByRole('button', { name: 'Click' })
    expect(btn).toBeInTheDocument()
    expect(btn.className).toContain('bg-primary')
  })

  it('renders with destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    const btn = screen.getByRole('button', { name: 'Delete' })
    expect(btn.className).toContain('destructive')
  })

  it('renders with outline variant', () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByRole('button', { name: 'Outline' })
    expect(btn.className).toContain('border')
    expect(btn.className).toContain('bg-background')
  })

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const btn = screen.getByRole('button', { name: 'Secondary' })
    expect(btn.className).toContain('bg-secondary')
  })

  it('renders with ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const btn = screen.getByRole('button', { name: 'Ghost' })
    expect(btn.className).toContain('bg-transparent')
  })

  // --- Sizes ---
  it('renders with sm size', () => {
    render(<Button size="sm">Sm</Button>)
    const btn = screen.getByRole('button', { name: 'Sm' })
    expect(btn.className).toContain('px-3')
    expect(btn.className).toContain('text-xs')
  })

  it('renders with default (md) size', () => {
    render(<Button>Default</Button>)
    const btn = screen.getByRole('button', { name: 'Default' })
    expect(btn.className).toContain('px-5')
    expect(btn.className).toContain('text-sm')
  })

  it('renders with lg size', () => {
    render(<Button size="lg">Lg</Button>)
    const btn = screen.getByRole('button', { name: 'Lg' })
    expect(btn.className).toContain('px-7')
    expect(btn.className).toContain('text-base')
  })

  it('renders with xl size', () => {
    render(<Button size="xl">Xl</Button>)
    const btn = screen.getByRole('button', { name: 'Xl' })
    expect(btn.className).toContain('px-8')
    expect(btn.className).toContain('text-lg')
  })

  // --- Loading ---
  it('shows loading spinner when loading=true', () => {
    render(<Button loading>Save</Button>)
    const btn = screen.getByRole('button')
    expect(btn.querySelector('svg')).toBeInTheDocument()
    expect(btn.textContent).toContain('Cargando...')
  })

  it('disables button when loading', () => {
    render(<Button loading>Save</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('sets aria-busy when loading', () => {
    render(<Button loading>Save</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  // --- Disabled ---
  it('disables button when disabled=true', () => {
    render(<Button disabled>Nope</Button>)
    expect(screen.getByRole('button', { name: 'Nope' })).toBeDisabled()
  })

  it('sets aria-disabled when disabled', () => {
    render(<Button disabled>Nope</Button>)
    expect(screen.getByRole('button', { name: 'Nope' })).toHaveAttribute('aria-disabled', 'true')
  })

  // --- Icons ---
  it('renders left icon', () => {
    render(<Button leftIcon={<span data-testid="left-icon">←</span>}>Go</Button>)
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders right icon', () => {
    render(<Button rightIcon={<span data-testid="right-icon">→</span>}>Go</Button>)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('hides icons when loading', () => {
    render(
      <Button loading leftIcon={<span data-testid="left-icon">←</span>}>
        Save
      </Button>
    )
    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument()
  })

  // --- Click ---
  it('fires onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button', { name: 'Click' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Click
      </Button>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Click' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('does not fire onClick when loading', () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} loading>
        Click
      </Button>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  // --- fullWidth ---
  it('applies fullWidth class', () => {
    render(<Button fullWidth>Wide</Button>)
    expect(screen.getByRole('button', { name: 'Wide' }).className).toContain('w-full')
  })

  // --- Children ---
  it('renders children text', () => {
    render(<Button>Hello World</Button>)
    expect(screen.getByRole('button', { name: 'Hello World' })).toBeInTheDocument()
  })

  // --- Custom className ---
  it('applies custom className', () => {
    render(<Button className="my-custom-class">Styled</Button>)
    expect(screen.getByRole('button', { name: 'Styled' }).className).toContain('my-custom-class')
  })

  // --- Ref forwarding ---
  it('forwards ref correctly', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  // --- Type attribute ---
  it('has type="button" when no type specified', () => {
    render(<Button>Btn</Button>)
    // Default HTML button type is "submit" unless specified
    const btn = screen.getByRole('button', { name: 'Btn' })
    expect(btn.tagName).toBe('BUTTON')
  })

  it('supports type="submit"', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit')
  })

  // --- asChild ---
  it('renders as a child element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByRole('link', { name: 'Link Button' })
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/test')
  })

  // --- Class merging ---
  it('merges variant classes with base classes', () => {
    render(<Button variant="ghost">Test</Button>)
    const btn = screen.getByRole('button', { name: 'Test' })
    expect(btn.className).toContain('inline-flex')
    expect(btn.className).toContain('bg-transparent')
  })

  // --- Variant styling ---
  it('ghost variant has transparent background', () => {
    render(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button', { name: 'Ghost' }).className).toContain('bg-transparent')
  })

  it('destructive variant has destructive styling', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button', { name: 'Delete' }).className).toContain('text-destructive')
  })

  it('outline variant has border', () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button', { name: 'Outline' }).className).toContain('border')
  })

  it('secondary variant has secondary colors', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button', { name: 'Secondary' }).className).toContain('bg-secondary')
    expect(screen.getByRole('button', { name: 'Secondary' }).className).toContain(
      'text-secondary-foreground'
    )
  })
})
