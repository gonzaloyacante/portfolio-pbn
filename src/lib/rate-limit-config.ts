/**
 * Rate Limiting Configuration
 * Centralized configuration for all rate limiters in the application
 */

export interface RateLimitConfig {
  /** Unique identifier for this limiter */
  id: string
  /** Maximum number of requests allowed */
  limit: number
  /** Time window in milliseconds */
  window: number
  /** Error message to show when limit exceeded */
  errorMessage: string
}

/**
 * Pre-configured rate limiters
 */
export const RATE_LIMITS = {
  /** Authentication attempts (login, password reset) */
  AUTH: {
    id: 'auth',
    limit: 5,
    window: 15 * 60 * 1000, // 15 minutes
    errorMessage: 'Demasiados intentos de inicio de sesión. Por favor, intenta de nuevo más tarde.',
  } as RateLimitConfig,

  /** Contact form submissions */
  CONTACT: {
    id: 'contact',
    limit: 3,
    window: 10 * 60 * 1000, // 10 minutes
    errorMessage:
      'Has enviado demasiados mensajes recientemente. Por favor, espera unos minutos antes de intentar de nuevo.',
  } as RateLimitConfig,

  /** API general (for public endpoints) */
  API: {
    id: 'api',
    limit: 100,
    window: 60 * 1000, // 1 minute
    errorMessage: 'Demasiadas solicitudes. Por favor, intenta de nuevo más tarde.',
  } as RateLimitConfig,

  /** Password reset requests */
  PASSWORD_RESET: {
    id: 'password-reset',
    limit: 3,
    window: 60 * 60 * 1000, // 1 hour
    errorMessage:
      'Has solicitado demasiados restablecimientos de contraseña. Por favor, intenta de nuevo más tarde.',
  } as RateLimitConfig,
} as const
