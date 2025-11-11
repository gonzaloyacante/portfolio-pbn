"use client"

import Link from "next/link"
import { ArrowLeft, Mail, Phone, MapPin, Instagram, Linkedin, MessageCircle } from "lucide-react"
import { Button } from "@/components/forms"
import ContactForm from "@/components/sections/contact-form"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-950 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-rose-300 dark:bg-rose-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-500"></div>
      </div>

      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 border-b border-rose-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            PBN
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/projects" className="text-sm hover:text-rose-600 transition-colors">Proyectos</Link>
            <Link href="/contact" className="text-sm font-medium text-rose-600">Contacto</Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Button asChild variant="ghost" size="sm" className="mb-8 hover:bg-rose-100 dark:hover:bg-rose-950 animate-fade-in-left">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Link>
          </Button>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Información de contacto */}
            <div className="space-y-8">
              <div className="animate-fade-in-up">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Trabajemos juntos
                </h1>
                <p className="text-xl text-slate-700 dark:text-zinc-300">
                  ¿Tienes un proyecto en mente? Me encantaría escucharlo y hacer realidad tu visión.
                </p>
              </div>

              <div className="space-y-4 animate-fade-in-up animation-delay-200">
                <div className="group p-5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-rose-200 dark:border-zinc-700">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-slate-900 dark:text-white">Email</h3>
                      <a href="mailto:paola@example.com" className="text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                        paola@example.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group p-5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-rose-200 dark:border-zinc-700">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-slate-900 dark:text-white">Teléfono</h3>
                      <a href="tel:+34600123456" className="text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                        +34 600 123 456
                      </a>
                    </div>
                  </div>
                </div>

                <div className="group p-5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-rose-200 dark:border-zinc-700">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-slate-900 dark:text-white">Ubicación</h3>
                      <p className="text-slate-600 dark:text-zinc-400">Granada, España</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Redes sociales */}
              <div className="animate-fade-in-up animation-delay-300">
                <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Sígueme en redes</h3>
                <div className="flex gap-4">
                  {[
                    { icon: Instagram, href: "#", color: "from-pink-500 to-rose-500" },
                    { icon: Linkedin, href: "#", color: "from-blue-500 to-cyan-500" },
                    { icon: MessageCircle, href: "#", color: "from-green-500 to-emerald-500" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-4 bg-gradient-to-br ${social.color} rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300`}
                    >
                      <social.icon className="w-6 h-6 text-white" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl border border-rose-200 dark:border-zinc-700 animate-fade-in-up animation-delay-100">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Envíame un mensaje</h2>
                <p className="text-slate-600 dark:text-zinc-400">Completa el formulario y te responderé lo antes posible</p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
