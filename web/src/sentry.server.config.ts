import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN

const sentryEnvironment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'

const EMAIL_RE = /([A-Z0-9._%+-]+)@([A-Z0-9.-]+\.[A-Z]{2,})/gi

function scrubPii(s: string): string {
  return s.replace(EMAIL_RE, (_m, user: string, host: string) => `${user.slice(0, 2)}***@${host}`)
}

function scrubEvent(event: Sentry.ErrorEvent): Sentry.ErrorEvent {
  if (event.message) {
    event.message = scrubPii(event.message)
  }
  event.exception?.values?.forEach((ex) => {
    if (ex.value) ex.value = scrubPii(ex.value)
  })
  if (event.request?.data && typeof event.request.data === 'string') {
    event.request.data = scrubPii(event.request.data)
  }
  return event
}

Sentry.init({
  dsn: SENTRY_DSN,

  enabled: !!SENTRY_DSN && sentryEnvironment !== 'development',

  tracesSampleRate:
    sentryEnvironment === 'production' ? 0.1 : sentryEnvironment === 'preview' ? 0.5 : 0,

  environment: sentryEnvironment,

  release:
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_PUBLIC_APP_VERSION ||
    'unknown',

  beforeSend(event) {
    if (sentryEnvironment === 'development') {
      return null
    }
    return scrubEvent(event)
  },

  beforeSendTransaction(event) {
    return event
  },
})
