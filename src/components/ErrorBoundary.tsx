'use client'

import { Component, ReactNode } from 'react'
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary caught an error:', { error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-4 text-center">
              <span className="text-6xl">⚠️</span>
            </div>
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">Algo salió mal</h2>
            <p className="mb-6 text-center text-gray-600">
              Lo sentimos, ocurrió un error inesperado. Por favor, intenta recargar la página.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-opacity-90 flex-1 rounded-md px-4 py-2 text-white transition"
              >
                Recargar Página
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50"
              >
                Ir al Inicio
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 rounded bg-red-50 p-4">
                <summary className="cursor-pointer font-semibold text-red-800">
                  Detalles del Error (Dev Only)
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-red-700">
                  {this.state.error.message}
                  {'\n\n'}
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
