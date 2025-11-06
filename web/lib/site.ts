import { ENV } from '@/lib/env'

export function getSiteUrl() {
  return ENV.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export function getApiUrl() {
  return ENV.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
}
