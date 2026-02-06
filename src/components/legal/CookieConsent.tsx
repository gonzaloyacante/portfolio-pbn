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
        className="fixed right-0 bottom-0 left-0 z-50 p-4 sm:p-6"
      >
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur-md dark:bg-gray-900/95 dark:ring-white/10">
          <div className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              {/* Contenido */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍪</span>
                  <h3 className="font-primary text-xl font-bold text-gray-900 dark:text-white">
                    Valoramos tu privacidad
                  </h3>
                </div>

                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación
                  y analizar el tráfico del sitio.
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-primary hover:text-primary/80 ml-2 font-medium underline decoration-2 underline-offset-2 transition-colors"
                  >
                    {showDetails ? 'Ocultar detalles' : 'Configurar cookies'}
                  </button>
                </p>

                {/* Detalles expandibles */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-3 rounded-2xl bg-gray-50 p-4 text-sm dark:bg-gray-800/50">
                        <div className="flex items-start gap-3">
                          <div className="bg-success mt-0.5 h-2 w-2 rounded-full shadow-sm" />
                          <div>
                            <strong className="block font-semibold text-gray-900 dark:text-white">
                              Esenciales (Necesarias)
                            </strong>
                            <span className="text-gray-600 dark:text-gray-400">
                              Indispensables para el funcionamiento del sitio (preferencias de tema,
                              seguridad y carrito). No se pueden desactivar.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-info mt-0.5 h-2 w-2 rounded-full shadow-sm" />
                          <div>
                            <strong className="block font-semibold text-gray-900 dark:text-white">
                              Analíticas (Opcionales)
                            </strong>
                            <span className="text-gray-600 dark:text-gray-400">
                              Nos ayudan a entender cómo usas la web para mejorarla (Google
                              Analytics). Los datos son anónimos.
                            </span>
                          </div>
                        </div>

                        <p className="mt-4 border-t border-gray-200 pt-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-500">
                          Para más información, consulta nuestra{' '}
                          <a
                            href="/privacidad"
                            className="text-primary font-medium hover:underline"
                          >
                            Política de Privacidad
                          </a>
                          .
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-3 sm:flex-row md:min-w-[300px] md:flex-col lg:flex-row">
                <button
                  onClick={handleAcceptNecessary}
                  className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-transparent px-6 py-3 text-sm font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                >
                  <span className="relative z-10">Solo necesarias</span>
                </button>

                <button
                  onClick={handleAcceptAll}
                  className="group bg-primary shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/40 text-primary-foreground relative overflow-hidden rounded-xl px-6 py-3 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10">Aceptar todas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
