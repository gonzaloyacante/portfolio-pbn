"use client"

import Link from "next/link"
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header minimalista */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">PBN</Link>
          <div className="flex gap-6 items-center">
            <Link href="/projects" className="text-sm hover:text-zinc-600 transition">Proyectos</Link>
            <Link href="/contact" className="text-sm font-medium">Contacto</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Link>
          </Button>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Información de contacto */}
            <div>
              <h1 className="text-5xl font-bold mb-6">Trabajemos juntos</h1>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12">
                ¿Tienes un proyecto en mente? Me encantaría escucharlo.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <a href="mailto:paola@example.com" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                      paola@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Teléfono</h3>
                    <a href="tel:+34600123456" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                      +34 600 123 456
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Ubicación</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">Granada, España</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl">
              <form className="space-y-6">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input 
                    id="name" 
                    placeholder="Tu nombre" 
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Cuéntame sobre tu proyecto..." 
                    rows={6}
                    className="mt-2"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Enviar mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
