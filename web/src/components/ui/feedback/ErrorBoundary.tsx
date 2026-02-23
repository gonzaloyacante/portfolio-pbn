'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import Button from '../forms/Button'
import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Error caught by boundary', { error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-100 items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <svg
                className="h-8 w-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-foreground mb-2 text-xl font-semibold">Algo salió mal</h2>
            <p className="text-muted-foreground mb-6">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </p>
            <div className="flex flex-col items-center space-y-3">
              <Button onClick={this.handleReset} variant="secondary" className="w-full">
                Intentar de nuevo
              </Button>
              <Button onClick={() => window.location.reload()} className="w-full">
                Recargar página
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 w-full text-left">
                <summary className="text-muted-foreground cursor-pointer text-sm">
                  Detalles del error (desarrollo)
                </summary>
                <pre className="bg-muted mt-2 max-h-40 overflow-auto rounded p-3 text-xs">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
