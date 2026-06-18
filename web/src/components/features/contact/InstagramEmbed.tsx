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

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLIFrameElement && !node.title) {
            node.title = 'Publicación de Instagram'
          }
        }
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="w-full max-w-sm">
      <blockquote
        className="instagram-media public-contact-instagram-embed"
        data-instgrm-captioned
        data-instgrm-permalink={normalized}
        data-instgrm-version="14"
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
