import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN

const sentryEnvironment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'

Sentry.init({
  dsn: SENTRY_DSN,

  enabled: !!SENTRY_DSN && sentryEnvironment !== 'development',

  tracesSampleRate:
    sentryEnvironment === 'production' ? 0.1 : sentryEnvironment === 'preview' ? 0.5 : 0,

  environment: sentryEnvironment,

  release:
    process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'unknown',
})
