import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN

// VERCEL_ENV: 'production' | 'preview' | 'development' (seteado automáticamente por Vercel)
// En local dev no existe VERCEL_ENV, por eso el fallback a NODE_ENV.
const sentryEnvironment =
  process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || 'development'

Sentry.init({
  dsn: SENTRY_DSN,

  // Solo enviar errores cuando hay un DSN configurado y estamos en producción o preview.
  // Evita contaminar Sentry con errores de desarrollo local.
  enabled: !!SENTRY_DSN && sentryEnvironment !== 'development',

  // Performance Monitoring: 10% en producción, 100% en preview, desactivado en dev
  tracesSampleRate:
    sentryEnvironment === 'production' ? 0.1 : sentryEnvironment === 'preview' ? 0.5 : 0,

  // Session Replay
  replaysSessionSampleRate: sentryEnvironment === 'production' ? 0.1 : 0, // Solo en producción
  replaysOnErrorSampleRate: sentryEnvironment !== 'development' ? 1.0 : 0,

  // Entorno (production | preview | development)
  environment: sentryEnvironment,

  // Release tracking: usa el SHA del commit de Vercel o un fallback
  release:
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_PUBLIC_APP_VERSION ||
    'unknown',

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Ignorar errores de browser extensions y errores no accionables
  ignoreErrors: [
    'top.GLOBALS',
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'NetworkError',
    'Non-Error promise rejection captured',
    // Errores comunes de crawlers/bots
    /^Script error\.?$/,
    /^Javascript error: Script error/,
  ],

  beforeSend(event) {
    // No enviar errores de localhost (desarrollo local)
    if (event.request?.url?.includes('localhost')) {
      return null
    }
    return event
  },
})
