'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePageTranslation } from '@/hooks/useTranslation'

/**
 * LanguageToggle — Botón ES/EN en el Navbar público.
 *
 * - Chrome 138+: usa la Translator API on-device (instantáneo, gratuito, offline)
 * - Otros navegadores: usa MyMemory API (gratuita, requiere red)
 * - Persiste preferencia en localStorage
 * - Solo visible en el portfolio público (no en el admin)
 */
export default function LanguageToggle() {
  const { currentLang, isTranslating, toggleLanguage } = usePageTranslation()

  return (
    <button
      onClick={toggleLanguage}
      disabled={isTranslating}
      aria-label={currentLang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      title={currentLang === 'es' ? 'Translate page to English' : 'Traducir página al Español'}
      className="font-heading relative flex h-9 w-16 items-center justify-center overflow-hidden rounded-none border border-(--border) bg-(--background) text-xs font-semibold tracking-widest text-(--foreground) uppercase transition-all duration-300 hover:border-(--primary) hover:text-(--primary) focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:outline-none disabled:cursor-wait disabled:opacity-50"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isTranslating ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1"
          >
            <svg
              className="h-3 w-3 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                strokeLinecap="round"
              />
            </svg>
          </motion.span>
        ) : (
          <motion.span
            key={currentLang}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {currentLang === 'es' ? 'EN' : 'ES'}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
