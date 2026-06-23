'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Button } from '@/components/ui'
import { ROUTES } from '@/config/routes'

interface CookieConsentProps {
  onAcceptAll?: () => void
  onAcceptNecessary?: () => void
}

/**
 * Banner de Consentimiento de Cookies (GDPR Compliant)
 *
 * Guarda preferencias en localStorage:
 * - `cookie-consent`: 'all' | 'necessary' | 'custom'
 * - `cookie-consent-date`: ISO timestamp
 * - `geo-consent`: 'granted' | 'denied'   ← consentimiento de geolocalización
 *
 * Con `cookie-consent === 'all'` → `geo-consent` se establece como 'granted'.
 * Con `cookie-consent === 'necessary'` → `geo-consent` se establece como 'denied'.
 * Con `cookie-consent === 'custom'` → el usuario elige individualmente.
 */
export default function CookieConsent({ onAcceptAll, onAcceptNecessary }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [geoEnabled, setGeoEnabled] = useState(true)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const saveAndClose = (cookieConsent: 'all' | 'necessary' | 'custom', geoConsent: boolean) => {
    const now = new Date().toISOString()
    localStorage.setItem('cookie-consent', cookieConsent)
    localStorage.setItem('cookie-consent-date', now)
    localStorage.setItem('geo-consent', geoConsent ? 'granted' : 'denied')
    setShowBanner(false)
  }

  const handleAcceptAll = () => {
    saveAndClose('all', true)
    onAcceptAll?.()
  }

  const handleAcceptNecessary = () => {
    saveAndClose('necessary', false)
    onAcceptNecessary?.()
  }

  const handleSaveCustom = () => {
    saveAndClose('custom', geoEnabled)
    if (analyticsEnabled) {
      onAcceptAll?.()
    } else {
      onAcceptNecessary?.()
    }
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
        <div className="public-cookie-banner mx-auto max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
          <div className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              {/* Contenido */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍪</span>
                  <h3 className="public-cookie-title font-primary text-xl font-bold">
                    Valoramos tu privacidad
                  </h3>
                </div>

                <p className="public-cookie-text text-base leading-relaxed">
                  Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación
                  y analizar el tráfico del sitio.
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="public-cookie-link ml-2 font-medium underline decoration-2 underline-offset-2 transition-colors"
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
                      <div className="public-cookie-detail mt-4 space-y-4 rounded-2xl p-4 text-sm">
                        {/* Esenciales — no toggle */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="public-cookie-primary-btn mt-0.5 h-2 w-2 shrink-0 rounded-full shadow-sm" />
                            <div>
                              <strong className="public-cookie-title block font-semibold">
                                Esenciales (Necesarias)
                              </strong>
                              <span className="public-cookie-muted">
                                Preferencias de tema, seguridad de sesión. No se pueden desactivar.
                              </span>
                            </div>
                          </div>
                          <span className="public-cookie-muted shrink-0 text-xs font-medium">
                            Siempre activas
                          </span>
                        </div>

                        {/* Analíticas — toggle */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="public-cookie-primary-btn mt-0.5 h-2 w-2 shrink-0 rounded-full shadow-sm" />
                            <div>
                              <strong className="public-cookie-title block font-semibold">
                                Analíticas (Opcionales)
                              </strong>
                              <span className="public-cookie-muted">
                                Nos ayudan a entender cómo usas la web (datos anónimos).
                              </span>
                            </div>
                          </div>
                          <button
                            role="switch"
                            aria-checked={analyticsEnabled}
                            onClick={() => setAnalyticsEnabled((v) => !v)}
                            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 ${
                              analyticsEnabled
                                ? 'public-cookie-toggle-on'
                                : 'public-cookie-toggle-off'
                            }`}
                          >
                            <span
                              className={`public-cookie-toggle-knob absolute top-0.5 left-0.5 h-5 w-5 rounded-full shadow transition-transform ${
                                analyticsEnabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Geolocalización — toggle */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="public-cookie-secondary-btn mt-0.5 h-2 w-2 shrink-0 rounded-full shadow-sm" />
                            <div>
                              <strong className="public-cookie-title block font-semibold">
                                Geolocalización (Opcional)
                              </strong>
                              <span className="public-cookie-muted">
                                Permite conocer tu ubicación aproximada para estadísticas de
                                visitas. Los datos son agregados, nunca rastreos individuales.
                              </span>
                            </div>
                          </div>
                          <button
                            role="switch"
                            aria-checked={geoEnabled}
                            onClick={() => setGeoEnabled((v) => !v)}
                            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 ${
                              geoEnabled ? 'public-cookie-toggle-on' : 'public-cookie-toggle-off'
                            }`}
                          >
                            <span
                              className={`public-cookie-toggle-knob absolute top-0.5 left-0.5 h-5 w-5 rounded-full shadow transition-transform ${
                                geoEnabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Guardar configuración personalizada */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSaveCustom}
                          className="public-cookie-secondary-btn w-full"
                        >
                          Guardar esta configuración
                        </Button>

                        <p className="public-cookie-muted border-t pt-3 text-xs">
                          Para más información, consulta nuestra{' '}
                          <a
                            href={ROUTES.public.privacy}
                            className="public-cookie-link font-medium hover:underline"
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
              <div className="flex flex-col gap-3 sm:flex-row md:min-w-75 md:flex-col lg:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAcceptNecessary}
                  className="public-cookie-secondary-btn rounded-xl"
                >
                  Solo necesarias
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleAcceptAll}
                  className="public-cookie-primary-btn rounded-xl shadow-lg"
                >
                  Aceptar todas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
