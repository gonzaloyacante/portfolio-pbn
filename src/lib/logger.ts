type LogLevel = 'info' | 'warn' | 'error' | 'debug'

const getTimestamp = () => new Date().toISOString()

const formatMessage = (level: LogLevel, message: string, data?: unknown) => {
  const timestamp = getTimestamp()
  const dataString = data ? `\nData: ${JSON.stringify(data, null, 2)}` : ''
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}${dataString}`
}

export const logger = {
  info: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatMessage('info', message, data))
    }
  },
  warn: (message: string, data?: unknown) => {
    console.warn(formatMessage('warn', message, data))
  },
  error: (message: string, error?: unknown) => {
    console.error(formatMessage('error', message, error))
  },
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage('debug', message, data))
    }
  },
}
