'use client'

import Script from 'next/script'
import { useEffect } from 'react'

interface InstagramEmbedProps {
  postUrl: string
}

export default function InstagramEmbed({ postUrl }: InstagramEmbedProps) {
  const normalized = postUrl.endsWith('/') ? postUrl : `${postUrl}/`

  useEffect(() => {
    const w = window as Window & { instgrm?: { Embeds: { process: () => void } } }
    if (w.instgrm) {
      w.instgrm.Embeds.process()
    }
  }, [postUrl])

  return (
    <div className="w-full max-w-sm">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={normalized}
        data-instgrm-version="14"
        style={{ background: '#FFF', border: 0, margin: 0, padding: 0, width: '100%', maxWidth: '100%' }}
      >
        <a href={normalized} target="_blank" rel="noopener noreferrer">
          Ver publicación en Instagram
        </a>
      </blockquote>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          const w = window as Window & { instgrm?: { Embeds: { process: () => void } } }
          w.instgrm?.Embeds.process()
        }}
      />
    </div>
  )
}
