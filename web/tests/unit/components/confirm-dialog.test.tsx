import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(
      (
        {
          children,
          initial: _initial,
          animate: _animate,
          exit: _exit,
          transition: _transition,
          ...props
        }: React.PropsWithChildren<Record<string, unknown>>,
        ref: React.Ref<HTMLDivElement>
      ) => (
        <div ref={ref} {...props}>
          {children}
        </div>
      )
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

vi.mock('lucide-react', () => ({
  AlertTriangle: (props: React.SVGAttributes<SVGElement>) => (
    <svg data-testid="icon-alert" {...props} />
  ),
}))

vi.mock('@/components/ui', () => ({
  Button: React.forwardRef(
    (
      {
        children,
        onClick,
        variant,
        className,
        ...props
      }: React.PropsWithChildren<{ onClick?: () => void; variant?: string; className?: string }>,
      ref: React.Ref<HTMLButtonElement>
    ) => (
      <button ref={ref} onClick={onClick} data-variant={variant} className={className} {...props}>
        {children}
      </button>
    )
  ),
}))

import { ConfirmDialog, useConfirmDialog } from '@/components/ui/overlay/ConfirmDialog'

beforeEach(() => {
  vi.clearAllMocks()
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderDialog(overrides: Partial<React.ComponentProps<typeof ConfirmDialog>> = {}) {
  const defaults: React.ComponentProps<typeof ConfirmDialog> = {
    open: true,
    title: 'Confirmar acción',
    message: '¿Estás seguro de continuar?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  }
  return {
    ...render(<ConfirmDialog {...defaults} />),
    onConfirm: defaults.onConfirm,
    onCancel: defaults.onCancel,
  }
}

// ============================================
// ConfirmDialog Component
// ============================================

describe('ConfirmDialog component', () => {
  it('renders when open is true', () => {
    renderDialog()
    expect(screen.getByText('Confirmar acción')).toBeDefined()
  })

  it('does not render when open is false', () => {
    renderDialog({ open: false })
    expect(screen.queryByText('Confirmar acción')).toBeNull()
  })

  it('shows title', () => {
    renderDialog({ title: '¿Eliminar?' })
    expect(screen.getByText('¿Eliminar?')).toBeDefined()
  })

  it('shows message', () => {
    renderDialog({ message: 'Esta acción es irreversible' })
    expect(screen.getByText('Esta acción es irreversible')).toBeDefined()
  })

  it('confirm button triggers onConfirm', () => {
    const { onConfirm } = renderDialog()
    fireEvent.click(screen.getByText('Confirmar'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('cancel button triggers onCancel', () => {
    const { onCancel } = renderDialog()
    fireEvent.click(screen.getByText('Cancelar'))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('shows custom confirmText', () => {
    renderDialog({ confirmText: 'Eliminar' })
    expect(screen.getByText('Eliminar')).toBeDefined()
  })

  it('shows custom cancelText', () => {
    renderDialog({ cancelText: 'No, volver' })
    expect(screen.getByText('No, volver')).toBeDefined()
  })

  it('shows alert icon when variant is danger', () => {
    renderDialog({ variant: 'danger' })
    expect(screen.getByTestId('icon-alert')).toBeDefined()
  })

  it('does not show alert icon when variant is default', () => {
    renderDialog({ variant: 'default' })
    expect(screen.queryByTestId('icon-alert')).toBeNull()
  })

  it('uses destructive variant button when variant=danger', () => {
    renderDialog({ variant: 'danger', confirmText: 'Delete' })
    const btn = screen.getByText('Delete')
    expect(btn.getAttribute('data-variant')).toBe('destructive')
  })

  it('uses primary variant button when variant=default', () => {
    renderDialog({ variant: 'default', confirmText: 'OK' })
    const btn = screen.getByText('OK')
    expect(btn.getAttribute('data-variant')).toBe('primary')
  })

  it('has role="dialog"', () => {
    renderDialog()
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  it('has aria-modal="true"', () => {
    renderDialog()
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true')
  })

  it('has aria-labelledby', () => {
    renderDialog()
    expect(screen.getByRole('dialog').getAttribute('aria-labelledby')).toBe('confirm-dialog-title')
  })

  it('has aria-describedby', () => {
    renderDialog()
    expect(screen.getByRole('dialog').getAttribute('aria-describedby')).toBe(
      'confirm-dialog-description'
    )
  })

  it('calls onCancel on Escape key', () => {
    const { onCancel } = renderDialog()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('backdrop click triggers onCancel', () => {
    const { onCancel } = renderDialog()
    const backdrop = screen.getByRole('dialog').querySelector('.absolute')
    if (backdrop) fireEvent.click(backdrop)
    expect(onCancel).toHaveBeenCalled()
  })

  it('default confirmText is "Confirmar"', () => {
    renderDialog()
    expect(screen.getByText('Confirmar')).toBeDefined()
  })

  it('default cancelText is "Cancelar"', () => {
    renderDialog()
    expect(screen.getByText('Cancelar')).toBeDefined()
  })
})

// ============================================
// useConfirmDialog hook
// ============================================

describe('useConfirmDialog hook', () => {
  function TestHarness() {
    const { confirm, Dialog } = useConfirmDialog()
    const [result, setResult] = React.useState<boolean | null>(null)
    return (
      <div>
        <button
          onClick={async () => {
            const r = await confirm({ title: 'Hook test', message: 'Proceed?', variant: 'danger' })
            setResult(r)
          }}
        >
          Open
        </button>
        {result !== null && <span data-testid="result">{String(result)}</span>}
        <Dialog />
      </div>
    )
  }

  it('opens dialog on confirm()', () => {
    render(<TestHarness />)
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Hook test')).toBeDefined()
  })
})
