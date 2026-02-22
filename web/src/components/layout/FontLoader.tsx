'use client'

// Imports removed (unused)

interface FontLoaderProps {
  fonts: {
    headingUrl?: string | null
    bodyUrl?: string | null
    scriptUrl?: string | null
    brandUrl?: string | null
    portfolioUrl?: string | null
    signatureUrl?: string | null
  }
}

/**
 * Dynamically loads Google Fonts based on Admin settings
 * Uses standard <link> injection
 */
export default function FontLoader({ fonts }: FontLoaderProps) {
  // Deduplicate URLs to avoid loading same sheet twice
  const uniqueUrls = Array.from(new Set(Object.values(fonts).filter(Boolean))) as string[]

  if (uniqueUrls.length === 0) return null

  return (
    <>
      {uniqueUrls.map((url) => (
        <link key={url} href={url} rel="stylesheet" />
      ))}
    </>
  )
}
