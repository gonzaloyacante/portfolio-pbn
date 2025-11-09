'use client'

import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-500"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10 animate-fade-in-up">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-black bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent leading-none animate-scale-in-pop">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 opacity-20 blur-3xl animate-glow"></div>
        </div>

        {/* Message */}
        <div className="space-y-4 mb-12 animate-fade-in animation-delay-200">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            ¡Ups! Página no encontrada
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            La página que buscas no existe o fue movida a otro lugar. 
            Pero no te preocupes, podemos ayudarte a encontrar lo que necesitas.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-300">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Ir al Inicio
          </Link>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-slate-200"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Ver Proyectos
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-4 animate-fade-in animation-delay-500">
          <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce animation-delay-100"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
        </div>
      </div>
    </div>
  )
}
