import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mock createPortal to render inline
vi.mock('react-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-dom')>()
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  }
})

import Modal from '@/components/ui/overlay/Modal'

beforeEach(() => {
  vi.clearAllMocks()
  document.body.style.overflow = ''
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderModal(overrides: Partial<React.ComponentProps<typeof Modal>> = {}) {
  const defaults: React.ComponentProps<typeof Modal> = {
    isOpen: true,
    onClose: vi.fn(),
    children: <p>Modal content</p>,
    ...overrides,
  }
  return { ...render(<Modal {...defaults} />), onClose: defaults.onClose }
}

// ============================================
// Modal Component
// ============================================

describe('Modal component', () => {
  it('renders when isOpen is true', () => {
    renderModal()
    expect(screen.getByText('Modal content')).toBeDefined()
  })

  it('does not render when isOpen is false', () => {
    renderModal({ isOpen: false })
    expect(screen.queryByText('Modal content')).toBeNull()
  })

  it('shows title when provided', () => {
    renderModal({ title: 'My Title' })
    expect(screen.getByText('My Title')).toBeDefined()
  })

  it('does not render title element when no title', () => {
    renderModal()
    expect(screen.queryById?.('modal-title')).toBeFalsy()
  })

  it('renders children', () => {
    renderModal({ children: <span>Child span</span> })
    expect(screen.getByText('Child span')).toBeDefined()
  })

  it('shows close button by default', () => {
    renderModal({ title: 'Test' })
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeDefined()
  })

  it('hides close button when showCloseButton=false', () => {
    renderModal({ showCloseButton: false })
    expect(screen.queryByRole('button', { name: /cerrar/i })).toBeNull()
  })

  it('calls onClose when close button clicked', () => {
    const { onClose } = renderModal({ title: 'Test' })
    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when clicking overlay backdrop', () => {
    const { onClose } = renderModal()
    const overlay = screen.getByRole('dialog')
    // Click on the overlay itself (not the inner card)
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not call onClose when clicking dialog content', () => {
    const { onClose } = renderModal()
    fireEvent.click(screen.getByText('Modal content'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose on Escape key', () => {
    const { onClose } = renderModal()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('has role="dialog"', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  it('has aria-modal="true"', () => {
    renderModal()
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true')
  })

  it('has aria-labelledby when title provided', () => {
    renderModal({ title: 'Accessible Modal' })
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-labelledby')).toBe('modal-title')
  })

  it('does not have aria-labelledby when no title', () => {
    renderModal()
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-labelledby')).toBeNull()
  })

  it('renders title with id "modal-title"', () => {
    renderModal({ title: 'ID Test' })
    const heading = screen.getByText('ID Test')
    expect(heading.id).toBe('modal-title')
  })

  it('applies sm size class', () => {
    const { container } = renderModal({ size: 'sm' })
    expect(container.innerHTML).toContain('max-w-md')
  })

  it('applies md size class by default', () => {
    const { container } = renderModal()
    expect(container.innerHTML).toContain('max-w-lg')
  })

  it('applies lg size class', () => {
    const { container } = renderModal({ size: 'lg' })
    expect(container.innerHTML).toContain('max-w-2xl')
  })

  it('applies xl size class', () => {
    const { container } = renderModal({ size: 'xl' })
    expect(container.innerHTML).toContain('max-w-4xl')
  })

  it('renders complex children', () => {
    renderModal({
      children: (
        <div>
          <h3>Heading</h3>
          <p>Paragraph</p>
          <button>Action</button>
        </div>
      ),
    })
    expect(screen.getByText('Heading')).toBeDefined()
    expect(screen.getByText('Paragraph')).toBeDefined()
    expect(screen.getByText('Action')).toBeDefined()
  })

  it('header visible when title and close button both present', () => {
    renderModal({ title: 'Both', showCloseButton: true })
    expect(screen.getByText('Both')).toBeDefined()
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeDefined()
  })

  it('no header when neither title nor close button', () => {
    const { container } = renderModal({ title: undefined, showCloseButton: false })
    // No border-b header section should render
    expect(container.querySelector('.border-b')).toBeNull()
  })

  it('backdrop has fixed positioning', () => {
    renderModal()
    const dialog = screen.getByRole('dialog')
    expect(dialog.className).toContain('fixed')
  })

  it('dialog content has max-height constraint', () => {
    const { container } = renderModal()
    expect(container.innerHTML).toContain('max-h-[90vh]')
  })
})
