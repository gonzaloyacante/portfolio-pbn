import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorState } from '@/components/ui'

describe('ErrorState', () => {
  it('renders default error title', () => {
    render(<ErrorState />)
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument()
  })

  it('renders custom title', () => {
    render(<ErrorState title="Server Error" />)
    expect(screen.getByText('Server Error')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<ErrorState message="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('renders retry button when onRetry provided', () => {
    render(<ErrorState onRetry={vi.fn()} />)
    expect(screen.getByText('Reintentar')).toBeInTheDocument()
  })

  it('calls onRetry when retry clicked', () => {
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)
    fireEvent.click(screen.getByText('Reintentar'))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('hides retry button when no onRetry', () => {
    render(<ErrorState />)
    expect(screen.queryByText('Reintentar')).not.toBeInTheDocument()
  })

  it('shows default message when none provided', () => {
    render(<ErrorState />)
    expect(
      screen.getByText('Hubo un error al cargar los datos. Por favor, inténtalo de nuevo.')
    ).toBeInTheDocument()
  })

  it('renders error icon', () => {
    render(<ErrorState />)
    expect(screen.getByText('⚠️')).toBeInTheDocument()
  })
})
