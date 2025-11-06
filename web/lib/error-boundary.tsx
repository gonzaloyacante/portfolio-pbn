'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props
      
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} reset={this.handleReset} />
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Algo salió mal</h2>
            <p className="text-muted-foreground mb-6">
              Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </p>
            <div className="space-y-2">
              <Button onClick={this.handleReset} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Intentar de nuevo
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Recargar página
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Detalles del error (desarrollo)
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
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

// Hook para manejo de errores async
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: string) => {
    console.error('Async error:', error, errorInfo)
    
    // En desarrollo, mostrar error en consola
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Details')
      console.error('Error:', error)
      console.error('Info:', errorInfo)
      console.error('Stack:', error.stack)
      console.groupEnd()
    }
    
    // Aquí se podría integrar con Sentry u otro servicio de monitoreo
    // Sentry.captureException(error, { extra: { errorInfo } })
  }, [])
}

// Componente de error personalizado para páginas
export function PageErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <AlertTriangle className="h-20 w-20 text-destructive mx-auto mb-6" />
      <h1 className="text-4xl font-bold mb-4">Error en la página</h1>
      <p className="text-xl text-muted-foreground mb-8">
        No se pudo cargar el contenido solicitado.
      </p>
      <div className="space-x-4">
        <Button onClick={reset} size="lg">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
        <Button variant="outline" onClick={() => window.history.back()} size="lg">
          Volver atrás
        </Button>
      </div>
    </div>
  )
}
