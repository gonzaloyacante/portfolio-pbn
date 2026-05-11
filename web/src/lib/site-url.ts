/**
 * URL canónica del sitio público (JSON-LD, links absolutos cuando haga falta).
 * En prod/previsualización debe existir **NEXT_PUBLIC_BASE_URL** apuntando al dominio real;
 * el fallback solo cubre dev/tests y debe coincidir con `(public)/layout.tsx`.
 */
const FALLBACK_SITE_URL = 'https://dev.paolabolivar.es'

export function getPublicSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim()
  if (!raw) return FALLBACK_SITE_URL
  return raw.replace(/\/$/, '')
}
