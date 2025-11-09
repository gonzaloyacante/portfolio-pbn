'use client'

import Link from 'next/link'
import { Home, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AdminNotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center animate-fade-in-up">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full mb-6 animate-scale-in-pop">
          <Settings className="w-12 h-12 text-rose-600 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Página no encontrada
        </h1>
        <p className="text-slate-600 mb-8">
          Esta sección del administrador no existe o no está disponible.
        </p>

        {/* Action */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <Home className="w-5 h-5" />
          Volver al Dashboard
        </Link>
      </div>
    </div>
  )
}
