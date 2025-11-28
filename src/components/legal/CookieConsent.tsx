'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CookieConsentProps {
  onAcceptAll?: () => void
  onAcceptNecessary?: () => void
}

/**
 * Banner de Consentimiento de Cookies (GDPR Compliant)
 *
 * Bloquea scripts de terceros (Google Analytics) hasta que el usuario acepte.
 * Guarda preferencias en localStorage.
 *
 * @example
 * <CookieConsent
 *   onAcceptAll={() => initializeAnalytics()}
 *   onAcceptNecessary={() => console.log('Solo cookies esenciales')}
 * />
 */
export default function CookieConsent({ onAcceptAll, onAcceptNecessary }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Verificar si el usuario ya dio su consentimiento
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Mostrar banner después de 1 segundo (mejor UX)
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'all')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setShowBanner(false)
    onAcceptAll?.()
  }

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setShowBanner(false)
    onAcceptNecessary?.()
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed right-0 bottom-0 left-0 z-50 bg-white p-4 shadow-2xl sm:p-6 dark:bg-gray-900"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Texto */}
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                🍪 Usamos cookies
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación y
                analizar el tráfico del sitio. Puedes aceptar todas las cookies o solo las
                esenciales.{' '}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-wine dark:text-pink-hot underline hover:no-underline"
                >
                  {showDetails ? 'Ver menos' : 'Más información'}
                </button>
              </p>

              {/* Detalles expandibles */}
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <div>
                    <strong className="text-wine dark:text-pink-hot">Cookies esenciales:</strong>{' '}
                    Necesarias para el funcionamiento del sitio (autenticación, preferencias de
                    tema).
                  </div>
                  <div>
                    <strong className="text-wine dark:text-pink-hot">Cookies analíticas:</strong>{' '}
                    Google Analytics para entender cómo los usuarios interactúan con el sitio (datos
                    anónimos).
                  </div>
                  <p className="mt-2">
                    Para más detalles, consulta nuestra{' '}
                    <a
                      href="/privacidad"
                      className="text-wine dark:text-pink-hot underline hover:no-underline"
                    >
                      Política de Privacidad
                    </a>
                    .
                  </p>
                </motion.div>
              )}
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleAcceptNecessary}
                className="border-wine text-wine hover:bg-wine/5 dark:border-pink-hot dark:text-pink-hot dark:hover:bg-pink-hot/10 rounded-2xl border-2 px-6 py-2.5 text-sm font-semibold transition-colors"
              >
                Solo Necesarias
              </button>
              <button
                onClick={handleAcceptAll}
                className="bg-wine hover:bg-wine/90 dark:bg-pink-hot dark:text-purple-dark dark:hover:bg-pink-hot/90 rounded-2xl px-6 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Aceptar Todas
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
