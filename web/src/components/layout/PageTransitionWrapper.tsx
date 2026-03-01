'use client'

/**
 * PageTransitionWrapper
 *
 * Client Component wrapper que carga PageTransition con `ssr: false`.
 * Necesario porque `next/dynamic` con `ssr: false` no está permitido en
 * Server Components (Next.js 16). Se mueve la llamada a `dynamic()` aquí,
 * en un Client Component, para evitar que framer-motion 12 (AnimatePresence)
 * acceda a ReactCurrentDispatcher durante la pre-renderización estática del
 * Server Component layout — lo que causaba TypeError: Cannot read properties
 * of null (reading 'useContext').
 */

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'

const PageTransition = dynamic(() => import('./PageTransition'), { ssr: false })

export default function PageTransitionWrapper({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
