import * as Sentry from '@sentry/nextjs'

// Initialize Sentry for error tracking and performance monitoring
export function initSentry() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Performance monitoring
      tracesSampleRate: 0.1, // 10% of transactions
      
      // Release tracking
      release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
      
      // Environment
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
      
      // Error filtering
      beforeSend(event) {
        // Filter out development errors
        if (process.env.NODE_ENV === 'development') {
          return null
        }
        
        // Filter out known non-critical errors
        if (event.exception) {
          const error = event.exception.values?.[0]
          if (error?.type === 'ChunkLoadError' || 
              error?.value?.includes('Loading chunk') ||
              error?.value?.includes('Network request failed')) {
            return null
          }
        }
        
        return event
      },
      
      // Additional context
      initialScope: {
        tags: {
          component: 'web-frontend',
        },
      },
    })
  }
}

// Custom error boundary integration
export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.withScope((scope) => {
      if (context) {
        Object.keys(context).forEach(key => {
          scope.setContext(key, context[key])
        })
      }
      Sentry.captureException(error)
    })
  } else {
    console.error('Captured exception:', error, context)
  }
}

// Performance monitoring
export function startTransaction(name: string, op: string) {
  if (process.env.NODE_ENV === 'production') {
    return Sentry.startTransaction({ name, op })
  }
  return null
}

// User context
export function setUserContext(user: { id: number; email: string; role: string }) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.setUser({
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    })
  }
}

// Clear user context on logout
export function clearUserContext() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.setUser(null)
  }
}
